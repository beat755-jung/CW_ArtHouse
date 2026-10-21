/**
 * components/process/AnnotatedImage.tsx — 번호 마커 주석 사진 (클라이언트 컴포넌트)
 *
 * [동작]
 * - 마커 좌표는 lib/annotations.ts (원본 사진 기준 %) — 사진을 자르지 않고 원래 비율로 표시해 좌표 유지
 * - 마커 ↔ 아래 번호 목록: 마우스 오버·키보드 포커스 시 서로 강조
 * - onOpen 이 있으면 사진(마커 제외)을 눌러 라이트박스로 확대
 *
 * [좌표 찾기 모드 — 개발 전용]
 * - NODE_ENV=development 에서 URL 에 ?annotate=1 → 사진 클릭 시 % 좌표 표시·콘솔 출력
 * - 배포 빌드에서는 조건이 항상 false 라 동작하지 않음
 */
"use client";

import Image from "next/image";
import { useId, useState, useSyncExternalStore } from "react";
import type { Annotation } from "@/lib/annotations";

interface Props {
  id: string;
  src: string;
  alt: string;
  caption: string;
  annotations: Annotation[];
  labels: { annotationsLabel: string; openPhoto: string; annotateHint: string };
  locale: "ko" | "en";
  sizes: string;
  preload?: boolean;
  onOpen?: () => void;
  /** 세로 사진 등 폭 제한 */
  narrow?: boolean;
}

const noopSubscribe = () => () => {};
const readAnnotateFlag = () =>
  process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("annotate");

export default function AnnotatedImage({
  id, src, alt, caption, annotations, labels, locale, sizes, preload, onOpen, narrow,
}: Props) {
  const uid = useId();
  const [active, setActive] = useState<number | null>(null);
  const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
  const debug = useSyncExternalStore(noopSubscribe, readAnnotateFlag, () => false);

  const image = (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      className="block w-full h-auto select-none"
      draggable={false}
      {...(preload ? { preload: true } : {})}
    />
  );

  const handleProbe = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    setProbe({ x, y });
    console.info(`[annotate] ${id}: a(${x}, ${y}, "", ""),`);
  };

  return (
    <figure className={["m-0", narrow ? "max-w-sm" : ""].join(" ")}>
      <div className="relative">
        {debug ? (
          <div className="relative cursor-crosshair" onClick={handleProbe}>
            {image}
          </div>
        ) : onOpen ? (
          <button type="button" onClick={onOpen} aria-label={`${labels.openPhoto}: ${alt}`} className="block w-full cursor-zoom-in">
            {image}
          </button>
        ) : (
          image
        )}

        {annotations.map((m, i) => {
          const on = active === i;
          return (
            <button
              key={i}
              type="button"
              aria-describedby={`${uid}-n${i}`}
              aria-label={String(i + 1)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(i)}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className={[
                "absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
                "w-6 h-6 md:w-7 md:h-7 rounded-full border text-[11px] md:text-xs font-medium",
                "ring-2 ring-[var(--bg)]/60 transition-colors duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]",
                on
                  ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
                  : "bg-[var(--bg)]/85 text-[var(--accent)] border-[var(--accent)]",
              ].join(" ")}
            >
              {i + 1}
            </button>
          );
        })}

        {debug && probe && (
          <span
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--text)] pointer-events-none"
            style={{ left: `${probe.x}%`, top: `${probe.y}%` }}
          />
        )}
      </div>

      {debug && (
        <p className="mt-2 text-xs text-[var(--accent)]">
          {labels.annotateHint}
          {probe && <span className="ml-2 font-mono text-[var(--text)]">{id}: x {probe.x}, y {probe.y}</span>}
        </p>
      )}

      <figcaption className="mt-3 text-xs text-[var(--text-muted)] [word-break:keep-all]">{caption}</figcaption>

      {annotations.length > 0 && (
        <ol aria-label={labels.annotationsLabel} className="list-none m-0 p-0 mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {annotations.map((m, i) => {
            const on = active === i;
            return (
              <li
                key={i}
                id={`${uid}-n${i}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={[
                  "flex items-start gap-2.5 text-sm leading-snug transition-colors duration-200 [word-break:keep-all]",
                  on ? "text-[var(--text)]" : "text-[var(--text-muted)]",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "shrink-0 mt-px flex items-center justify-center w-5 h-5 rounded-full border text-[10px]",
                    on ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]" : "text-[var(--accent)] border-[var(--accent)]/60",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <span>{m.label[locale]}</span>
              </li>
            );
          })}
        </ol>
      )}
    </figure>
  );
}
