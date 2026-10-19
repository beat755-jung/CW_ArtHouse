/**
 * app/about/page.tsx — 회사 소개 페이지 (서버 컴포넌트)
 *
 * [콘텐츠 구성]
 * - 좌측: 회사 소개 · 대표 · 연혁 · 주소 · 연락처
 * - 우측: 대표 이미지 (실사)
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 확인되지 않은 사실 정보(연혁·주소·연락처 등)는 null → "[확인 필요]"로 표시
 * - 확인된 정보: 대표 정창원 (Jung Chang-Won, JCW) / 미니하우스 설계·제작·판매
 */
import type { Metadata } from "next";
import Image from "next/image";
import { t, type I18nText } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
};

const coverImage = {
  src: "/projects/prototype-01/exterior/ing-05.jpg",
  caption: "제작 중인 외관 (실사)",
};

const sections: { label: I18nText; value: I18nText | null }[] = [
  { label: { ko: "회사 소개", en: "Company" }, value: null },
  { label: { ko: "대표", en: "Founder" }, value: { ko: "정창원 (JCW)", en: "Jung Chang-Won (JCW)" } },
  { label: { ko: "연혁", en: "History" }, value: null },
  { label: { ko: "주소", en: "Address" }, value: null },
  { label: { ko: "연락처", en: "Contact" }, value: null },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      {/* Header */}
      <header className="mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
          About
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)] mb-2">
          CW_ArtHouse
        </h1>
        <p className="font-korean text-sm text-[var(--text-muted)] tracking-[0.1em]">
          미니하우스 설계 · 제작 · 판매
        </p>
      </header>

      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          {sections.map(({ label, value }) => (
            <section key={label.en}>
              <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-2">
                {label.ko} · {label.en}
              </h2>
              <p className="text-sm text-[var(--text)] leading-relaxed">{t(value, "ko")}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t(value, "en")}</p>
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
              src={coverImage.src}
              alt={coverImage.caption}
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
            {coverImage.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
