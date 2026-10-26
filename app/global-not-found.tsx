/**
 * app/global-not-found.tsx — 전역 404 (어떤 라우트에도 맞지 않는 URL)
 *
 * - 루트 레이아웃이 동적 세그먼트(app/[locale]/layout.tsx)라 일반 app/not-found 대신 사용
 *   (Next 16 문서 권장, next.config.ts experimental.globalNotFound 필요)
 * - 레이아웃을 거치지 않으므로 html/body·전역 스타일·폰트를 직접 지정 (영문 Cormorant·Inter + 한글)
 * - 본문: components/NotFoundContent (ko/en 병기). 404 응답에는 Next 가 noindex 를 자동으로 붙인다
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import NotFoundContent from "@/components/NotFoundContent";
import { koreanFontVariables } from "@/lib/fonts";
import { ko } from "@/lib/i18n/dictionaries/ko";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `404 — ${ko.notFound.title} | CW_ArtHouse`,
};

export default function GlobalNotFound() {
  return (
    <html lang="ko" className={`${cormorant.variable} ${inter.variable} ${koreanFontVariables}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <NotFoundContent />
      </body>
    </html>
  );
}
