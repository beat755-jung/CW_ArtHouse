/**
 * app/[locale]/process/page.tsx — 제작 과정 (서버 컴포넌트, 임시 내용)
 *
 * - lib/projects.ts 의 processSteps 9단계 이름만 순서대로 표시
 * - 공정 설명·품질관리 포인트·대표 이미지는 다음 단계에서 구성 (현재 값은 null / 빈 배열)
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { processSteps } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/process">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).process.title };
}

export default async function ProcessPage({ params }: PageProps<"/[locale]/process">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.process.eyebrow} title={dict.process.title} />

      <ol className="max-w-3xl list-none m-0 p-0 border-t border-[var(--border)]">
        {processSteps.map((step) => (
          <li
            key={step.code}
            className="flex items-baseline gap-6 py-5 border-b border-[var(--border)]"
          >
            <span className="font-display text-2xl text-[var(--accent)] opacity-60 w-10 shrink-0">
              {String(step.order).padStart(2, "0")}
            </span>
            <span className="font-korean text-lg text-[var(--text)]">{step.name[locale]}</span>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-[var(--text-muted)]">{dict.common.comingSoon}</p>
    </div>
  );
}
