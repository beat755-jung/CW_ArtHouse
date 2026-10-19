/**
 * app/[locale]/contact/page.tsx — 상담·견적 문의 (서버 컴포넌트, 임시 내용)
 *
 * - 문의 양식은 메일 발송 등 외부 서비스 선택 후 별도 단계에서 구현
 * - 연락처(전화·이메일·주소)는 [확인 필요] — 확인 전 표시하지 않음
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: (await getDictionary(locale)).contact.title };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <PageHeader eyebrow={dict.contact.eyebrow} title={dict.contact.title} />
      <p className="text-sm text-[var(--text-muted)]">{dict.common.comingSoon}</p>
    </div>
  );
}
