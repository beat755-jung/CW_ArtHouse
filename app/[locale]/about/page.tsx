/**
 * app/[locale]/about/page.tsx — 회사 소개 (서버 컴포넌트)
 *
 * [구성 — 기존 About 톤: 왼쪽 텍스트 / 오른쪽 실사, 작은 대문자 라벨, 얇은 구분선]
 * 1. 머리말 + 대표 + 제작 현장 실사
 * 2. 작은 집에 대한 생각 (철학) — 회사 확인 전 초안 표시
 * 3. 제작 방식 3가지 — 사진 근거(ING ID) + /process 연결
 * 4. 진행 절차 7단계 — components/about/ProcedureSteps (lib/company.ts)
 * 5. 회사 정보 — 상호·대표자·사업자등록번호·건설업 등록 여부·주소 (lib/company.ts, 모두 [확인 필요])
 * 6. 상담 CTA
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 확인된 사실: 대표 정창원 (JCW), 미니하우스 설계·제작·판매, 대상 고객(주택 마당 별채·농장 휴게 공간)
 * - 사진으로 확인되지 않은 장점(성능·내구성 등)·인허가 확정 표현은 쓰지 않는다
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProcedureSteps from "@/components/about/ProcedureSteps";
import CtaLink from "@/components/CtaLink";
import PageHeader from "@/components/PageHeader";
import { companyInfo, procedureSteps } from "@/lib/company";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { imageSrc, t, UNCONFIRMED } from "@/lib/projects";

const coverSrc = imageSrc("ing-05");

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.about.title, description: `CW_ArtHouse — ${dict.about.subtitle}` };
}

function Label({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-5">
      {children}
    </h2>
  );
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const a = dict.about;

  const info: { label: string; value: string }[] = [
    { label: a.company.legalName, value: t(companyInfo.legalName, locale) },
    { label: a.company.representative, value: t(companyInfo.representative, locale) },
    { label: a.company.businessNumber, value: companyInfo.businessNumber ?? UNCONFIRMED[locale] },
    { label: a.company.constructionLicense, value: t(companyInfo.constructionLicense, locale) },
    { label: a.company.address, value: t(companyInfo.address, locale) },
  ];

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={a.eyebrow} title="CW_ArtHouse" />

      {/* 1·2. 소개 + 철학 / 실사 */}
      <div className="max-w-6xl -mt-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="flex flex-col gap-10">
          <div>
            <p className="font-korean text-lg text-[var(--text)]">{a.subtitle}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {a.founderLabel} · {a.founder}
            </p>
          </div>
          <section aria-labelledby="philosophy-heading">
            <Label id="philosophy-heading">{a.philosophyHeading}</Label>
            <p className="font-korean text-xl md:text-2xl leading-[1.7] text-[var(--text)] [word-break:keep-all]">{a.philosophy}</p>
            <p className="mt-4 text-[11px] text-[var(--text-muted)]">※ {a.draftNote}</p>
          </section>
        </div>
        <figure className="m-0">
          <div className="relative overflow-hidden bg-[var(--bg-surface)] aspect-[4/3]">
            <Image src={coverSrc} alt={a.coverCaption} fill className="object-cover select-none" sizes="(max-width: 768px) 100vw, 45vw" draggable={false} preload />
          </div>
          <figcaption className="mt-3 text-[10px] tracking-widest uppercase text-[var(--text-muted)] text-right">{a.coverCaption} · ING-05</figcaption>
        </figure>
      </div>

      {/* 3. 제작 방식 */}
      <section aria-labelledby="features-heading" className="scroll-mt-24 max-w-6xl mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Label id="features-heading">{a.featuresHeading}</Label>
          <Link href={localePath(locale, "/process")} className="mb-5 text-xs tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--accent)] motion-safe:transition-colors">
            {a.featuresLink} →
          </Link>
        </div>
        <ul className="list-none m-0 p-0 grid md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)]">
          {a.features.map((f, i) => (
            <li key={f.title} className="bg-[var(--bg)] p-6 md:p-8">
              <span className="font-display text-2xl lining-nums text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-korean text-lg text-[var(--text)] [word-break:keep-all]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] [word-break:keep-all]">{f.body}</p>
              {f.evidence && <p className="mt-3 font-mono text-[11px] text-[var(--text-muted)]">{f.evidence}</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* 4. 진행 절차 */}
      <section aria-labelledby="procedure-heading" className="scroll-mt-24 max-w-6xl mt-24">
        <Label id="procedure-heading">{a.procedureHeading}</Label>
        <ProcedureSteps steps={procedureSteps} locale={locale} />
      </section>

      {/* 5. 회사 정보 */}
      <section aria-labelledby="company-heading" className="scroll-mt-24 max-w-3xl mt-24">
        <Label id="company-heading">{a.companyHeading}</Label>
        <dl className="m-0 border-t border-[var(--border)]">
          {info.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[10rem_1fr] sm:grid-cols-[12rem_1fr] gap-4 py-3.5 border-b border-[var(--border)] text-sm">
              <dt className="text-[var(--text-muted)] [word-break:keep-all]">{label}</dt>
              <dd className="m-0 text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 6. CTA */}
      <section aria-labelledby="about-cta-heading" className="scroll-mt-24 max-w-6xl mt-24 pt-16 border-t border-[var(--border)]">
        <h2 id="about-cta-heading" className="font-korean text-2xl md:text-3xl text-[var(--text)] mb-8 [word-break:keep-all]">
          {a.ctaHeading}
        </h2>
        <CtaLink href={localePath(locale, "/contact")} className="w-full sm:w-auto">
          {dict.home.ctaPrimary}
        </CtaLink>
      </section>
    </div>
  );
}
