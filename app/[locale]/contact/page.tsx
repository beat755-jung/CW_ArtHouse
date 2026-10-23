/**
 * app/[locale]/contact/page.tsx — 상담·견적 문의 (서버 컴포넌트, 임시 내용)
 *
 * - ?model={slug} 로 들어오면 "상담 모델" 안내 상자 표시 (components/contact/SelectedModel)
 * - 문의 양식은 메일 발송 등 외부 서비스 선택 후 별도 단계에서 구현 — 그때 모델 값을 양식 기본값으로 사용
 * - 연락처(전화·이메일·주소)는 [확인 필요] — 확인 전 표시하지 않음
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SelectedModel from "@/components/contact/SelectedModel";
import PageHeader from "@/components/PageHeader";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoverImage, projects, t } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).contact.title };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const models = projects.map((p) => {
    const cover = getCoverImage(p);
    return {
      slug: p.slug,
      name: t(p.name, locale),
      href: localePath(locale, `/projects/${p.slug}`),
      cover: cover ? { src: cover.src, alt: cover.alt[locale] } : null,
    };
  });

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.contact.eyebrow} title={dict.contact.title} />
      <Suspense fallback={null}>
        <SelectedModel
          models={models}
          projectsHref={localePath(locale, "/projects")}
          labels={{ modelLabel: dict.contact.modelLabel, modelChange: dict.contact.modelChange, modelNote: dict.contact.modelNote }}
        />
      </Suspense>
      <p className="text-sm text-[var(--text-muted)]">{dict.common.comingSoon}</p>
    </div>
  );
}
