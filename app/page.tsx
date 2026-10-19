/**
 * app/page.tsx — 홈 페이지 (클라이언트 컴포넌트)
 *
 * [Hero 섹션]
 * - 미니하우스 이미지 6점을 각기 다른 위치·각도·딜레이로 배경에 부유시킵니다.
 * - 이미지 opacity 35% + radial-gradient 비네트로 중앙 텍스트 가독성 확보
 * - 페이지 진입 100ms 후 visible=true → CSS transition으로 순차 등장
 *
 * [Featured 섹션]
 * - lib/projects.ts 의 featured:true 프로젝트 표시
 * - 값이 없는 항목은 "[확인 필요]"로 표시 (t() 헬퍼)
 *
 * [heroFragments 이미지 선택 기준]
 * - docs/image-inventory.md 4-1절 Hero 후보 (실사 5점 + 인테리어 분위기 샘플 1점)
 * - out-08(휴대폰 UI 포함), in-09(창밖 아파트)는 크롭 후 추가 예정
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects, getCoverImage, t, PROJECT_TYPE_LABEL } from "@/lib/projects";

const P1 = "/projects/prototype-01";

// Six images floating in the background
const heroFragments = [
  {
    src: `${P1}/exterior/ing-05.jpg`,
    style: { top: "8%", left: "3%", width: "22vw", rotate: "-3deg", delay: 0.4 },
  },
  {
    src: `${P1}/exterior/ing-08.jpg`,
    style: { top: "15%", right: "4%", width: "18vw", rotate: "2deg", delay: 0.7 },
  },
  {
    src: `${P1}/exterior/ing-02.jpg`,
    style: { bottom: "18%", left: "2%", width: "20vw", rotate: "1.5deg", delay: 1.0 },
  },
  {
    src: `${P1}/process/ing-18.jpg`,
    style: { bottom: "10%", right: "5%", width: "16vw", rotate: "-2deg", delay: 0.9 },
  },
  {
    src: `${P1}/process/ing-11.jpg`,
    style: { top: "52%", left: "6%", width: "14vw", rotate: "3deg", delay: 1.2 },
  },
  {
    src: `${P1}/interior/in-07.jpg`,
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

  const featured = getFeaturedProjects().slice(0, 6);

  return (
    <>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]">
        {/* Floating image fragments */}
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
            Mini House — Design · Build
          </p>

          <h1
            className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-wide text-[var(--text)] mb-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1.1s ease 0.45s, transform 1.1s ease 0.45s",
            }}
          >
            CW_ArtHouse
          </h1>

          <p
            className="font-korean text-[clamp(0.85rem,1.4vw,1.1rem)] text-[var(--text-muted)] tracking-[0.15em] mb-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 1s ease 0.58s, transform 1s ease 0.58s",
            }}
          >
            미니하우스 설계 · 제작 · 판매
          </p>

          <p
            className="font-display text-[clamp(1.2rem,2.5vw,2rem)] text-[var(--accent)] tracking-[0.3em] italic mb-12"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 1.1s ease 0.72s, transform 1.1s ease 0.72s",
            }}
          >
            Jung Chang-Won
          </p>

          <div
            className="flex items-center justify-center gap-8"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 1s",
            }}
          >
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

      {/* ── Featured Projects ────────────────────────────── */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl tracking-wide text-[var(--text)]">
            Projects
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((project, i) => {
            const cover = getCoverImage(project);
            return (
              <article
                key={project.slug}
                className="artwork-card group block"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={cover.alt.ko}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      quality={70}
                      loading="lazy"
                    />
                  )}
                  <div
                    className="absolute inset-0 z-10"
                    onContextMenu={(e) => e.preventDefault()}
                    aria-hidden
                  />
                </div>
                <div className="artwork-info">
                  <p className="font-display text-sm text-white/90 leading-tight">
                    {t(project.name)}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase text-white/50 mt-0.5">
                    {t(project.type ? PROJECT_TYPE_LABEL[project.type] : null)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} CW_ArtHouse. All rights reserved.
        </p>
      </footer>
    </>
  );
}
