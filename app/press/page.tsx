import { getArtworksForExhibition, pressByYear } from "@/lib/artworks";
import ExhibitionCardClient from "@/app/exhibition/ExhibitionCardClient";

export const metadata = {
  title: "Press & Reviews — Hyeyoon Jung (Lilly)",
};

export default function PressPage() {
  const byYear = pressByYear();
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <header className="mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
          Archive
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)]">
          Press
        </h1>
      </header>

      <div className="max-w-4xl">
        {years.map((year) => {
          const exList = byYear.get(year) ?? [];
          return (
            <section key={year} className="mb-20">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-display text-5xl text-[var(--accent)] opacity-40 leading-none select-none">
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <ul className="flex flex-col gap-12 list-none m-0 p-0">
                {exList.map((ex) => {
                  const artworks = getArtworksForExhibition(ex);
                  const preview = artworks.slice(0, 3);
                  const hasExhibitionImages =
                    ex.coverImage != null || (ex.images?.length ?? 0) > 0;
                  const lightboxImages = [
                    ...(ex.coverImage ? [ex.coverImage] : []),
                    ...(ex.images ?? []),
                    ...(!hasExhibitionImages ? artworks.flatMap((a) => a.images) : []),
                  ];
                  return (
                    <ExhibitionCardClient
                      key={ex.id}
                      id={ex.id}
                      slug={ex.slug}
                      title={ex.title}
                      venue={ex.venue}
                      location={ex.location}
                      description={ex.description}
                      coverImage={ex.coverImage}
                      lightboxImages={lightboxImages}
                      artworkPreviews={preview.map((a) => ({
                        id: a.id,
                        src: a.coverImage,
                        title: a.title,
                      }))}
                      extraArtworksCount={artworks.length > 3 ? artworks.length - 3 : 0}
                      basePath="/press"
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
