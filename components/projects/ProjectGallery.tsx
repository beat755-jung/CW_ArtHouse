/**
 * components/projects/ProjectGallery.tsx — 프로젝트 상세 갤러리 탭 (클라이언트 컴포넌트)
 *
 * - 탭: 외관 / 제작 과정 / 내부 (사진이 없는 탭은 숨김)
 * - 마소나리 + 라이트박스 = 기존 MasonryGallery 재사용. 제작 과정은 pageSize 장씩 "더 보기"
 * - 탭마다 안내 문구: 외관 = 콘셉트 렌더, 내부 = 분위기 예시(실제 제품과 다름) — CLAUDE.md 렌더 규칙
 */
"use client";

import { useState } from "react";
import FilterTabs from "@/components/FilterTabs";
import MasonryGallery from "@/components/MasonryGallery";
import type { Locale, ProjectImage } from "@/lib/projects";

type GalleryKey = "exterior" | "process" | "interior";

interface Props {
  groups: { key: GalleryKey; label: string; note: string; tag?: string; images: ProjectImage[]; pageSize?: number }[];
  locale: Locale;
  labels: { galleryLabel: string; showMore: string };
}

export default function ProjectGallery({ groups, locale, labels }: Props) {
  const available = groups.filter((g) => g.images.length > 0);
  const [active, setActive] = useState<GalleryKey>(available.find((g) => g.key === "process")?.key ?? available[0]?.key ?? "process");
  const current = available.find((g) => g.key === active);
  if (!current) return null;

  return (
    <>
      <FilterTabs
        tabs={available.map((g) => ({ key: g.key, label: g.label, count: g.images.length, tag: g.tag }))}
        active={active}
        onChange={setActive}
        label={labels.galleryLabel}
        panelIdPrefix="gallery"
      />
      <div role="tabpanel" id={`gallery-panel-${active}`} aria-labelledby={`gallery-tab-${active}`} className="mt-8">
        <p className="mb-6 text-sm text-[var(--text-muted)] [word-break:keep-all]">{current.note}</p>
        {/* key 로 탭 전환 시 "더 보기" 상태 초기화 */}
        <MasonryGallery
          key={current.key}
          images={current.images}
          locale={locale}
          pageSize={current.pageSize}
          showMoreLabel={labels.showMore}
        />
      </div>
    </>
  );
}
