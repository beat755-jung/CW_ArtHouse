/**
 * components/FilterTabs.tsx — 밑줄 강조 탭 (클라이언트 컴포넌트)
 *
 * - 작가 사이트 /artist 카테고리 탭과 같은 디자인: 대문자·넓은 자간(영문), 개수 표시, 선택 시 앰버 밑줄
 * - 프로젝트 목록 유형 필터, 프로젝트 상세 갤러리 탭에서 사용
 * - 접근성: role="tablist"/"tab", aria-selected, ← → 키로 이동
 */
"use client";

import { useRef } from "react";

export interface TabItem<K extends string> {
  key: K;
  label: string;
  count?: number;
  /** 라벨 옆 작은 표시 (예: "분위기 예시") */
  tag?: string;
}

interface Props<K extends string> {
  tabs: TabItem<K>[];
  active: K;
  onChange: (key: K) => void;
  label: string;
  /** 각 탭이 제어하는 패널 id 접두어 (aria-controls) */
  panelIdPrefix?: string;
}

export default function FilterTabs<K extends string>({ tabs, active, onChange, label, panelIdPrefix }: Props<K>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].key);
  };

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[var(--border)] pb-4">
      {tabs.map((tab, i) => {
        const on = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={panelIdPrefix ? `${panelIdPrefix}-tab-${tab.key}` : undefined}
            aria-selected={on}
            aria-controls={panelIdPrefix ? `${panelIdPrefix}-panel-${tab.key}` : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={[
              "relative pb-1 text-xs tracking-[0.15em] motion-safe:transition-colors",
              on ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]",
            ].join(" ")}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-2 text-[var(--text-muted)]">({tab.count})</span>}
            {tab.tag && <span className="ml-2 text-[10px] text-[var(--accent)]">{tab.tag}</span>}
            {on && <span aria-hidden className="absolute -bottom-[17px] left-0 right-0 h-px bg-[var(--accent)]" />}
          </button>
        );
      })}
    </div>
  );
}
