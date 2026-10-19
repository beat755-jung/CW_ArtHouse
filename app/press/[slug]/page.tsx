import { notFound } from "next/navigation";
import Link from "next/link";
import { getExhibitionBySlug, getArtworksForExhibition } from "@/lib/artworks";
import ExhibitionGallery from "@/app/exhibition/[slug]/ExhibitionGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PressDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const exhibition = getExhibitionBySlug(slug);
  if (!exhibition) notFound();

  const artworks = getArtworksForExhibition(exhibition);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <Link
        href="/press"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-12"
      >
        ← Press
      </Link>

      <header className="max-w-2xl mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--accent)] mb-3">
          {exhibition.year}
        </p>
        <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight tracking-wide text-[var(--text)] mb-4">
          {exhibition.title}
        </h1>
        <p className="text-sm tracking-widest uppercase text-[var(--text-muted)] mb-4">
          {exhibition.venue} · {exhibition.location}
        </p>
        {exhibition.description && (
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            {exhibition.description}
          </p>
        )}
      </header>

      <ExhibitionGallery artworks={artworks} exhibitionImages={exhibition.images ?? []} />
    </div>
  );
}
