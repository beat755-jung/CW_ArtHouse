/**
 * components/Navigation.tsx — 전역 네비게이션 (클라이언트 컴포넌트)
 *
 * [메뉴 순서 — 고객 동선]
 * - 로고(무엇을 만드는 회사인지) → 제작 과정 → 프로젝트 → 회사 소개 → 상담·견적
 * - 문구는 app/[locale]/layout.tsx 에서 사전(dict.nav)으로 전달받는다.
 *
 * [데스크톱: 좌측 고정 사이드바]
 * - 상단: 사이트명(CW_ArtHouse) + 한 줄 소개 — 홈 링크
 * - 중앙: 메뉴 (현재 경로 일치 시 amber 점(●) 왼쪽에 표시)
 * - 하단: 언어 전환(KO · EN) + 저작권 연도
 * - 너비: CSS 변수 --nav-width (220px), globals.css에서 page-content와 연동
 *
 * [모바일: 상단 고정 바 + 오버레이 메뉴]
 * - 스크롤 40px 이후 배경 배경색 전환 (투명 → #070707)
 * - 햄버거 아이콘: 3선 → X 애니메이션
 * - 메뉴 오픈 시 전체화면 오버레이, 링크 클릭 시 닫힘
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";

interface Props {
  locale: Locale;
  nav: Dictionary["nav"];
  languageLabel: string;
}

export default function Navigation({ locale, nav, languageLabel }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: localePath(locale, "/process"), label: nav.process },
    { href: localePath(locale, "/projects"), label: nav.projects },
    { href: localePath(locale, "/about"), label: nav.about },
    { href: localePath(locale, "/contact"), label: nav.contact },
  ];

  // 영어 메뉴는 대문자·넓은 자간, 한국어 메뉴는 자간을 좁게
  const menuText = locale === "en" ? "uppercase tracking-[0.15em]" : "tracking-[0.05em]";

  return (
    <>
      {/* ── Desktop Left Sidebar ─────────────────────────── */}
      <nav
        aria-label={nav.label}
        className="hidden md:flex fixed left-0 top-0 h-full flex-col justify-between px-8 py-10 z-50"
        style={{ width: "var(--nav-width)", borderRight: "1px solid var(--border)" }}
      >
        {/* Logo / Site name */}
        <Link href={localePath(locale)} className="group block">
          <span className="font-display block text-base tracking-[0.15em] text-[var(--text)] mb-1 transition-colors group-hover:text-[var(--accent)]">
            CW_ArtHouse
          </span>
          <span className="font-korean block text-xs leading-snug tracking-wide text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]">
            {nav.tagline}
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
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative text-sm transition-colors duration-300",
                    menuText,
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

        {/* Footer: language + copyright */}
        <div className="flex flex-col gap-5">
          <LanguageSwitcher locale={locale} label={languageLabel} />
          <div className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase leading-relaxed">
            <p>© {new Date().getFullYear()}</p>
            <p>CW_ArtHouse</p>
          </div>
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
        <Link href={localePath(locale)} onClick={closeMenu} className="font-display text-xl tracking-wide">
          CW_ArtHouse
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
          aria-expanded={menuOpen}
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
              onClick={closeMenu}
              className={[
                "font-display text-3xl text-[var(--text)] hover:text-[var(--accent)] transition-colors",
                locale === "en" ? "tracking-widest" : "tracking-wide",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
          <div className="mt-8">
            <LanguageSwitcher locale={locale} label={languageLabel} onNavigate={closeMenu} />
          </div>
        </div>
      )}
    </>
  );
}
