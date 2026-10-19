/**
 * app/[locale]/projects/[slug]/page.tsx — 프로젝트 상세 (서버 컴포넌트, 임시 내용)
 *
 * - generateStaticParams: lib/projects.ts 의 slug 목록 (언어는 상위 [locale] 레이아웃이 담당)
 * - dynamicParams = false: 없는 slug 는 404
 * - 사양 항목은 모두 t() / formatArea() 로 표시 → null 이면 "[확인 필요]" / "[To be confirmed]"
 * - 이미지 갤러리(외관·공정·실내)는 다음 단계에서 MasonryGallery 로 구성
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatArea, getProjectBySlug, projects, PROJECT_TYPE_LABEL, t } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!hasLocale(locale) || !project) return {};
  return { title: t(project.name, locale) };
}

export default async function ProjectDetailPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!hasLocale(locale) || !project) notFound();
  const dict = await getDictionary(locale);
  const labels = dict.projectDetail.specs;
  const { specs } = project;

  const rows: { label: string; value: string }[] = [
    { label: labels.type, value: t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale) },
    { label: labels.location, value: t(project.location, locale) },
    { label: labels.grossFloorArea, value: formatArea(specs.grossFloorAreaM2, locale) },
    { label: labels.structure, value: t(specs.structure, locale) },
    { label: labels.foundation, value: t(specs.foundation, locale) },
    { label: labels.exteriorCladding, value: t(specs.exteriorCladding, locale) },
    { label: labels.insulation, value: t(specs.insulation, locale) },
    { label: labels.windows, value: t(specs.windows, locale) },
    { label: labels.constructionPeriod, value: t(specs.constructionPeriod, locale) },
  ];

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <Link
        href={localePath(locale, "/projects")}
        className="inline-block mb-10 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        ← {dict.common.backToList}
      </Link>

      <PageHeader eyebrow={dict.projects.eyebrow} title={t(project.name, locale)} />

      <section className="max-w-3xl">
        <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4">
          {dict.projectDetail.specsHeading}
        </h2>
        <dl className="border-t border-[var(--border)]">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[10rem_1fr] gap-6 py-3 border-b border-[var(--border)] text-sm">
              <dt className="text-[var(--text-muted)]">{label}</dt>
              <dd className="m-0 text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
