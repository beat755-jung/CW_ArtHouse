/**
 * components/LanguageSwitcher.tsx — 언어 전환 (클라이언트 컴포넌트)
 *
 * - 현재 경로의 첫 세그먼트(locale)만 바꿔 같은 페이지의 다른 언어로 이동
 *   예: /ko/projects/prototype-01 ↔ /en/projects/prototype-01
 * - 현재 언어: --text 색 + amber 점 / 다른 언어: --text-muted
 * - 사이드바 하단(데스크톱)과 모바일 오버레이 하단에서 사용
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const LABEL: Record<Locale, { short: string; lang: string }> = {
  ko: { short: "KO", lang: "한국어" },
  en: { short: "EN", lang: "English" },
};

interface Props {
  locale: Locale;
  label: string;
  onNavigate?: () => void;
}

function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  segments[1] = target; // "" / locale / ...
  return segments.join("/") || `/${target}`;
}

export default function LanguageSwitcher({ locale, label, onNavigate }: Props) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <nav aria-label={label} className="flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase">
      {locales.map((target, i) => {
        const active = target === locale;
        return (
          <span key={target} className="flex items-center gap-3">
            {i > 0 && <span className="text-[var(--border)]" aria-hidden>·</span>}
            <Link
              href={switchLocalePath(pathname, target)}
              hrefLang={target}
              lang={target}
              aria-current={active ? "true" : undefined}
              title={LABEL[target].lang}
              onClick={onNavigate}
              className={[
                "relative transition-colors duration-300",
                active ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {active && (
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
              {LABEL[target].short}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
