/**
 * app/[locale]/page.tsx — 홈 (서버 컴포넌트)
 *
 * [구성]
 * - Hero (components/home/Hero.tsx, 클라이언트) — 사전 문구 전달
 * - Projects: lib/projects.ts 의 featured:true 프로젝트 카드 → 상세 페이지 링크
 * - 값이 없는 항목은 t() 헬퍼로 "[확인 필요]" / "[To be confirmed]" 표시
 */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/home/Hero";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoverImage, getFeaturedProjects, PROJECT_TYPE_LABEL, t } from "@/lib/projects";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const featured = getFeaturedProjects().slice(0, 6);

  return (
    <>
      <Hero locale={locale} home={dict.home} nav={dict.nav} />

      {/* ── Featured Projects ────────────────────────────── */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl tracking-wide text-[var(--text)]">
            {dict.home.projectsHeading}
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((project) => {
            const cover = getCoverImage(project);
            return (
              <Link
                key={project.slug}
                href={localePath(locale, `/projects/${project.slug}`)}
                className="artwork-card group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={cover.alt[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                      draggable={false}
                      quality={70}
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 z-10" aria-hidden />
                </div>
                <div className="artwork-info">
                  <p className="font-display text-sm text-white/90 leading-tight">
                    {t(project.name, locale)}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase text-white/50 mt-0.5">
                    {t(project.type ? PROJECT_TYPE_LABEL[project.type] : null, locale)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} CW_ArtHouse. {dict.common.allRightsReserved}
        </p>
      </footer>
    </>
  );
}
