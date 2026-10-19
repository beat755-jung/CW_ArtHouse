"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { getArtworksByCategory, Category, Artwork } from "@/lib/artworks";
import ArtworkLightbox from "@/components/ArtworkLightbox";

const TABS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All Works" },
  { key: "ceramic", label: "Ceramic" },
  { key: "painting", label: "Painting" },
  { key: "drawing", label: "Drawing" },
  { key: "installation", label: "Installation" },
  { key: "press", label: "Press & Reviews" },
];

function groupByYear(artworks: Artwork[]): Map<number, Artwork[]> {
  const map = new Map<number, Artwork[]>();
  for (const artwork of artworks) {
    const list = map.get(artwork.year) ?? [];
    list.push(artwork);
    map.set(artwork.year, list);
  }
  return map;
}

export default function ArtistPage() {
  const [activeTab, setActiveTab] = useState<Category | "all">("all");
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  const filtered = getArtworksByCategory(activeTab);
  const byYear = groupByYear(filtered);
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  const openLightbox = useCallback(
    (images: string[], index: number, title: string) => {
      setLightbox({ images, index, title });
    },
    []
  );

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      {/* Header */}
      <header className="mb-12">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
          Archive
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)] mb-2">
          Hyeyoon Jung
        </h1>
        <p className="font-korean text-sm text-[var(--text-muted)] tracking-[0.1em]">
          정혜윤
        </p>
      </header>

      {/* Category tabs */}
      <nav className="flex flex-wrap gap-x-8 gap-y-3 mb-14 border-b border-[var(--border)] pb-6">
        {TABS.map(({ key, label }) => {
          const count = getArtworksByCategory(key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={[
                "relative text-xs tracking-[0.2em] uppercase pb-1 transition-colors duration-200",
                activeTab === key
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {label}
              <span className="ml-2 text-[var(--text-muted)]">({count})</span>
              {activeTab === key && (
                <span className="absolute -bottom-[25px] left-0 right-0 h-px bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Press & Reviews — editorial layout grouped by year */}
      {activeTab === "press" ? (
        <div>
          {years.map((year) => (
            <section key={year} className="mb-20">
              <div className="flex items-center gap-6 mb-10">
                <span className="font-display text-5xl text-[var(--accent)] opacity-40 leading-none select-none">
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="space-y-16">
                {byYear.get(year)!.map((artwork) => (
                  <article key={artwork.id}>
                    <div className="mb-6 pb-4 border-b border-[var(--border)]">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-1">
                        {artwork.medium}
                      </p>
                      <h2 className="font-display text-2xl text-[var(--text)]">
                        {artwork.title}
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{artwork.year}</p>
                      {artwork.description && (
                        <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed max-w-2xl">
                          {artwork.description}
                        </p>
                      )}
                    </div>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
                      {artwork.images.map((imgSrc, i) => (
                        <button
                          key={`${artwork.id}-${i}`}
                          className="artwork-card group w-full block break-inside-avoid cursor-pointer text-left"
                          onClick={() => openLightbox(artwork.images, i, artwork.title)}
                        >
                          <div className="relative overflow-hidden bg-[var(--bg-surface)]">
                            <Image
                              src={imgSrc}
                              alt={i === 0 ? artwork.title : `${artwork.title} — ${i + 1}`}
                              width={500}
                              height={700}
                              className="w-full h-auto transition-transform duration-700 group-hover:scale-105 select-none"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                              quality={70}
                              loading="lazy"
                            />
                            <div
                              className="absolute inset-0 z-10"
                              onContextMenu={(e) => e.preventDefault()}
                              aria-hidden
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Gallery — year-grouped masonry */
        <div>
          {years.map((year) => (
            <section key={year} className="mb-20">
              {/* Year marker */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-display text-5xl text-[var(--accent)] opacity-40 leading-none select-none">
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Masonry grid for this year */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
                {byYear.get(year)!.map((artwork) =>
                  artwork.images.map((imgSrc, i) => (
                    <button
                      key={`${artwork.id}-${i}`}
                      className="artwork-card group w-full block break-inside-avoid cursor-pointer text-left"
                      onClick={() => openLightbox(artwork.images, i, artwork.title)}
                    >
                      <div className="relative overflow-hidden bg-[var(--bg-surface)]">
                        <Image
                          src={imgSrc}
                          alt={i === 0 ? artwork.title : ""}
                          width={500}
                          height={700}
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105 select-none"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          quality={65}
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 z-10"
                          onContextMenu={(e) => e.preventDefault()}
                          aria-hidden
                        />
                      </div>
                      {i === 0 && (
                        <div className="artwork-info">
                          <p className="font-display text-sm text-white/90 leading-tight">
                            {artwork.title}
                          </p>
                          <p className="text-[10px] tracking-widest uppercase text-white/50 mt-0.5">
                            {artwork.medium} · {artwork.year}
                          </p>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {lightbox && (
        <ArtworkLightbox
          images={lightbox.images}
          current={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
          onPrev={() =>
            setLightbox((lb) =>
              lb
                ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }
                : null
            )
          }
          onNext={() =>
            setLightbox((lb) =>
              lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null
            )
          }
        />
      )}
    </div>
  );
}
