/**
 * app/about/page.tsx — 작가 소개 페이지 (서버 컴포넌트)
 *
 * [콘텐츠 구성]
 * - 좌측: 작가 스테이트먼트 · 학력 · 연락처(Instagram / SAIC 주소)
 * - 우측: 대표 작품 이미지 + 주요 전시 약력 사이드바
 *
 * [수정 포인트]
 * - 작가 스테이트먼트: <p> 내용 직접 편집
 * - 학력·전시 이력: 하드코딩된 <li> 항목 추가/수정
 * - 우측 이미지: src 경로를 원하는 작품 이미지로 교체
 * - Instagram 링크: href 속성 수정
 *
 * [연락처 정보]
 * - Instagram: @hyeyoonlillyjung
 * - SAIC: 36 S Wabash Ave, Chicago, IL 60603
 */
import type { Metadata } from "next";
import Image from "next/image";
import { artworks, Category } from "@/lib/artworks";

export const revalidate = 86400; // 24시간마다 재생성

export const metadata: Metadata = {
  title: "About — Hyeyoon Jung (Lilly)",
};

function getDailyImage(): { src: string; caption: string } {
  const order: Category[] = ["ceramic", "painting", "drawing", "installation"];
  const validCategories = order.filter((cat) =>
    artworks.some((a) => a.category === cat)
  );

  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const category = validCategories[dayIndex % validCategories.length];
  const pool = artworks.filter((a) => a.category === category);
  const artwork = pool[dayIndex % pool.length];

  return {
    src: artwork.coverImage,
    caption: `${artwork.title}, ${artwork.year}`,
  };
}

export default function AboutPage() {
  const daily = getDailyImage();
  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      {/* Header */}
      <header className="mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
          Artist
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)] mb-2">
          Hyeyoon Jung
        </h1>
        <p className="font-korean text-sm text-[var(--text-muted)] tracking-[0.1em]">
          정혜윤
          <span className="font-display italic text-[var(--accent)] ml-3">· Lilly</span>
        </p>
      </header>

      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          {/* Statement */}
          <section>
            <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4">
              Statement
            </h2>
            <div className="font-display text-lg leading-relaxed text-[var(--text)] space-y-4">
              <p>
                My practice moves between ceramic, painting, installation, and drawing —
                not as separate disciplines, but as different pressures on the same
                questions. How do we belong somewhere? How do we carry the distance
                between people? What does it mean to be trapped inside systems
                we built ourselves?
              </p>
              <p>
                Birds recur across mediums as obsessive self-portrait: ceramic figures
                caught in a seesaw while believing themselves free, palm-sized
                assemblages of stained glass and feather, painted figures endlessly
                pecking at one another. I return to them despite — or because of —
                an admitted aversion, finding in their forms a language for subconscious
                emotions that resist more direct expression. Across clay, oil, and steel,
                I draw from art history as framework rather than citation: Guston&apos;s color,
                Ernst&apos;s surrealist pressure, Escher&apos;s ambiguous space become places
                to locate my own fragmented sense of belonging.
              </p>
              <p>
                Memory and displacement move through the work just as persistently.
                Hand-built ceramic houses hold childhood star stickers and the wishful
                logic of fairy tales. Steel wings reach toward someone just out of reach.
                Soil and sprouts push upward through steel in a city that has replaced
                nature with its image. The materials argue with each other — clay that
                records a thumbprint, oil paint that layers dream over waking life,
                steel that bends but will not apologize — and in that friction I find
                the conditions I am trying to describe.
              </p>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4">
              Education
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--text)] leading-tight">
                  BFA Candidate — Fine Arts
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21h18" />
                    <path d="M4 21V10" />
                    <path d="M20 21V10" />
                    <path d="M2 10l10-7 10 7" />
                    <rect x="9" y="14" width="6" height="7" />
                  </svg>
                  School of the Art Institute of Chicago (SAIC)
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Chicago, IL · 2023 –
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4">
              Contact
            </h2>
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase mb-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </p>
                <a
                  href="https://www.instagram.com/hyeyoonlillyjung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                >
                  @hyeyoonlillyjung
                </a>
              </div>
              <div className="pt-2">
                <p className="text-[10px] tracking-widest uppercase mb-0.5">School Address</p>
                <address className="not-italic leading-relaxed text-[var(--text-muted)]">
                  <a
                    href="https://www.saic.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    School of the Art Institute of Chicago (SAIC)
                  </a><br />
                  36 S Wabash Ave<br />
                  Chicago, IL 60603<br />
                  United States
                </address>
              </div>
            </div>
          </section>
        </div>

        {/* Right: portrait image */}
        <div className="flex flex-col gap-4">
          <div
            className="relative overflow-hidden bg-[var(--bg-surface)]"
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={daily.src}
              alt="Hyeyoon Jung (Lilly) — studio"
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
            {daily.caption}
          </p>

          {/* Selected exhibitions sidebar */}
          <div className="mt-6">
            <h2 className="text-[10px] tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4">
              Selected Exhibitions
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-4 text-[var(--text-muted)]">
                <span className="shrink-0 w-10 text-[var(--accent)]">2026</span>
                <span>SARCASM, KSA Exhibition Space, Chicago, IL</span>
              </li>
              <li className="flex gap-4 text-[var(--text-muted)]">
                <span className="shrink-0 w-10" />
                <span>On Wanting, INCUBATOR / Sharp Lobby, SAIC, Chicago, IL</span>
              </li>
              <li className="flex gap-4 text-[var(--text-muted)]">
                <span className="shrink-0 w-10" />
                <span>Ghost Gallery at Kimpton Gray Hotel, Chicago, IL</span>
              </li>
              <li className="flex gap-4 text-[var(--text-muted)] pt-2">
                <span className="shrink-0 w-10 text-[var(--accent)]">2025</span>
                <span>New Work 2025, SAIC Galleries, Chicago, IL</span>
              </li>
              <li className="flex gap-4 text-[var(--text-muted)]">
                <span className="shrink-0 w-10" />
                <span>JADE Gallery — Artist Spotlight, Online</span>
              </li>
              <li className="flex gap-4 text-[var(--text-muted)]">
                <span className="shrink-0 w-10" />
                <span>KSA Off-Campus Exhibition, OH Art Foundation, Chicago, IL</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
