/**
 * components/projects/ProjectList.tsx — 프로젝트 카드 목록 + 유형 필터 (클라이언트 컴포넌트)
 *
 * - 카드 데이터는 서버(app/[locale]/projects/page.tsx)에서 문자열로 만들어 전달 → 프로젝트 데이터 모듈을 번들에 넣지 않음
 * - 탭: "전체" + 데이터에 있는 유형만. 유형이 null 인 프로젝트는 "전체"에만 나옴
 * - 대표 사진이 제작 과정 사진이면 "제작 중" 표시 (완성 사진처럼 보이지 않게)
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FilterTabs from "@/components/FilterTabs";

export interface ProjectCard {
  slug: string;
  href: string;
  type: string | null;
  name: string;
  typeLabel: string;
  area: string;
  year: string;
  cover: { src: string; alt: string } | null;
  inProgress: boolean;
}

interface Props {
  cards: ProjectCard[];
  types: { key: string; label: string }[];
  labels: { all: string; filterLabel: string; inProgress: string; empty: string; area: string; year: string };
}

export default function ProjectList({ cards, types, labels }: Props) {
  const [active, setActive] = useState("all");
  const shown = active === "all" ? cards : cards.filter((c) => c.type === active);

  const tabs = [
    { key: "all", label: labels.all, count: cards.length },
    ...types.map((t) => ({ key: t.key, label: t.label, count: cards.filter((c) => c.type === t.key).length })),
  ];

  return (
    <>
      <FilterTabs tabs={tabs} active={active} onChange={setActive} label={labels.filterLabel} panelIdPrefix="projects" />

      <div
        role="tabpanel"
        id={`projects-panel-${active}`}
        aria-labelledby={`projects-tab-${active}`}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10"
      >
        {shown.length === 0 && <p className="text-sm text-[var(--text-muted)]">{labels.empty}</p>}
        {shown.map((c) => (
          <Link key={c.slug} href={c.href} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)] mb-4">
              {c.cover && (
                <Image
                  src={c.cover.src}
                  alt={c.cover.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover select-none motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                  draggable={false}
                />
              )}
              {c.inProgress && (
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[var(--bg)]/90 text-[10px] tracking-[0.15em] text-[var(--accent)]">
                  {labels.inProgress}
                </span>
              )}
            </div>
            <h2 className="font-korean text-xl text-[var(--text)] group-hover:text-[var(--accent)] motion-safe:transition-colors [word-break:keep-all]">
              {c.name}
            </h2>
            <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              <dt className="sr-only">type</dt>
              <dd className="m-0 col-span-2 text-[var(--text-muted)]">{c.typeLabel}</dd>
              <dt className="text-[var(--text-muted)]">{labels.area}</dt>
              <dd className="m-0 text-[var(--text)]">{c.area}</dd>
              <dt className="text-[var(--text-muted)]">{labels.year}</dt>
              <dd className="m-0 text-[var(--text)]">{c.year}</dd>
            </dl>
          </Link>
        ))}
      </div>
    </>
  );
}
