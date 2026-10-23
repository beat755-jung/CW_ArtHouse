/**
 * app/[locale]/page.tsx — 홈 (서버 컴포넌트)
 *
 * [섹션 순서 — 첫 화면 3초 안에 "미니하우스 설계·제작·판매 회사" 인지]
 * 1. Hero            — H1 · 보조 문장 · CTA(상담·견적 문의 / 제작 과정 보기) · 부유 이미지
 * 2. KeyFacts        — 구조 방식 / 기본 면적 / 공사 기간 / 보증 (lib/company.ts, 미확인은 [확인 필요])
 * 3. ProcessTimeline — 제작 공정 요약 6단계 (대표 사진 + 한 줄 설명)
 * 4. FeaturedProjects— 대표 프로젝트 (featured, 최대 3개)
 * 5. ContactCta      — 문의 유도
 */
import { notFound } from "next/navigation";
import ContactCta from "@/components/home/ContactCta";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import KeyFacts from "@/components/home/KeyFacts";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} home={dict.home} />
      <KeyFacts locale={locale} home={dict.home} />
      <ProcessTimeline
        locale={locale}
        labels={{
          eyebrow: dict.home.processEyebrow,
          heading: dict.home.processHeading,
          all: dict.home.processAll,
          scrollLabel: dict.home.processScrollLabel,
        }}
      />
      <FeaturedProjects locale={locale} dict={dict} />
      <ContactCta locale={locale} home={dict.home} />

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} CW_ArtHouse. {dict.common.allRightsReserved}
        </p>
      </footer>
    </>
  );
}
