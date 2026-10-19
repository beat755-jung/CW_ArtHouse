/**
 * components/home/KeyFacts.tsx — 핵심 정보 바 (서버 컴포넌트)
 *
 * - 구조 방식 / 기본 면적 / 공사 기간 / 보증 — 값은 lib/company.ts (모르면 null)
 * - null → "[확인 필요]" / "[To be confirmed]"
 * - 데스크톱 4열, 모바일 2×2
 */
import { keyFacts } from "@/lib/company";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";
import { formatArea, t } from "@/lib/projects";

interface Props {
  locale: Locale;
  home: Dictionary["home"];
}

export default function KeyFacts({ locale, home }: Props) {
  const items = [
    { label: home.keyFacts.structure, value: t(keyFacts.structure, locale) },
    { label: home.keyFacts.baseArea, value: formatArea(keyFacts.baseAreaM2, locale) },
    { label: home.keyFacts.constructionPeriod, value: t(keyFacts.constructionPeriod, locale) },
    { label: home.keyFacts.warranty, value: t(keyFacts.warranty, locale) },
  ];

  return (
    <section
      aria-labelledby="key-facts-heading"
      className="border-y border-[var(--border)] bg-[var(--bg-surface)]"
    >
      <h2 id="key-facts-heading" className="sr-only">
        {home.keyFactsHeading}
      </h2>
      <dl className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {items.map(({ label, value }, i) => (
          <div
            key={label}
            className={[
              "px-6 md:px-8 py-6 md:py-8 border-[var(--border)]",
              i % 2 === 1 ? "border-l" : "",
              i >= 2 ? "border-t md:border-t-0" : "",
              i === 2 ? "md:border-l" : "",
            ].join(" ")}
          >
            <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)]">{label}</dt>
            <dd className="m-0 mt-2 font-korean text-lg md:text-xl text-[var(--text)]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
