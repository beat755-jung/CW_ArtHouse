/**
 * app/[locale]/contact/page.tsx — 상담·견적 문의 (서버 컴포넌트)
 *
 * [구성]
 * - ?model={slug} → "상담 모델" 안내 상자 (components/contact/SelectedModel) + 폼 "관심 모델" 기본값
 * - 왼쪽: 문의 폼 (components/contact/ContactForm) / 오른쪽: 전화 · 이메일 · 카카오톡 채널 (lib/company.ts, 없으면 [확인 필요])
 *
 * [전송]
 * - lib/company.ts getFormDelivery() — NEXT_PUBLIC_FORM_ENDPOINT(우선) / NEXT_PUBLIC_CONTACT_EMAIL(mailto) / 없으면 준비 중
 * - 폼 전송 서비스를 쓰면 개인정보 국외 이전 고지를 동의 문구에 추가해야 한다
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";
import SelectedModel from "@/components/contact/SelectedModel";
import PageHeader from "@/components/PageHeader";
import { contactChannels, getFormDelivery } from "@/lib/company";
import { hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoverImage, projects, t, UNCONFIRMED } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.contact.title, description: dict.contact.intro };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const c = dict.contact;

  const models = projects.map((p) => {
    const cover = getCoverImage(p);
    return {
      slug: p.slug,
      name: t(p.name, locale),
      href: localePath(locale, `/projects/${p.slug}`),
      cover: cover ? { src: cover.src, alt: cover.alt[locale] } : null,
    };
  });

  const channels: { label: string; value: string | null; href: string | null }[] = [
    { label: c.phone, value: contactChannels.phone, href: contactChannels.phone ? `tel:${contactChannels.phone.replace(/[^\d+]/g, "")}` : null },
    { label: c.email, value: contactChannels.email, href: contactChannels.email ? `mailto:${contactChannels.email}` : null },
    { label: c.kakao, value: contactChannels.kakaoChannel, href: contactChannels.kakaoChannel },
  ];

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={c.eyebrow} title={c.title} />
      <p className="max-w-3xl -mt-6 mb-10 text-[15px] leading-[1.8] text-[var(--text)]/90 [word-break:keep-all]">{c.intro}</p>

      <Suspense fallback={null}>
        <SelectedModel
          models={models}
          projectsHref={localePath(locale, "/projects")}
          labels={{ modelLabel: c.modelLabel, modelChange: c.modelChange, modelNote: c.modelNote }}
        />
      </Suspense>

      <div className="max-w-6xl grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 items-start">
        <ContactForm delivery={getFormDelivery()} labels={c.form} models={models.map(({ slug, name }) => ({ slug, name }))} />

        <aside aria-labelledby="channels-heading" className="lg:sticky lg:top-24 lg:order-none order-first">
          <h2 id="channels-heading" className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">
            {c.channelsHeading}
          </h2>
          <dl className="m-0 border-t border-[var(--border)]">
            {channels.map((ch) => (
              <div key={ch.label} className="py-4 border-b border-[var(--border)]">
                <dt className="text-xs text-[var(--text-muted)]">{ch.label}</dt>
                <dd className="m-0 mt-1 text-sm text-[var(--text)] break-all">
                  {ch.value && ch.href ? (
                    <a href={ch.href} className="hover:text-[var(--accent)] motion-safe:transition-colors" {...(ch.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {ch.value}
                    </a>
                  ) : (
                    UNCONFIRMED[locale]
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
