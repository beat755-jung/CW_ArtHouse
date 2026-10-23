/**
 * components/projects/DrawingViewer.tsx — 도면(평면·입면·단면) 보기 (클라이언트 컴포넌트)
 *
 * [파일]
 * - public/drawings/{slug}/plan.svg · elevation.svg · section.svg — 있는 것만 탭 활성 (서버에서 확인해 drawings 로 전달)
 * - 없으면 "도면 준비 중" 자리
 *
 * [조작] 외부 라이브러리 없음
 * - 끌어서 이동 · 휠 / 두 손가락 핀치로 확대(1~6배) · [+][−][⟲] 버튼 · 키보드 + − 0 화살표
 * - SVG 는 <img> 로 표시 → 도면 파일 안의 스크립트가 실행되지 않음
 * - prefers-reduced-motion: 버튼 확대 시 전환 효과 없음
 *
 * [문구] 하단에 "개념도이며 실제 치수와 다를 수 있습니다" (ko/en)
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FilterTabs from "@/components/FilterTabs";

export type DrawingKind = "plan" | "elevation" | "section";

interface Props {
  drawings: { kind: DrawingKind; src: string | null }[];
  labels: {
    tabs: Record<DrawingKind, string>;
    tabsLabel: string;
    pending: string;
    note: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
    hint: string;
  };
  title: string;
}

const MIN = 1;
const MAX = 6;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function DrawingViewer({ drawings, labels, title }: Props) {
  const first = drawings.find((d) => d.src)?.kind ?? "plan";
  const [kind, setKind] = useState<DrawingKind>(first);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  const current = drawings.find((d) => d.kind === kind);

  /** 화면 좌표 (cx, cy) 를 기준점으로 확대 */
  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const box = boxRef.current?.getBoundingClientRect();
    setView((v) => {
      const scale = clamp(v.scale * factor, MIN, MAX);
      if (!box || scale === v.scale) return { ...v, scale };
      const px = (cx ?? box.left + box.width / 2) - box.left - box.width / 2;
      const py = (cy ?? box.top + box.height / 2) - box.top - box.height / 2;
      const k = scale / v.scale;
      const x = scale === 1 ? 0 : px - (px - v.x) * k;
      const y = scale === 1 ? 0 : py - (py - v.y) * k;
      return { scale, x, y };
    });
  }, []);

  const reset = () => {
    setAnimate(true);
    setView({ scale: 1, x: 0, y: 0 });
  };

  // 휠 확대 — passive:false 로 등록해야 페이지 스크롤을 막을 수 있음
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setAnimate(false);
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, current?.src]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setAnimate(false);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const target = clamp(pinch.current.scale * (dist / pinch.current.dist), MIN, MAX);
      zoomAt(target / view.scale, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (view.scale > 1) setView((v) => ({ ...v, x: v.x + e.clientX - prev.x, y: v.y + e.clientY - prev.y }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 40;
    const keys: Record<string, () => void> = {
      "+": () => zoomAt(1.25),
      "=": () => zoomAt(1.25),
      "-": () => zoomAt(1 / 1.25),
      "0": reset,
      ArrowLeft: () => setView((v) => ({ ...v, x: v.x + step })),
      ArrowRight: () => setView((v) => ({ ...v, x: v.x - step })),
      ArrowUp: () => setView((v) => ({ ...v, y: v.y + step })),
      ArrowDown: () => setView((v) => ({ ...v, y: v.y - step })),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      setAnimate(e.key === "0" || e.key === "+" || e.key === "=" || e.key === "-");
      fn();
    }
  };

  const changeKind = (k: DrawingKind) => {
    setKind(k);
    setView({ scale: 1, x: 0, y: 0 });
  };

  const btn =
    "flex items-center justify-center w-9 h-9 bg-[var(--bg)]/85 border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

  return (
    <div>
      <FilterTabs
        tabs={drawings.map((d) => ({ key: d.kind, label: labels.tabs[d.kind], tag: d.src ? undefined : labels.pending }))}
        active={kind}
        onChange={changeKind}
        label={labels.tabsLabel}
        panelIdPrefix="drawing"
      />

      <div role="tabpanel" id={`drawing-panel-${kind}`} aria-labelledby={`drawing-tab-${kind}`} className="mt-6">
        {current?.src ? (
          <div className="relative">
            <div
              ref={boxRef}
              tabIndex={0}
              role="img"
              aria-label={`${title} — ${labels.tabs[kind]}. ${labels.hint}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className={[
                "relative aspect-[16/9] overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] touch-none select-none",
                view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG 도면은 최적화 대상이 아니며 <img> 로 스크립트 실행을 막는다 */}
              <img
                src={current.src}
                alt=""
                draggable={false}
                className={["absolute inset-0 w-full h-full object-contain p-4 md:p-8", animate ? "motion-safe:transition-transform motion-safe:duration-200" : ""].join(" ")}
                style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: "center" }}
              />
            </div>
            <div className="absolute top-3 right-3 flex gap-1.5">
              <button type="button" className={btn} aria-label={labels.zoomIn} onClick={() => { setAnimate(true); zoomAt(1.25); }}>+</button>
              <button type="button" className={btn} aria-label={labels.zoomOut} onClick={() => { setAnimate(true); zoomAt(1 / 1.25); }}>−</button>
              <button type="button" className={btn} aria-label={labels.reset} onClick={reset}>⟲</button>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-muted)]">
              {labels.hint} · {Math.round(view.scale * 100)}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 aspect-[16/9] border border-dashed border-[var(--text-muted)]/40 bg-[var(--bg-surface)] text-center px-6">
            <span className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">{labels.pending}</span>
            <span className="text-sm text-[var(--text)]/70">{labels.tabs[kind]}</span>
          </div>
        )}
        <p className="mt-3 text-xs text-[var(--text-muted)] [word-break:keep-all]">※ {labels.note}</p>
      </div>
    </div>
  );
}
