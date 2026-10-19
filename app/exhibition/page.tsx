/**
 * app/exhibition/page.tsx — 전시 목록 페이지 (서버 컴포넌트)
 *
 * [레이아웃]
 * - exhibitionsByYear() 로 연도별 Map 생성 → 최신 연도 순 정렬
 * - 각 연도: 대형 연도 숫자(opacity 40%) + 가로 구분선 — 타임라인 느낌
 * - 각 전시: 대표 이미지 썸네일 3장 스트립 + 전시명·장소·설명 텍스트
 *
 * [데이터 출처]
 * - lib/artworks.ts 의 exhibitions 배열 → 전시 추가 시 해당 파일만 수정
 *
 * [썸네일]
 * - 전시에 연결된 작품들(artworkSlugs) 중 최대 3개 커버 이미지 미리보기
 * - 3개 초과 시 "+N" 표시
 */
import { getArtworksForExhibition, exhibitionsByYear } from "@/lib/artworks";
import ExhibitionCardClient from "./ExhibitionCardClient";

export const metadata = {
  title: "Exhibition — Hyeyoon Jung (Lilly)",
};

export default function ExhibitionPage() {
  const byYear = exhibitionsByYear();
  const years = Array.from(byYear.keys())
    .filter((y) => y >= 2025)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen px-8 md:px-16 py-20">
      <header className="mb-16">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
          Archive
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)]">
          Exhibition
        </h1>
      </header>

      <div className="max-w-4xl">
        {years.map((year) => {
          const exList = byYear.get(year) ?? [];
          return (
            <section key={year} className="mb-20">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-display text-5xl text-[var(--accent)] opacity-40 leading-none select-none">
                  {year}
                </span>
                <span className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <ul className="flex flex-col gap-12 list-none m-0 p-0">
                {exList.map((ex) => {
                  const artworks = getArtworksForExhibition(ex);
                  const preview = artworks.slice(0, 3);
                  const hasExhibitionImages =
                    ex.coverImage != null || (ex.images?.length ?? 0) > 0;
                  const lightboxImages = [
                    ...(ex.coverImage ? [ex.coverImage] : []),
                    ...(ex.images ?? []),
                    ...(!hasExhibitionImages ? artworks.flatMap((a) => a.images) : []),
                  ];
                  return (
                    <ExhibitionCardClient
                      key={ex.id}
                      id={ex.id}
                      slug={ex.slug}
                      title={ex.title}
                      venue={ex.venue}
                      location={ex.location}
                      description={ex.description}
                      coverImage={ex.coverImage}
                      lightboxImages={lightboxImages}
                      artworkPreviews={preview.map((a) => ({
                        id: a.id,
                        src: a.coverImage,
                        title: a.title,
                      }))}
                      extraArtworksCount={artworks.length > 3 ? artworks.length - 3 : 0}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
