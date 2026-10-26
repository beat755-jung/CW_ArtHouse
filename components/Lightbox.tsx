/**
 * components/Lightbox.tsx — 이미지 라이트박스 대화상자 (클라이언트 컴포넌트)
 *
 * [역할]
 * - 갤러리에서 이미지 클릭 시 전체화면 대화상자로 크게 표시 (MasonryGallery · StepMedia 에서 사용)
 *
 * [조작]
 * - ← / → : 이전/다음 · ESC : 닫기 · 배경 클릭 : 닫기 · ‹ / › 버튼
 *
 * [접근성 — WCAG]
 * - role="dialog" + aria-modal + aria-label(사진 설명)
 * - 열리면 닫기 버튼으로 포커스 이동, Tab/Shift+Tab 은 대화상자 안에서만 순환
 * - 닫으면 열기 전 포커스(눌렀던 썸네일)로 돌아감
 * - 열린 동안 body 스크롤 잠금
 * - 버튼 라벨은 <html lang> 기준 ko/en
 */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface LightboxProps {
  images: string[];
  current: number;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const LABELS = {
  ko: { close: "닫기", prev: "이전 사진", next: "다음 사진", dialog: "사진 크게 보기" },
  en: { close: "Close", prev: "Previous photo", next: "Next photo", dialog: "Photo viewer" },
};

export default function Lightbox({ images, current, title, onClose, onPrev, onNext }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // 라이트박스는 클릭 후에만 렌더되므로 document 사용 가능
  const t = typeof document !== "undefined" && document.documentElement.lang === "en" ? LABELS.en : LABELS.ko;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose, onPrev, onNext],
  );

  // 열 때 포커스 이동 · 닫을 때 원래 위치로 복귀
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const btn = "absolute text-white/80 hover:text-white motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.dialog}: ${title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Image */}
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto my-auto px-16" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full">
          <Image src={images[current]} alt={title} fill className="object-contain select-none" sizes="90vw" preload draggable={false} />
        </div>
      </div>

      <button ref={closeRef} type="button" onClick={onClose} className={`${btn} top-6 right-6 text-2xl leading-none p-2`} aria-label={t.close}>
        ✕
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className={`${btn} left-4 top-1/2 -translate-y-1/2 p-4 text-2xl`}
          aria-label={t.prev}
        >
          ‹
        </button>
      )}

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={`${btn} right-4 top-1/2 -translate-y-1/2 p-4 text-2xl`}
          aria-label={t.next}
        >
          ›
        </button>
      )}

      {/* Counter + title */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-6 w-full max-w-3xl" aria-live="polite">
        <p className="font-display text-white/90 text-sm tracking-widest [word-break:keep-all]">{title}</p>
        <p className="text-white/75 text-xs mt-1">
          {current + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
