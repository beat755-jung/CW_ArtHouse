/**
 * app/exhibition/[slug]/page.tsx — 전시 상세 페이지 (서버 컴포넌트)
 *
 * [역할]
 * - slug 로 특정 전시를 찾아 헤더(제목·장소·설명)를 서버에서 렌더링
 * - 갤러리 인터랙션(라이트박스 등)은 클라이언트인 ExhibitionGallery 에 위임
 *
 * [params]
 * - Next.js 16에서 params는 Promise<{slug}> — await로 처리
 * - 존재하지 않는 slug 접근 시 Next.js 기본 404 페이지 반환
 *
 * [갤러리 구조]
 * - 전시에 연결된 artworkSlugs → Artwork 객체 배열로 변환
 * - 각 작품의 이미지 최대 6장씩 컬럼 레이아웃으로 표시
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getExhibitionBySlug, getArtworksForExhibition } from "@/lib/artworks";
import ExhibitionGallery from "./ExhibitionGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExhibitionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const exhibition = getExhibitionBySlug(slug);
  if (!exhibition) notFound();

  const artworks = getArtworksForExhibition(exhibition);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <Link
        href="/exhibition"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-12"
      >
        ← Exhibition
      </Link>

      <header className="max-w-2xl mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--accent)] mb-3">
          {exhibition.year}
        </p>
        <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight tracking-wide text-[var(--text)] mb-4">
          {exhibition.title}
        </h1>
        <p className="text-sm tracking-widest uppercase text-[var(--text-muted)] mb-4">
          {exhibition.venue} · {exhibition.location}
        </p>
        {exhibition.description && (
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            {exhibition.description}
          </p>
        )}
      </header>

      <ExhibitionGallery artworks={artworks} exhibitionImages={exhibition.images ?? []} />
    </div>
  );
}
