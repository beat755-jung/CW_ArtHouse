"use client";

import Image from "next/image";
import { useState } from "react";
import { Artwork } from "@/lib/artworks";
import ArtworkLightbox from "@/components/ArtworkLightbox";

interface LightboxState {
  images: string[];
  index: number;
  title: string;
}

interface Props {
  artworks: Artwork[];
  exhibitionImages: string[];
}

interface ImageGridProps {
  images: string[];
  getLabel: (i: number) => string;
  onOpen: (i: number) => void;
}

function ImageGrid({ images, getLabel, onOpen }: ImageGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((imgSrc, i) => (
          <button
            key={`img-${i}`}
            className="artwork-card group w-full block break-inside-avoid cursor-pointer text-left"
            onClick={() => onOpen(i)}
          >
            <div className="relative overflow-hidden bg-[var(--bg-surface)]">
              <Image
                src={imgSrc}
                alt={getLabel(i)}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105 select-none"
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
  );
}

export default function ExhibitionGallery({ artworks, exhibitionImages }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (images: string[], index: number, title: string) =>
    setLightbox({ images, index, title });

  const closeLightbox = () => setLightbox(null);

  return (
    <>
      {exhibitionImages.length > 0 && (
        <div className="mb-12">
          <ImageGrid
            images={exhibitionImages}
            getLabel={(i) => `Exhibition view ${i + 1}`}
            onOpen={(i) => openLightbox(exhibitionImages, i, "Exhibition View")}
          />
        </div>
      )}

      {artworks.length > 0 && (
        <div className="flex flex-col gap-12">
          {artworks.map((artwork) => (
            <ImageGrid
              key={artwork.id}
              images={artwork.images}
              getLabel={(i) => `${artwork.title} — ${i + 1}`}
              onOpen={(i) => openLightbox(artwork.images, i, artwork.title)}
            />
          ))}
        </div>
      )}

      {lightbox && (
        <ArtworkLightbox
          images={lightbox.images}
          current={lightbox.index}
          title={lightbox.title}
          onClose={closeLightbox}
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
    </>
  );
}
