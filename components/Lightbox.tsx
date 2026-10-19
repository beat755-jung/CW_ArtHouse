/**
 * components/Lightbox.tsx — 이미지 라이트박스 뷰어 (클라이언트 컴포넌트)
 *
 * [역할]
 * - 갤러리에서 이미지 클릭 시 전체화면 오버레이로 고화질 표시
 * - images 배열을 받아 슬라이드쇼 형태로 탐색 (MasonryGallery에서 사용)
 *
 * [조작 방법]
 * - ← / → 키보드 : 이전/다음 이미지
 * - ESC 키       : 닫기
 * - 배경 클릭    : 닫기
 * - ‹ / › 버튼   : 이전/다음 이미지
 *
 * [이미지 보호]
 * - ProtectedImage 사용으로 라이트박스 내에서도 우클릭·드래그 차단
 * - quality=85 (일반 갤러리보다 높은 품질, 그러나 원본 미만)
 *
 * [접근성]
 * - 열리면 body overflow:hidden 으로 스크롤 잠금 (언마운트 시 복원)
 */
"use client";

import { useEffect, useCallback } from "react";
import ProtectedImage from "./ProtectedImage";

interface LightboxProps {
  images: string[];
  current: number;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  current,
  title,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto my-auto px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <ProtectedImage
            src={images[current]}
            alt={title}
            fill
            className="object-contain"
            sizes="90vw"
            priority
            quality={85}
          />
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-2xl leading-none"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 text-2xl"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 text-2xl"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Counter + title */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="font-display text-white/80 text-sm tracking-widest">
          {title}
        </p>
        <p className="text-white/40 text-xs mt-1">
          {current + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
