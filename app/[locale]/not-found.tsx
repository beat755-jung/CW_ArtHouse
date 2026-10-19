/**
 * app/[locale]/not-found.tsx — 언어 세그먼트 안의 404 (notFound() 호출 시)
 *
 * - 예: 없는 프로젝트 slug (/ko/projects/없는-slug)
 * - not-found 는 params 를 받지 못하므로 한국어·영어를 함께 표시
 * - 사이드바(레이아웃)는 그대로 유지된다.
 */
import Link from "next/link";
import { ko } from "@/lib/i18n/dictionaries/ko";
import { en } from "@/lib/i18n/dictionaries/en";

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-center px-8 md:px-16 py-20">
      <p className="font-display text-7xl text-[var(--accent)] opacity-60 leading-none mb-6">404</p>
      <h1 className="font-korean text-2xl text-[var(--text)] mb-1">{ko.notFound.title}</h1>
      <p className="font-display text-lg text-[var(--text-muted)] mb-10">{en.notFound.title}</p>
      <div className="flex gap-6 text-xs tracking-[0.2em] uppercase">
        <Link href="/ko" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          {ko.notFound.backHome}
        </Link>
        <Link href="/en" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          {en.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
