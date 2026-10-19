"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ArtworkLightbox from "@/components/ArtworkLightbox";

interface ArtworkPreview {
  id: string;
  src: string;
  title: string;
}

interface Props {
  id: string;
  slug: string;
  title: string;
  venue: string;
  location: string;
  description?: string;
  coverImage?: string;
  lightboxImages: string[];
  artworkPreviews: ArtworkPreview[];
  extraArtworksCount: number;
  basePath?: string;
}

export default function ExhibitionCardClient({
  slug,
  title,
  venue,
  location,
  description,
  coverImage,
  lightboxImages,
  artworkPreviews,
  extraArtworksCount,
  basePath = "/exhibition",
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasLightbox = lightboxImages.length > 0;

  return (
    <li>
      <div className="group flex flex-col sm:flex-row gap-6 items-start">
        {/* Thumbnail strip */}
        <div className="flex gap-1 shrink-0">
          {coverImage ? (
            <button
              className="relative overflow-hidden bg-[var(--bg-surface)] cursor-pointer"
              style={{ width: 72, height: 90 }}
              onClick={() => hasLightbox && setLightboxIndex(0)}
              aria-label={`View ${title} images`}
            >
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                sizes="72px"
                draggable={false}
                quality={55}
                loading="lazy"
              />
              <div className="absolute inset-0 z-10" aria-hidden />
            </button>
          ) : (
            <>
              {artworkPreviews.map((art, i) =>
                hasLightbox && i === 0 ? (
                  <button
                    key={art.id}
                    className="relative overflow-hidden bg-[var(--bg-surface)] cursor-pointer"
                    style={{ width: 72, height: 90 }}
                    onClick={() => setLightboxIndex(0)}
                    aria-label={`View ${title} images`}
                  >
                    <Image
                      src={art.src}
                      alt={art.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                      sizes="72px"
                      draggable={false}
                      quality={55}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 z-10" aria-hidden />
                  </button>
                ) : (
                  <div
                    key={art.id}
                    className="relative overflow-hidden bg-[var(--bg-surface)]"
                    style={{ width: 72, height: 90 }}
                  >
                    <Image
                      src={art.src}
                      alt={art.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                      sizes="72px"
                      draggable={false}
                      quality={55}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 z-10" aria-hidden />
                  </div>
                )
              )}
              {extraArtworksCount > 0 && (
                <div
                  className="flex items-center justify-center bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs"
                  style={{ width: 72, height: 90 }}
                >
                  +{extraArtworksCount}
                </div>
              )}
            </>
          )}
        </div>

        {/* Text — links to detail page */}
        <Link
          href={`${basePath}/${slug}`}
          className="flex-1 pt-1"
        >
          <h2 className="font-display text-xl md:text-2xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight mb-2">
            {title}
          </h2>
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
            {venue} · {location}
          </p>
          {description && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-lg line-clamp-2">
              {description}
            </p>
          )}
          <span className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            View Exhibition →
          </span>
        </Link>
      </div>

      {lightboxIndex !== null && (
        <ArtworkLightbox
          images={lightboxImages}
          current={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((idx) =>
              idx !== null ? (idx - 1 + lightboxImages.length) % lightboxImages.length : null
            )
          }
          onNext={() =>
            setLightboxIndex((idx) =>
              idx !== null ? (idx + 1) % lightboxImages.length : null
            )
          }
        />
      )}
    </li>
  );
}
