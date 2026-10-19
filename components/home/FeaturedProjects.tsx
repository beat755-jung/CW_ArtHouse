/**
 * components/home/FeaturedProjects.tsx — 대표 프로젝트 (서버 컴포넌트)
 *
 * - lib/projects.ts getFeaturedProjects() 최대 3개
 * - 1개: 이미지 + 정보 가로형 넓은 카드 / 2~3개: 그리드 카드 (자동 전환)
 * - 이름·유형·사양이 null 이면 "[확인 필요]" / "[To be confirmed]"
 * - 이미지 lazy 로딩 (기본값)
 */
import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";
import { formatArea, getCoverImage, getFeaturedProjects, PROJECT_TYPE_LABEL, t } from "@/lib/projects";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function FeaturedProjects({ locale, dict }: Props) {
  const featured = getFeaturedProjects().slice(0, 3);
  if (featured.length === 0) return null;
  const single = featured.length === 1;
  const specLabels = dict.projectDetail.specs;

  return (
    <section aria-labelledby="projects-heading" className="px-6 md:px-8 pb-20 md:pb-24 max-w-6xl mx-auto">
      <header className="mb-10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-2">
          {dict.home.projectsEyebrow}
        </p>
        <h2 id="projects-heading" className="font-korean text-3xl text-[var(--text)]">
          {dict.home.projectsHeading}
        </h2>
      </header>

      <div className={single ? "" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {featured.map((project) => {
          const cover = getCoverImage(project);
          const rows = [
            { label: specLabels.type, value: t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale) },
            { label: specLabels.grossFloorArea, value: formatArea(project.specs.grossFloorAreaM2, locale) },
            { label: specLabels.structure, value: t(project.specs.structure, locale) },
          ];
          return (
            <Link
              key={project.slug}
              href={localePath(locale, `/projects/${project.slug}`)}
              className={[
                "group block bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors",
                single ? "md:grid md:grid-cols-[3fr_2fr]" : "",
              ].join(" ")}
            >
              <div className={["relative overflow-hidden", single ? "aspect-[4/3] md:aspect-auto md:min-h-[360px]" : "aspect-[4/3]"].join(" ")}>
                {cover && (
                  <Image
                    src={cover.src}
                    alt={cover.alt[locale]}
                    fill
                    sizes={single ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 640px) 100vw, 33vw"}
                    className="object-cover select-none transition-transform duration-700 motion-safe:group-hover:scale-105"
                    draggable={false}
                  />
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="font-korean text-2xl text-[var(--text)] mb-5 group-hover:text-[var(--accent)] transition-colors">
                  {t(project.name, locale)}
                </h3>
                <dl className="m-0 mb-6 border-t border-[var(--border)]">
                  {rows.map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 py-2.5 border-b border-[var(--border)] text-sm">
                      <dt className="text-[var(--text-muted)]">{label}</dt>
                      <dd className="m-0 text-[var(--text)] text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <span className="text-xs tracking-[0.15em] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                  {dict.common.viewDetail} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
