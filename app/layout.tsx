/**
 * app/layout.tsx — 루트 레이아웃 (서버 컴포넌트)
 *
 * [역할]
 * - 모든 페이지에 공통 적용되는 최상위 레이아웃
 * - Google Fonts 로드: Cormorant Garamond (display/제목용) + Inter (본문용)
 * - GlobalProtection : 전역 우클릭·드래그 차단 클라이언트 컴포넌트 마운트
 * - Navigation       : 좌측 고정 사이드바 (데스크톱) / 상단 햄버거 (모바일)
 * - .page-content    : 사이드바 너비만큼 좌측 여백 확보 (globals.css 참고)
 *
 * [메타데이터]
 * - SEO title/description + OpenGraph 기본값 설정
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import GlobalProtection from "@/components/GlobalProtection";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hyeyoon Jung (Lilly) — Artist",
  description:
    "Portfolio of Hyeyoon Jung (Lilly), ceramic artist and painter based at SAIC, Chicago.",
  openGraph: {
    title: "Hyeyoon Jung (Lilly)",
    description: "Artist Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <GlobalProtection />
        <Navigation />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
