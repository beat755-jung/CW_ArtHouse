/**
 * app/global-not-found.tsx — 전역 404 (어떤 라우트에도 맞지 않는 URL)
 *
 * - 루트 레이아웃이 동적 세그먼트(app/[locale]/layout.tsx)라 일반 app/not-found 대신 사용
 *   (Next 16 문서 권장, next.config.ts experimental.globalNotFound 필요)
 * - 레이아웃을 거치지 않으므로 html/body·전역 스타일·폰트를 직접 지정
 * - 폰트는 한글(lib/fonts.ts)만 사용, 영문은 Georgia/sans-serif 대체 (문서 권장: 404는 가벼운 폰트 구성)
 * - 언어를 알 수 없으므로 한국어·영어를 함께 표시
 */
import type { Metadata } from "next";
import Link from "next/link";
import { koreanFontVariables } from "@/lib/fonts";
import { ko } from "@/lib/i18n/dictionaries/ko";
import { en } from "@/lib/i18n/dictionaries/en";
import "./globals.css";

export const metadata: Metadata = {
  title: `404 — ${ko.notFound.title} | CW_ArtHouse`,
};

export default function GlobalNotFound() {
  return (
    <html lang="ko" className={koreanFontVariables}>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen flex items-center justify-center px-8">
        <div>
          <p className="font-display text-7xl text-[var(--accent)] opacity-60 leading-none mb-6">404</p>
          <h1 className="font-korean text-2xl text-[var(--text)] mb-1">{ko.notFound.title}</h1>
          <p className="font-display text-lg text-[var(--text-muted)] mb-10">{en.notFound.title}</p>
          <div className="flex gap-6 text-xs tracking-[0.2em] uppercase">
            <Link href="/ko" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              {ko.notFound.backHome}
            </Link>
            <Link href="/en" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              {en.notFound.backHome}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
