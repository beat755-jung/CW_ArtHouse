/**
 * components/contact/SelectedModel.tsx — 상담 페이지 "상담 모델" 안내 상자 (클라이언트 컴포넌트)
 *
 * - URL ?model={slug} 를 읽어 해당 프로젝트를 표시 (프로젝트 상세의 "이 모델로 상담하기" CTA)
 * - 데이터에 있는 slug 만 인정 — 임의의 쿼리 문자열은 화면에 그대로 내보내지 않음
 * - useSearchParams → 정적 페이지 유지를 위해 상위에서 <Suspense> 로 감싼다 (Next 16 문서)
 * - 문의 양식이 생기면 이 값을 "관심 모델" 필드 기본값으로 넘긴다
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface ModelOption {
  slug: string;
  name: string;
  href: string;
  cover: { src: string; alt: string } | null;
}

interface Props {
  models: ModelOption[];
  labels: { modelLabel: string; modelChange: string; modelNote: string };
  projectsHref: string;
}

export default function SelectedModel({ models, labels, projectsHref }: Props) {
  const slug = useSearchParams().get("model");
  const model = models.find((m) => m.slug === slug);
  if (!model) return null;

  return (
    <section
      aria-label={labels.modelLabel}
      className="max-w-3xl mb-12 flex flex-col sm:flex-row gap-5 p-5 border border-[var(--accent)]/40 bg-[var(--bg-surface)]"
    >
      {model.cover && (
        <div className="relative shrink-0 w-full sm:w-44 aspect-[4/3] overflow-hidden">
          <Image src={model.cover.src} alt={model.cover.alt} fill sizes="(max-width: 640px) 90vw, 11rem" className="object-cover select-none" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--accent)]">{labels.modelLabel}</p>
        <Link href={model.href} className="mt-1 block font-korean text-xl text-[var(--text)] hover:text-[var(--accent)] motion-safe:transition-colors">
          {model.name}
        </Link>
        <p className="mt-2 text-sm text-[var(--text-muted)] [word-break:keep-all]">{labels.modelNote}</p>
        <Link href={projectsHref} className="mt-3 inline-block text-xs tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--accent)] motion-safe:transition-colors">
          {labels.modelChange} →
        </Link>
      </div>
    </section>
  );
}
