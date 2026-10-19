/**
 * lib/fonts.ts — 한글 폰트 정의 (next/font/google, 빌드 시 자체 호스팅)
 *
 * [조합 — 4단계 A안]
 * - 제목: Cormorant Garamond(영문) → Noto Serif KR(한글)
 * - 본문: Inter(영문)             → Noto Sans KR(한글)
 * - globals.css 의 font-family 순서로 글자별 대체: 영문은 앞 폰트, 한글은 뒤 폰트가 표시
 *
 * [파일 분리 이유]
 * - next/font 의 preload 는 폰트 함수를 "호출한 파일"(layout/page) 기준으로 붙는다.
 *   영문 폰트(Cormorant·Inter)는 preload 가 필요하므로 app/[locale]/layout.tsx 에서 직접 호출한다.
 * - 한글 폰트는 preload: false 라 위치와 무관 → 여기서 정의하고 layout·global-not-found 가 공유
 *
 * [로딩]
 * - Google 분할(unicode-range) 파일 — 페이지에 쓰인 글자 조각만 다운로드
 * - preload: false — 영문 글자는 Cormorant/Inter가 담당하므로 latin 조각 선로딩 불필요
 */
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

export const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  preload: false,
  display: "swap",
});

export const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  preload: false,
  display: "swap",
});

export const koreanFontVariables = `${notoSerifKr.variable} ${notoSansKr.variable}`;
