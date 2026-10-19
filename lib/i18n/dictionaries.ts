/**
 * lib/i18n/dictionaries.ts — 사전 로더 (서버 전용)
 *
 * - 서버 컴포넌트(layout/page)에서만 호출한다. 사전 내용은 클라이언트 번들에 포함되지 않는다.
 * - 클라이언트 컴포넌트에는 필요한 부분(dict.nav 등)만 props로 넘긴다.
 */
import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/ko";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("./dictionaries/ko").then((m) => m.ko),
  en: () => import("./dictionaries/en").then((m) => m.en),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();

export type { Dictionary };
