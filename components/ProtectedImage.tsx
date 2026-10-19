/**
 * components/ProtectedImage.tsx — 저작권 보호 이미지 래퍼 (클라이언트 컴포넌트)
 *
 * [역할]
 * - next/image 의 최적화 기능을 유지하면서 보호 레이어를 추가
 * - fill 모드와 고정 크기 모드 모두 지원
 *
 * [보호 방법]
 * - onContextMenu / onDragStart : 이벤트 기본 동작 차단
 * - draggable=false             : HTML 드래그 속성 비활성화
 * - 투명 div 오버레이          : 이미지 위에 클릭 흡수 레이어
 * - opacity 페이드인           : 이미지 로드 완료 후 부드럽게 표시
 *
 * [사용 예시]
 * <ProtectedImage src="/artworks/..." alt="작품명" fill quality={75} />
 *
 * [주의]
 * - GlobalProtection 과 함께 사용해야 완전한 보호 적용
 * - quality prop 기본값 75 (웹 감상용, 원본 고화질 직접 노출 방지)
 */
"use client";

import Image from "next/image";
import { useState } from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export default function ProtectedImage({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  sizes,
  priority,
  quality = 75,
}: ProtectedImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
  const handleDragStart = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="img-protected"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className={[
            "select-none transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            className,
          ].join(" ")}
          onLoad={() => setLoaded(true)}
          priority={priority}
          quality={quality}
          draggable={false}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 800}
          height={height ?? 600}
          sizes={sizes}
          className={[
            "select-none transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            className,
          ].join(" ")}
          onLoad={() => setLoaded(true)}
          priority={priority}
          quality={quality}
          draggable={false}
        />
      )}
      {/* transparent overlay: blocks right-click on the image itself */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        aria-hidden
      />
    </div>
  );
}
