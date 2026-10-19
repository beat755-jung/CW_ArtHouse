/**
 * components/MasonryGallery.tsx — 마소나리 이미지 그리드 + 라이트박스 (클라이언트 컴포넌트)
 *
 * [역할]
 * - ProjectImage 배열을 CSS columns 마소나리로 배치하고, 클릭 시 Lightbox로 확대
 * - 렌더 이미지(kind: "render")에는 "렌더" 표기를 붙여 실사와 구분 (CLAUDE.md 콘텐츠 규칙)
 *
 * [사용 예시]
 * <MasonryGallery images={project.images.process} />
 */
"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import { RENDER_LABEL, type Locale, type ProjectImage } from "@/lib/projects";

interface Props {
  images: ProjectImage[];
  locale?: Locale;
}

export default function MasonryGallery({ images, locale = "ko" }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const captionOf = (img: ProjectImage) =>
    img.kind === "render" ? `${img.alt[locale]} · ${RENDER_LABEL[locale]}` : img.alt[locale];

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            className="artwork-card group w-full block break-inside-avoid cursor-pointer text-left"
            onClick={() => setIndex(i)}
          >
            <div className="relative overflow-hidden bg-[var(--bg-surface)]">
              <Image
                src={img.src}
                alt={img.alt[locale]}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-700 motion-safe:group-hover:scale-105 select-none"
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
              {img.kind === "render" && (
                <span className="absolute top-2 left-2 z-20 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 bg-[var(--bg)]/70 text-[var(--accent)]">
                  {RENDER_LABEL[locale]}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {index !== null && (
        <Lightbox
          images={images.map((img) => img.src)}
          current={index}
          title={captionOf(images[index])}
          onClose={() => setIndex(null)}
          onPrev={() => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))}
          onNext={() => setIndex((i) => (i === null ? null : (i + 1) % images.length))}
        />
      )}
    </>
  );
}
