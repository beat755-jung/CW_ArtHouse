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
import type { Locale, ProjectImage } from "@/lib/projects";

// lib/projects 의 값(데이터 배열)을 클라이언트 번들에 넣지 않도록 표기만 여기 둔다 (RENDER_LABEL 과 같은 값)
const RENDER_LABEL = { ko: "렌더", en: "Render" } as const;

interface Props {
  images: ProjectImage[];
  locale?: Locale;
  /** 한 번에 보여줄 장수. 넘치면 "더 보기" 버튼 (미지정 시 전부) */
  pageSize?: number;
  /** "사진 {n}장 더 보기" 형식 */
  showMoreLabel?: string;
}

export default function MasonryGallery({ images, locale = "ko", pageSize, showMoreLabel = "+{n}" }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(pageSize ?? images.length);

  if (images.length === 0) return null;
  const visible = images.slice(0, shown);
  const remaining = images.length - visible.length;

  const captionOf = (img: ProjectImage) =>
    img.kind === "render" ? `${img.alt[locale]} · ${RENDER_LABEL[locale]}` : img.alt[locale];

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {visible.map((img, i) => (
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

      {remaining > 0 && pageSize && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + pageSize)}
            className="h-11 px-6 border border-[var(--text)]/30 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] motion-safe:transition-colors"
          >
            {showMoreLabel.replace("{n}", String(Math.min(pageSize, remaining)))}
            <span className="ml-2 text-[var(--text-muted)]">({visible.length} / {images.length})</span>
          </button>
        </div>
      )}

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
