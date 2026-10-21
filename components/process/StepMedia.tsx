/**
 * components/process/StepMedia.tsx — 공정 단계의 사진 영역 (클라이언트 컴포넌트)
 *
 * [구성]
 * - items[0]           : 대표 사진 (주석 있으면 번호 마커)
 * - items[1..featured) : 주석이 있는 추가 사진 (대표 아래에 작게)
 * - 나머지             : 썸네일 그리드 — 최대 8칸, 넘치면 마지막 칸 "+N"
 * - pending            : "사진 준비 중" 칸 (그리드 끝, 항상 표시)
 * - 모든 사진은 기존 Lightbox 로 확대 (← → ESC)
 *
 * [근거 사진 연결]
 * - EvidenceLink 가 보내는 "cw:open-photo" 이벤트의 ID 가 items 에 있으면 해당 사진을 연다
 */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "@/components/Lightbox";
import AnnotatedImage from "@/components/process/AnnotatedImage";
import { OPEN_PHOTO_EVENT } from "@/components/process/EvidenceLink";
import PhotoPlaceholder from "@/components/process/PhotoPlaceholder";
import type { Annotation } from "@/lib/annotations";

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  annotations: Annotation[];
  portrait?: boolean;
}

interface Props {
  items: MediaItem[];
  /** 대표 + 주석 추가 사진 개수 (items 앞부분) */
  featured: number;
  pending: string[];
  locale: "ko" | "en";
  preloadLead?: boolean;
  labels: {
    photoPending: string;
    noPhotosYet: string;
    morePhotos: string;
    openPhoto: string;
    annotationsLabel: string;
    annotateHint: string;
  };
}

const MAX_TILES = 8;

export default function StepMedia({ items, featured, pending, locale, preloadLead, labels }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = items.findIndex((it) => it.id === (e as CustomEvent<string>).detail);
      if (i >= 0) setIndex(i);
    };
    window.addEventListener(OPEN_PHOTO_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PHOTO_EVENT, onOpen);
  }, [items]);

  const lead = items[0];
  const extras = items.slice(1, featured);
  const rest = items.slice(featured);

  const limit = Math.max(1, MAX_TILES - pending.length);
  const overflow = rest.length > limit;
  const shown = overflow ? rest.slice(0, limit) : rest;
  const hiddenCount = rest.length - limit + 1;

  const annotationLabels = {
    annotationsLabel: labels.annotationsLabel,
    openPhoto: labels.openPhoto,
    annotateHint: labels.annotateHint,
  };

  return (
    <div className="min-w-0">
      {lead ? (
        <AnnotatedImage
          id={lead.id}
          src={lead.src}
          alt={lead.alt}
          caption={lead.caption}
          annotations={lead.annotations}
          labels={annotationLabels}
          locale={locale}
          sizes="(max-width: 1279px) 90vw, 50vw"
          preload={preloadLead}
          narrow={lead.portrait}
          onOpen={() => setIndex(0)}
        />
      ) : (
        <PhotoPlaceholder size="lead" title={labels.photoPending} detail={labels.noPhotosYet} />
      )}

      {extras.map((it, k) => (
        <div key={it.id} className="mt-10">
          <AnnotatedImage
            id={it.id}
            src={it.src}
            alt={it.alt}
            caption={it.caption}
            annotations={it.annotations}
            labels={annotationLabels}
            locale={locale}
            sizes="(max-width: 640px) 90vw, 24rem"
            narrow={it.portrait}
            onOpen={() => setIndex(1 + k)}
          />
        </div>
      ))}

      {(shown.length > 0 || pending.length > 0) && (
        <ul className="list-none m-0 p-0 mt-8 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {shown.map((it, k) => {
            const i = featured + k;
            const isMore = overflow && k === shown.length - 1;
            return (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={isMore ? labels.morePhotos.replace("{n}", String(hiddenCount)) : `${labels.openPhoto}: ${it.alt}`}
                  className="group relative block w-full aspect-[4/3] overflow-hidden bg-[var(--bg-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 30vw, (max-width: 1279px) 22vw, 12vw"
                    className="object-cover select-none transition-transform duration-500 motion-safe:group-hover:scale-105"
                    draggable={false}
                  />
                  {isMore && (
                    <span className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/70 font-display text-2xl text-[var(--text)]">
                      +{hiddenCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {pending.map((p) => (
            <li key={p}>
              <PhotoPlaceholder title={labels.photoPending} detail={p} />
            </li>
          ))}
        </ul>
      )}

      {index !== null && items[index] && (
        <Lightbox
          images={items.map((it) => it.src)}
          current={index}
          title={items[index].caption}
          onClose={() => setIndex(null)}
          onPrev={() => setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))}
          onNext={() => setIndex((i) => (i === null ? null : (i + 1) % items.length))}
        />
      )}
    </div>
  );
}
