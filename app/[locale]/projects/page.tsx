/**
 * app/[locale]/projects/page.tsx — 프로젝트 목록 (서버 컴포넌트)
 *
 * - 카드: 외관 대표 이미지(Project.cover) · 프로젝트명 · 유형 · 연면적 · 완공 연도 (없으면 [확인 필요])
 * - 유형 필터 탭: components/FilterTabs (데이터에 있는 유형만 탭으로 표시)
 * - 카드 문자열은 여기서 만들어 클라이언트(ProjectList)로 전달
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProjectList, { type ProjectCard } from "@/components/projects/ProjectList";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  formatArea,
  formatYear,
  getCoverImage,
  getProjectTypesInUse,
  isInProgressImage,
  projects,
  PROJECT_TYPE_LABEL,
  t,
} from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.projects.title, description: dict.projects.intro };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const specLabels = dict.projectDetail.specs;

  const cards: ProjectCard[] = projects.map((p) => {
    const cover = getCoverImage(p);
    return {
      slug: p.slug,
      href: localePath(locale, `/projects/${p.slug}`),
      type: p.type,
      name: t(p.name, locale),
      typeLabel: `${specLabels.type} · ${t(p.type ? PROJECT_TYPE_LABEL[p.type] : null, locale)}`,
      area: formatArea(p.specs.grossFloorAreaM2, locale),
      year: formatYear(p.completionYear, locale),
      cover: cover ? { src: cover.src, alt: cover.alt[locale] } : null,
      inProgress: isInProgressImage(cover),
    };
  });

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.projects.eyebrow} title={dict.projects.title} />
      <p className="max-w-3xl -mt-6 mb-12 text-[15px] leading-[1.8] text-[var(--text)]/90 [word-break:keep-all]">
        {dict.projects.intro}
      </p>
      <div className="max-w-6xl">
        <ProjectList
          cards={cards}
          types={getProjectTypesInUse().map((k) => ({ key: k, label: PROJECT_TYPE_LABEL[k][locale] }))}
          labels={{
            all: dict.projects.all,
            filterLabel: dict.projects.filterLabel,
            inProgress: dict.projects.inProgress,
            empty: dict.projects.empty,
            area: specLabels.grossFloorArea,
            year: specLabels.completionYear,
          }}
        />
      </div>
    </div>
  );
}
