/**
 * components/NotFoundContent.tsx — 404 화면 본문 (서버 컴포넌트)
 *
 * - app/global-not-found.tsx (어떤 라우트에도 맞지 않는 URL) · app/[locale]/not-found.tsx (notFound() 호출) 공용
 * - 언어를 알 수 없으므로 한국어·영어를 함께 표시
 * - 다크 톤 + 앰버, 배경에 제작 현장 실사(ING-05)를 아주 흐리게 깐다 (장식 — alt="")
 * - 링크: 홈 · 제작 과정 · 프로젝트 · 상담·견적 (ko / en)
 */
import Image from "next/image";
import Link from "next/link";
import { en } from "@/lib/i18n/dictionaries/en";
import { ko } from "@/lib/i18n/dictionaries/ko";
import { imageSrc } from "@/lib/projects";

const LINKS = [
  { path: "", ko: ko.notFound.backHome, en: en.notFound.backHome },
  { path: "/process", ko: ko.nav.process, en: en.nav.process },
  { path: "/projects", ko: ko.nav.projects, en: en.nav.projects },
  { path: "/contact", ko: ko.nav.contact, en: en.nav.contact },
];

export default function NotFoundContent() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center px-8 md:px-16 py-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image src={imageSrc("ing-05")} alt="" fill sizes="100vw" className="object-cover opacity-[0.12] grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 to-[var(--bg)]/60" />
      </div>

      <div className="relative max-w-2xl">
        <p className="font-display text-[clamp(5rem,14vw,9rem)] leading-none lining-nums text-[var(--accent)] mb-8" aria-hidden>
          404
        </p>
        <h1 className="font-korean text-3xl md:text-4xl text-[var(--text)] mb-2">{ko.notFound.title}</h1>
        <p lang="en" className="font-display text-xl text-[var(--text-muted)] mb-6">
          {en.notFound.title}
        </p>
        <p className="text-sm leading-relaxed text-[var(--text)]/85 [word-break:keep-all]">{ko.notFound.body}</p>
        <p lang="en" className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {en.notFound.body}
        </p>

        <nav aria-label="404" className="mt-12 grid sm:grid-cols-2 gap-x-12 gap-y-6 border-t border-[var(--border)] pt-8">
          {(["ko", "en"] as const).map((lang) => (
            <ul key={lang} lang={lang} className="list-none m-0 p-0 space-y-3">
              <li className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)]">{lang === "ko" ? "한국어" : "English"}</li>
              {LINKS.map((l) => (
                <li key={l.path}>
                  <Link
                    href={`/${lang}${l.path}`}
                    className="text-sm text-[var(--text)] hover:text-[var(--accent)] motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                  >
                    {l[lang]} →
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>
    </div>
  );
}
