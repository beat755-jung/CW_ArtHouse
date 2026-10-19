/**
 * app/[locale]/projects/page.tsx — 프로젝트 목록 (서버 컴포넌트, 임시 내용)
 *
 * - lib/projects.ts 의 projects 전체를 카드로 표시 → 상세 페이지 링크
 * - 이름·유형이 null 이면 "[확인 필요]" / "[To be confirmed]"
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoverImage, projects, PROJECT_TYPE_LABEL, t } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).projects.title };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.projects.eyebrow} title={dict.projects.title} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {projects.map((project) => {
          const cover = getCoverImage(project);
          return (
            <Link
              key={project.slug}
              href={localePath(locale, `/projects/${project.slug}`)}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)] mb-3">
                {cover && (
                  <Image
                    src={cover.src}
                    alt={cover.alt[locale]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                    draggable={false}
                    quality={70}
                  />
                )}
                <div className="absolute inset-0 z-10" aria-hidden />
              </div>
              <p className="font-display text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {t(project.name, locale)}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
