/**
 * components/home/ProcessTimeline.tsx — 제작 공정 요약 (서버 컴포넌트)
 *
 * - lib/projects.ts getProcessHighlights(): 대표 사진 + 한 줄 설명이 있는 단계 (현재 7단계 — 기초는 사진 대기)
 * - xl(1280px+) 한 줄 7열 가로 타임라인, 그 이하는 가로 스크롤(scroll-snap)
 * - 이미지 lazy 로딩 (기본값)
 * - 전체 9단계는 /[locale]/process — 각 카드는 해당 단계 섹션(#코드)으로 연결
 */
import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";
import { getProcessHighlights } from "@/lib/projects";

interface Props {
  locale: Locale;
  home: Dictionary["home"];
}

export default function ProcessTimeline({ locale, home }: Props) {
  const steps = getProcessHighlights();

  return (
    <section aria-labelledby="process-heading" className="px-6 md:px-8 py-20 md:py-24 max-w-6xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-2">
            {home.processEyebrow}
          </p>
          <h2 id="process-heading" className="font-korean text-3xl text-[var(--text)]">
            {home.processHeading}
          </h2>
        </div>
        <Link
          href={localePath(locale, "/process")}
          className="text-xs tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          {home.processAll} →
        </Link>
      </header>

      <ol
        aria-label={home.processScrollLabel}
        tabIndex={0}
        className="list-none m-0 p-0 flex xl:grid xl:grid-cols-7 gap-4 overflow-x-auto xl:overflow-visible snap-x snap-mandatory xl:snap-none pb-4 xl:pb-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
      >
        {steps.map((step, i) => (
          <li key={step.code} className="snap-start shrink-0 w-[72%] sm:w-[40%] md:w-[30%] lg:w-[23%] xl:w-auto">
            {/* 카드 → /process 의 해당 단계 섹션 */}
            <Link href={`${localePath(locale, "/process")}#${step.code}`} className="group block">
            <div className="flex items-center gap-3 mb-3" aria-hidden>
              <span className="font-display text-xl text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)] mb-3">
              <Image
                src={step.image.src}
                alt={step.image.alt[locale]}
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1279px) 30vw, 14vw"
                className="object-cover select-none"
                draggable={false}
              />
            </div>
            <h3 className="font-korean text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors [word-break:keep-all]">{step.name[locale]}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)] [word-break:keep-all]">
              {step.summary[locale]}
            </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
