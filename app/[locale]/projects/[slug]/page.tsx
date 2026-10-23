/**
 * app/[locale]/projects/[slug]/page.tsx — 프로젝트 상세 (서버 컴포넌트, 건축 프로젝트 문서 형식)
 *
 * [구성]
 * 1. 대표 외관 이미지 — 콘텐츠 전체 폭 (제작 과정 사진이면 "제작 중" 표기)
 * 2. 사양표 — 연면적·구조·기초·외장재·지붕재·단열·창호·난방·공사 기간·위치 (없으면 [확인 필요])
 * 3. 도면 — components/projects/DrawingViewer (public/drawings/{slug}/plan|elevation|section.svg, 없으면 "도면 준비 중")
 * 4. 갤러리 탭 — 외관 / 제작 과정 / 내부 (MasonryGallery·Lightbox 재사용, 렌더·분위기 예시 표기)
 * 5. 이 프로젝트의 공정 — components/home/ProcessTimeline 재사용 (project 지정)
 * 6. CTA "이 모델로 상담하기" → /[locale]/contact?model={slug}
 *
 * [정적 생성·메타데이터]
 * - generateStaticParams: projects 의 slug (언어는 상위 [locale]), dynamicParams = false → 없는 slug 404
 * - generateMetadata: 프로젝트명·유형 요약 + OG 이미지 = 대표 사진 (metadataBase 는 [locale]/layout.tsx)
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaLink from "@/components/CtaLink";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import DrawingViewer from "@/components/projects/DrawingViewer";
import ProjectGallery from "@/components/projects/ProjectGallery";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDrawings } from "@/lib/drawings";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  formatArea,
  formatShotDate,
  formatYear,
  getCoverImage,
  getProjectBySlug,
  imageId,
  isInProgressImage,
  projects,
  PROJECT_TYPE_LABEL,
  t,
} from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!hasLocale(locale) || !project) return {};
  const dict = await getDictionary(locale);
  const name = t(project.name, locale);
  // 설명에는 확인된 값만 넣는다 (없는 값은 생략)
  const facts = [
    project.type ? PROJECT_TYPE_LABEL[project.type][locale] : null,
    project.specs.grossFloorAreaM2 !== null ? formatArea(project.specs.grossFloorAreaM2, locale) : null,
    project.location ? project.location[locale] : null,
  ].filter(Boolean);
  const description = [`${dict.meta.siteName} — ${name}`, ...facts].join(" · ");
  const cover = getCoverImage(project);

  return {
    title: name,
    description,
    openGraph: {
      title: `${name} | ${dict.meta.siteName}`,
      description,
      type: "article",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: cover ? [{ url: cover.src, alt: cover.alt[locale] }] : undefined,
    },
  };
}

function SectionHeading({ id, eyebrow, children }: { id: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-2">{eyebrow}</p>}
      <h2 id={id} className="font-korean text-2xl md:text-3xl text-[var(--text)]">
        {children}
      </h2>
    </header>
  );
}

export default async function ProjectDetailPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!hasLocale(locale) || !project) notFound();
  const dict = await getDictionary(locale);
  const d = dict.projectDetail;
  const s = d.specs;
  const { specs } = project;
  const name = t(project.name, locale);
  const cover = getCoverImage(project);

  const rows: { label: string; value: string }[] = [
    { label: s.type, value: t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale) },
    { label: s.grossFloorArea, value: formatArea(specs.grossFloorAreaM2, locale) },
    { label: s.structure, value: t(specs.structure, locale) },
    { label: s.foundation, value: t(specs.foundation, locale) },
    { label: s.exteriorCladding, value: t(specs.exteriorCladding, locale) },
    { label: s.roofing, value: t(specs.roofing, locale) },
    { label: s.insulation, value: t(specs.insulation, locale) },
    { label: s.windows, value: t(specs.windows, locale) },
    { label: s.heating, value: t(specs.heating, locale) },
    { label: s.constructionPeriod, value: t(specs.constructionPeriod, locale) },
    { label: s.location, value: t(project.location, locale) },
    { label: s.completionYear, value: formatYear(project.completionYear, locale) },
  ];

  return (
    <article className="min-h-screen pb-24">
      {/* 1. 대표 외관 이미지 — 전체 폭 */}
      {cover && (
        <figure className="m-0">
          <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-[var(--bg-surface)]">
            <Image
              src={cover.src}
              alt={cover.alt[locale]}
              fill
              preload
              sizes="(max-width: 768px) 100vw, calc(100vw - 220px)"
              className="object-cover select-none"
              draggable={false}
            />
            {isInProgressImage(cover) && (
              <span className="absolute top-4 left-4 md:top-6 md:left-8 px-2.5 py-1 bg-[var(--bg)]/80 text-[11px] tracking-[0.15em] text-[var(--accent)]">
                {d.coverInProgress}
              </span>
            )}
          </div>
          <figcaption className="px-8 md:px-16 mt-3 text-xs text-[var(--text-muted)]">
            {[cover.alt[locale], imageId(cover.src).toUpperCase(), cover.date ? formatShotDate(cover.date) : null]
              .filter(Boolean)
              .join(" · ")}
          </figcaption>
        </figure>
      )}

      <div className="px-8 md:px-16">
        <div className="max-w-6xl">
          <Link
            href={localePath(locale, "/projects")}
            className="inline-block mt-10 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] motion-safe:transition-colors"
          >
            ← {dict.common.backToList}
          </Link>

          <header className="mt-8 mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">{d.eyebrow}</p>
            <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-none tracking-wide text-[var(--text)] [word-break:keep-all]">
              {name}
            </h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              {t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale)}
            </p>
          </header>

          {/* 2. 사양표 */}
          <section aria-labelledby="specs-heading" className="mb-20">
            <SectionHeading id="specs-heading">{d.specsHeading}</SectionHeading>
            <dl className="m-0 grid sm:grid-cols-2 gap-x-12 border-t border-[var(--border)]">
              {rows.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5 border-b border-[var(--border)] text-sm">
                  <dt className="text-[var(--text-muted)]">{label}</dt>
                  <dd className="m-0 text-[var(--text)] [word-break:keep-all]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 3. 도면 */}
          <section aria-labelledby="plan-heading" className="mb-20">
            <SectionHeading id="plan-heading">{d.drawingsHeading}</SectionHeading>
            <DrawingViewer
              title={name}
              drawings={getDrawings(project.slug)}
              labels={{
                tabs: d.drawingTabs,
                tabsLabel: d.drawingsTabsLabel,
                pending: d.drawingPending,
                note: d.drawingNote,
                zoomIn: d.drawingZoomIn,
                zoomOut: d.drawingZoomOut,
                reset: d.drawingReset,
                hint: d.drawingHint,
              }}
            />
          </section>

          {/* 4. 갤러리 */}
          <section aria-labelledby="gallery-heading" className="mb-8">
            <SectionHeading id="gallery-heading">{d.galleryHeading}</SectionHeading>
            <ProjectGallery
              locale={locale}
              labels={{ galleryLabel: d.galleryLabel, showMore: d.showMore }}
              groups={[
                { key: "exterior", label: d.galleryExterior, note: d.galleryExteriorNote, images: project.images.exterior },
                { key: "process", label: d.galleryProcess, note: d.galleryProcessNote, images: project.images.process, pageSize: 24 },
                {
                  key: "interior",
                  label: d.galleryInterior,
                  note: d.galleryInteriorNote,
                  tag: d.galleryInteriorTag,
                  images: project.images.interior,
                },
              ]}
            />
          </section>
        </div>
      </div>

      {/* 5. 이 프로젝트의 공정 */}
      <ProcessTimeline
        locale={locale}
        project={project}
        headingId="project-process-heading"
        className="px-8 md:px-16 py-20 max-w-[calc(72rem+8rem)]"
        labels={{
          eyebrow: d.timelineEyebrow,
          heading: d.timelineHeading,
          all: dict.home.processAll,
          scrollLabel: dict.home.processScrollLabel,
        }}
      />

      {/* 6. CTA */}
      <section aria-labelledby="project-cta-heading" className="mx-8 md:mx-16 max-w-6xl border-t border-[var(--border)] pt-16">
        <h2 id="project-cta-heading" className="font-korean text-2xl md:text-3xl text-[var(--text)] [word-break:keep-all]">
          {d.ctaHeading}
        </h2>
        <p className="mt-3 mb-8 text-sm text-[var(--text-muted)] [word-break:keep-all]">{d.ctaBody}</p>
        <CtaLink
          href={`${localePath(locale, "/contact")}?model=${encodeURIComponent(project.slug)}`}
          className="w-full sm:w-auto"
        >
          {d.cta}
        </CtaLink>
      </section>
    </article>
  );
}
