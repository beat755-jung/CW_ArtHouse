/**
 * app/[locale]/about/page.tsx — 회사 소개 (서버 컴포넌트)
 *
 * [콘텐츠 구성]
 * - 좌측: 회사 소개 · 대표 · 연혁 · 주소 · 연락처
 * - 우측: 대표 이미지 (실사)
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 확인되지 않은 사실 정보(연혁·주소·연락처 등)는 null → "[확인 필요]" / "[To be confirmed]"
 * - 확인된 정보: 대표 정창원 (Jung Chang-Won, JCW) / 미니하우스 설계·제작·판매
 */
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { t, type I18nText } from "@/lib/projects";

const coverSrc = "/projects/prototype-01/exterior/ing-05.jpg";

const sections: { label: I18nText; value: I18nText | null }[] = [
  { label: { ko: "회사 소개", en: "Company" }, value: null },
  { label: { ko: "대표", en: "Founder" }, value: { ko: "정창원 (JCW)", en: "Jung Chang-Won (JCW)" } },
  { label: { ko: "연혁", en: "History" }, value: null },
  { label: { ko: "주소", en: "Address" }, value: null },
  { label: { ko: "연락처", en: "Contact" }, value: null },
];

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).about.title };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.about.eyebrow} title="CW_ArtHouse" />

      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          {sections.map(({ label, value }) => (
            <section key={label.en}>
              <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-2">
                {label[locale]}
              </h2>
              <p className="text-sm text-[var(--text)] leading-relaxed">{t(value, locale)}</p>
            </section>
          ))}
        </div>

        {/* Right: image */}
        <div className="flex flex-col gap-4">
          <div
            className="relative overflow-hidden bg-[var(--bg-surface)]"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={coverSrc}
              alt={dict.about.coverCaption}
              fill
              className="object-cover select-none"
              sizes="(max-width: 768px) 100vw, 45vw"
              draggable={false}
              quality={75}
              priority
            />
            <div className="absolute inset-0 z-10" aria-hidden />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] text-right">
            {dict.about.coverCaption}
          </p>
        </div>
      </div>
    </div>
  );
}
