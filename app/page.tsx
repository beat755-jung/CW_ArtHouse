/**
 * app/page.tsx — 홈 페이지 (클라이언트 컴포넌트)
 *
 * [Hero 섹션]
 * - Artti 원작의 분절된 신체 이미지 배치에서 영감받아,
 *   실제 작품 6점을 각기 다른 위치·각도·딜레이로 배경에 부유시킵니다.
 * - 이미지 opacity 35% + radial-gradient 비네트로 중앙 텍스트 가독성 확보
 * - 페이지 진입 100ms 후 visible=true → CSS transition으로 순차 등장
 *
 * [Featured Works 섹션]
 * - lib/artworks.ts 의 featured:true 작품 최대 6개 표시
 * - artwork-card hover: 어두운 오버레이 + 작품명 슬라이드 업
 *
 * [heroFragments 이미지 선택 기준]
 * - 시리즈별 대표 이미지 각 1장, 화면 모서리·가장자리에 배치하여
 *   Artti 특유의 '파편화된 구성' 미학을 재현합니다.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedArtworks } from "@/lib/artworks";

// Six featured images to float in the background like Artti's fragmented body
const heroFragments = [
  {
    src: "/artist/2024_year_a/scribbles-on-the-wall/1231_HYEYOON-54.jpg",
    style: { top: "8%", left: "3%", width: "22vw", rotate: "-3deg", delay: 0.4 },
  },
  {
    src: "/artist/2025_year_a/2025.03.04_Pond leathers_ceramic-sea-leather/1231_HYEYOON-11.jpg",
    style: { top: "15%", right: "4%", width: "18vw", rotate: "2deg", delay: 0.7 },
  },
  {
    src: "/artist/2025_year_a/2025.01.10_birds-of-prey/1231_HYEYOON-113.jpg",
    style: { bottom: "18%", left: "2%", width: "20vw", rotate: "1.5deg", delay: 1.0 },
  },
  {
    src: "/artist/2025_year_a/2025.02.13_Stars-in-our-palm/1231_HYEYOON-25.jpg",
    style: { bottom: "10%", right: "5%", width: "16vw", rotate: "-2deg", delay: 0.9 },
  },
  {
    src: "/artist/2025_year_a/2025.01.06_ugly-duckling/1231_HYEYOON-130.jpg",
    style: { top: "52%", left: "6%", width: "14vw", rotate: "3deg", delay: 1.2 },
  },
  {
    src: "/artist/2025_year_a/2025.01.19_SEE-and-SAW_ceramic/1231_HYEYOON-93.jpg",
    style: { top: "38%", right: "2%", width: "15vw", rotate: "-1.5deg", delay: 1.1 },
  },
];

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const featured = getFeaturedArtworks().slice(0, 6);

  return (
    <>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]">
        {/* Floating image fragments (Artti-inspired layered composition) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {heroFragments.map((frag, i) => (
            <div
              key={i}
              className="absolute overflow-hidden"
              style={{
                top: frag.style.top,
                bottom: (frag.style as { bottom?: string }).bottom,
                left: (frag.style as { left?: string }).left,
                right: (frag.style as { right?: string }).right,
                width: frag.style.width,
                aspectRatio: "3/4",
                transform: `rotate(${frag.style.rotate})`,
                opacity: visible ? 0.35 : 0,
                transition: `opacity 1.4s ease ${frag.style.delay}s, transform 1.4s ease ${frag.style.delay}s`,
                transitionProperty: "opacity, transform",
              }}
            >
              <Image
                src={frag.src}
                alt=""
                fill
                className="object-cover select-none"
                sizes="22vw"
                draggable={false}
                quality={60}
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Protective overlay */}
              <div
                className="absolute inset-0 z-10"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>

        {/* Dark vignette to keep center legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(7,7,7,0.7) 100%)",
          }}
          aria-hidden
        />

        {/* Center text */}
        <div className="relative z-10 text-center px-6">
          <p
            className="text-xs tracking-[0.4em] uppercase text-[var(--text-muted)] mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
            }}
          >
            Artist Portfolio
          </p>

          <h1
            className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-wide text-[var(--text)] mb-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1.1s ease 0.45s, transform 1.1s ease 0.45s",
            }}
          >
            Hyeyoon Jung
          </h1>

          <p
            className="font-korean text-[clamp(0.85rem,1.4vw,1.1rem)] text-[var(--text-muted)] tracking-[0.15em] mb-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 1s ease 0.58s, transform 1s ease 0.58s",
            }}
          >
            정혜윤
          </p>

          <p
            className="font-display text-[clamp(1.2rem,2.5vw,2rem)] text-[var(--accent)] tracking-[0.3em] italic mb-12"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 1.1s ease 0.72s, transform 1.1s ease 0.72s",
            }}
          >
            Lilly
          </p>

          <div
            className="flex items-center justify-center gap-8"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 1s",
            }}
          >
            <Link
              href="/exhibition"
              className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] hover:border-[var(--text-muted)] pb-1"
            >
              Exhibition
            </Link>
            <span className="w-px h-4 bg-[var(--border)]" />
            <Link
              href="/artist"
              className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] hover:border-[var(--text-muted)] pb-1"
            >
              Works
            </Link>
            <span className="w-px h-4 bg-[var(--border)]" />
            <Link
              href="/press"
              className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] hover:border-[var(--text-muted)] pb-1"
            >
              Press
            </Link>
            <span className="w-px h-4 bg-[var(--border)]" />
            <Link
              href="/about"
              className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-b border-[var(--border)] hover:border-[var(--text-muted)] pb-1"
            >
              About
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: visible ? 0.4 : 0,
            transition: "opacity 1s ease 1.6s",
          }}
          aria-hidden
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)]">
            Scroll
          </span>
          <span className="block w-px h-10 bg-[var(--border)] animate-pulse" />
        </div>
      </section>

      {/* ── Featured Works ───────────────────────────────── */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl tracking-wide text-[var(--text)]">
            Selected Works
          </h2>
          <Link
            href="/artist"
            className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            View all →
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((artwork, i) => (
            <Link
              key={artwork.id}
              href={`/artist?series=${artwork.seriesSlug}`}
              className="artwork-card group block"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
                <Image
                  src={artwork.coverImage}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
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
              <div className="artwork-info">
                <p className="font-display text-sm text-white/90 leading-tight">
                  {artwork.title}
                </p>
                <p className="text-[10px] tracking-widest uppercase text-white/50 mt-0.5">
                  {artwork.medium} · {artwork.year}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} Hyeyoon Jung (Lilly). All rights reserved.
        </p>
        <a
          href="https://www.instagram.com/hyeyoonlillyjung"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          @hyeyoonlillyjung
        </a>
      </footer>
    </>
  );
}
