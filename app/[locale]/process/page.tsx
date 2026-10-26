/**
 * app/[locale]/process/page.tsx — 제작 과정 (서버 컴포넌트)
 *
 * [목표] 건축 전문가가 보더라도 신뢰가 가도록 공정과 품질관리를 사진 근거와 함께 보여준다
 *
 * [구성]
 * - 머리말 + 표기 안내(사진 확인 / [확인 필요]) + 전체 사진 기록 범위
 * - 왼쪽 sticky 진행 표시줄 (모바일은 상단 칩) — components/process/ProcessProgress
 * - 9단계 섹션 — components/process/ProcessStepSection (사진 없는 단계도 "사진 준비 중"으로 표시)
 *
 * [데이터]
 * - lib/projects.ts processSteps (설명·자재·품질관리·준비 중 사진) / lib/annotations.ts (사진 주석)
 * - 과장 표현 없이 구체적인 행동으로 서술. 회사 확인 전 항목은 [확인 필요]
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProcessProgress from "@/components/process/ProcessProgress";
import ProcessStepSection from "@/components/process/ProcessStepSection";
import ProjectDrawings from "@/components/projects/ProjectDrawings";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatShotDate, getDateRange, getStepImages, processSteps, projects, UNCONFIRMED } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/process">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).process.title };
}

export default async function ProcessPage({ params }: PageProps<"/[locale]/process">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const labels = dict.process;

  const allStepImages = processSteps.flatMap((s) => getStepImages(s.code));
  const range = getDateRange(allStepImages);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={labels.eyebrow} title={labels.title} />

      <div className="max-w-3xl -mt-6 mb-14 md:mb-16 flex flex-col gap-4">
        <p className="m-0 text-[15px] md:text-base leading-[1.8] text-[var(--text)]/90 [word-break:keep-all]">{labels.intro}</p>
        {range && (
          <p className="m-0 text-xs text-[var(--text-muted)]">
            {labels.recordLabel} {formatShotDate(range.from)} – {formatShotDate(range.to)} ·{" "}
            {labels.photoCount.replace("{n}", String(allStepImages.length))}
          </p>
        )}
        <ul className="list-none m-0 p-0 flex flex-col sm:flex-row gap-x-8 gap-y-2 text-xs text-[var(--text-muted)]">
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-[var(--accent)]/60 text-[10px] text-[var(--accent)]">
              <span aria-hidden>✓</span>
              {labels.observed}
            </span>
            <span className="[word-break:keep-all]">{labels.legendObserved}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 border border-[var(--border)] text-[10px]">{UNCONFIRMED[locale]}</span>
            <span className="[word-break:keep-all]">{labels.legendUnconfirmed}</span>
          </li>
        </ul>
      </div>

      <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <ProcessProgress
          label={labels.progressLabel}
          steps={processSteps.map((s) => ({
            code: s.code,
            number: String(s.order).padStart(2, "0"),
            name: s.name[locale],
          }))}
        />
        <div className="min-w-0 max-w-6xl">
          {processSteps.map((step, i) => (
            <ProcessStepSection key={step.code} step={step} locale={locale} labels={labels} preloadLead={i === 0}>
              {step.code === "insulation-waterproofing" && projects.filter(p => p.drawings?.["detail-wall"]).map(project => (
                <ProjectDrawings key={project.slug} project={project} locale={locale} only="detail-wall" />
              ))}
            </ProcessStepSection>
          ))}
        </div>
      </div>
    </div>
  );
}
