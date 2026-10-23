/**
 * app/[locale]/layout.tsx — 루트 레이아웃 (서버 컴포넌트)
 *
 * [역할]
 * - 모든 페이지에 공통 적용되는 최상위 레이아웃. <html lang={locale}> 을 언어별로 지정
 * - 폰트: Cormorant Garamond · Inter (여기서 호출 → 전 경로 preload) + Noto Serif KR · Noto Sans KR (lib/fonts.ts)
 * - GlobalProtection : 전역 우클릭·드래그 차단 클라이언트 컴포넌트 마운트
 * - Navigation       : 좌측 고정 사이드바 (데스크톱) / 상단 햄버거 (모바일), 사전 문구 전달
 * - .page-content    : 사이드바 너비만큼 좌측 여백 확보 (globals.css 참고)
 *
 * [다국어]
 * - generateStaticParams: ko, en 두 언어를 빌드 시 정적 생성
 * - dynamicParams = false: 그 밖의 언어(/fr 등)는 404
 * - "/" → "/ko" 이동은 next.config.ts redirects
 *
 * [메타데이터]
 * - title.template: 하위 페이지 title 뒤에 " | CW_ArtHouse" 를 붙임 (title.default 필수)
 * - description · OpenGraph locale 을 언어별로 설정
 * - robots noindex: 사이트 공개 전까지 유지 ([확인 필요] 항목 정리 후 제거)
 * - alternates.languages 는 도메인(metadataBase) [확인 필요] — 확정 후 추가
 * - 파비콘: app/icon.svg (임시 CW 모노그램)
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import GlobalProtection from "@/components/GlobalProtection";
import { koreanFontVariables } from "@/lib/fonts";
import { hasLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

// 영문 폰트는 루트 레이아웃에서 호출해야 모든 경로에 preload 된다 (lib/fonts.ts 주석 참고)
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

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    // OG 이미지 등 상대 경로 URL 의 기준. 사이트 도메인 [확인 필요] → 확정되면 NEXT_PUBLIC_SITE_URL 에 설정
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: dict.meta.siteName,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    robots: { index: false, follow: false },
    openGraph: {
      title: dict.meta.siteName,
      description: dict.meta.description,
      siteName: dict.meta.siteName,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      alternateLocale: locale === "ko" ? ["en_US"] : ["ko_KR"],
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable} ${koreanFontVariables}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <GlobalProtection />
        <Navigation locale={locale} nav={dict.nav} languageLabel={dict.language.label} />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
