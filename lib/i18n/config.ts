/**
 * lib/i18n/config.ts — 다국어 설정 (서버·클라이언트 공용)
 *
 * - locales      : 지원 언어 목록. URL 첫 세그먼트로 사용 (/ko, /en)
 * - defaultLocale: 기본 언어. "/" 접근 시 이동 (next.config.ts redirects)
 * - hasLocale()  : 문자열이 지원 언어인지 확인 (타입 좁히기 + 404 처리용)
 * - localePath() : 언어 접두어를 붙인 경로 생성 ("/projects" → "/ko/projects")
 */

export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export function localePath(locale: Locale, path = ""): string {
  if (!path || path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
