/**
 * components/Navigation.tsx — 전역 네비게이션 (클라이언트 컴포넌트)
 *
 * [데스크톱: 좌측 고정 사이드바]
 * - Artti 원작의 세로 고정 메뉴 구조를 현대적으로 재해석
 * - 상단: 작가명(Hyeyoon Jung / Lilly) — 홈 링크
 * - 중앙: Exhibition / Artist / About 링크
 *   - 현재 경로 일치 시 amber 점(●) 왼쪽에 표시
 * - 하단: 저작권 연도 표기
 * - 너비: CSS 변수 --nav-width (220px), globals.css에서 page-content와 연동
 *
 * [모바일: 상단 고정 바 + 오버레이 메뉴]
 * - 스크롤 40px 이후 배경 배경색 전환 (투명 → #070707)
 * - 햄버거 아이콘: 3선 → X 애니메이션
 * - 메뉴 오픈 시 전체화면 오버레이, 라우트 이동 시 자동 닫힘
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/exhibition", label: "Exhibition" },
  { href: "/artist", label: "Works" },
  { href: "/press", label: "Press" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Desktop Left Sidebar ─────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex fixed left-0 top-0 h-full flex-col justify-between px-8 py-10 z-50"
        style={{ width: "var(--nav-width)", borderRight: "1px solid var(--border)" }}
      >
        {/* Logo / Artist name */}
        <Link href="/" className="group block">
          <span className="font-display block text-xs tracking-[0.25em] text-[var(--text-muted)] uppercase mb-1 transition-colors group-hover:text-[var(--accent)]">
            Hyeyoon Jung
          </span>
          <span className="font-korean block text-sm leading-snug tracking-wide text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
            정혜윤
            <span className="font-display italic text-[var(--accent)] ml-2">· Lilly</span>
          </span>
        </Link>

        {/* Nav links */}
        <ul className="flex flex-col gap-6 list-none m-0 p-0">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "relative text-sm tracking-[0.15em] uppercase transition-colors duration-300",
                    active
                      ? "text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  {active && (
                    <span
                      className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    />
                  )}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer info */}
        <div className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase leading-relaxed">
          <p>© {new Date().getFullYear()}</p>
          <p>Hyeyoon Jung</p>
        </div>
      </nav>

      {/* ── Mobile Top Bar ──────────────────────────────── */}
      <header
        className={[
          "md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-[var(--bg)] border-b border-[var(--border)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <Link href="/" className="font-display text-xl tracking-wide">
          Lilly
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex flex-col gap-1.5 p-2 -mr-2"
        >
          <span
            className={[
              "block h-px w-6 bg-[var(--text)] transition-all duration-300",
              menuOpen ? "rotate-45 translate-y-[7px]" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-px w-6 bg-[var(--text)] transition-all duration-300",
              menuOpen ? "opacity-0" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-px w-6 bg-[var(--text)] transition-all duration-300",
              menuOpen ? "-rotate-45 -translate-y-[7px]" : "",
            ].join(" ")}
          />
        </button>
      </header>

      {/* ── Mobile Menu Overlay ─────────────────────────── */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[var(--bg)] flex flex-col items-center justify-center gap-10"
          style={{ paddingTop: "64px" }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-3xl tracking-widest text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              {label}
            </Link>
          ))}
          <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mt-8">
            @hyeyoonlillyjung
          </p>
        </div>
      )}
    </>
  );
}
