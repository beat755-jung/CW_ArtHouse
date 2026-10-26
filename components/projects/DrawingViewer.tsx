/**
 * components/projects/DrawingViewer.tsx — 평면·정면·측면·단면·외벽 상세 보기
 *
 * [파일]
 * - public/drawings/{slug}/{kind}-{slug}.svg — 서버에서 파일 유무를 확인해 전달
 * - 없으면 "도면 준비 중" 자리
 *
 * [조작] 외부 라이브러리 없음
 * - 모바일은 원본 크기의 읽기 보기: 상하좌우 네이티브 스크롤. 전체보기 전환 가능.
 * - 끌어서 이동 · 휠 / 두 손가락 핀치로 확대(1~6배) · [+][−][⟲] 버튼 · 키보드 + − 0 화살표
 * - 검증된 평면 SVG는 Shadow DOM으로 표시해 room-* 상호작용 지원. 다른 도면은 img.
 * - prefers-reduced-motion: 버튼 확대 시 전환 효과 없음
 *
 * [문구] 하단에 "개념도이며 실제 치수와 다를 수 있습니다" (ko/en)
 */
"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import FilterTabs from "@/components/FilterTabs";
import InteractivePlan from "@/components/projects/InteractivePlan";
import type { DrawingAsset, DrawingCategory, DrawingKind, DrawingRoom } from "@/lib/drawing-types";

export type { DrawingKind } from "@/lib/drawing-types";

interface Props {
  drawings: DrawingAsset[];
  rooms?: DrawingRoom[];
  labels: {
    tabs: Record<DrawingKind, string>;
    categories: Record<DrawingCategory, string>;
    tabsLabel: string;
    pending: string;
    note: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
    hint: string;
    reading: string;
    overview: string;
    readingHint: string;
    roomHint: string;
    photoNote: string;
    photoPending: string;
  };
  title: string;
}

const MIN = 1;
const MAX = 6;
const EMPTY_ROOMS: DrawingRoom[] = [];
const categoryFor = (kind: DrawingKind): DrawingCategory => kind.startsWith("elevation-") ? "elevation" : kind as DrawingCategory;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const mobileQuery = "(max-width: 639px)";
const subscribeMobile = (callback: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const isMobile = () => window.matchMedia(mobileQuery).matches;
const serverMobile = () => false;
const readingCenters: Record<DrawingKind, [number, number]> = {
  plan: [745, 450], "elevation-front": [655, 500], "elevation-side": [625, 550],
  section: [710, 520], "detail-wall": [500, 500],
};

export default function DrawingViewer({ drawings, labels, title, rooms = EMPTY_ROOMS }: Props) {
  const prefix = `drawing-${useId()}`;
  const first = drawings.find((d) => d.src)?.kind ?? "plan";
  const [kind, setKind] = useState<DrawingKind>(first);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const selectRoom = useCallback((id: string) => setActiveRoom(id), []);
  const selectedRoom = rooms.find(room => room.id === activeRoom);
  const category = categoryFor(kind);
  const categories = [...new Set(drawings.map(d => categoryFor(d.kind)))];
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(false);
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, serverMobile);
  const [mode, setMode] = useState<"auto" | "read" | "fit">("auto");
  const reading = mode === "read" || (mode === "auto" && mobile);
  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  const current = drawings.find((d) => d.kind === kind);
  const [, , sheetWidth, sheetHeight] = current?.viewBox ?? [0, 0, 1440, 1080];
  const centerReading = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const [x, y] = readingCenters[kind];
    box.scrollLeft = x / 1440 * sheetWidth - box.clientWidth / 2;
    box.scrollTop = y / 1080 * sheetHeight - box.clientHeight / 2;
  }, [kind, sheetWidth, sheetHeight]);

  useEffect(() => {
    if (reading) centerReading();
  }, [reading, centerReading, current?.src]);

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
    if (reading) centerReading();
  };

  // 휠 확대 — passive:false 로 등록해야 페이지 스크롤을 막을 수 있음
  useEffect(() => {
    const el = boxRef.current;
    if (!el || reading) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setAnimate(false);
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, current?.src, reading]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reading) return;
    if (e.nativeEvent.composedPath().some(node => node instanceof Element && node.id.startsWith("room-"))) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setAnimate(false);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (reading) return;
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
    if (reading && e.key.startsWith("Arrow")) return;
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
  const changeCategory = (value: DrawingCategory) => {
    const drawing = drawings.find(d => categoryFor(d.kind) === value && d.src) ?? drawings.find(d => categoryFor(d.kind) === value);
    if (drawing) changeKind(drawing.kind);
  };
  const sheetClass = reading ? "block max-w-none" : ["absolute inset-0 w-full h-full object-contain p-4 md:p-8", animate ? "motion-safe:transition-transform motion-safe:duration-200" : ""].join(" ");
  const sheetStyle = reading ? { width: sheetWidth * view.scale, height: "auto", aspectRatio: `${sheetWidth} / ${sheetHeight}` } : { transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: "center" };

  const btn =
    "flex items-center justify-center w-9 h-9 bg-[var(--bg)]/85 border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

  return (
    <div>
      <FilterTabs
        tabs={categories.map(value => ({ key: value, label: labels.categories[value], tag: drawings.some(d => categoryFor(d.kind) === value && d.src) ? undefined : labels.pending }))}
        active={category}
        onChange={changeCategory}
        label={labels.tabsLabel}
        panelIdPrefix={prefix}
      />

      <div role="tabpanel" id={`${prefix}-panel-${category}`} aria-labelledby={`${prefix}-tab-${category}`} className="mt-6">
        {category === "elevation" && <div className="flex flex-wrap gap-3 mb-4">
          {drawings.filter(d => categoryFor(d.kind) === "elevation").map(d => <button key={d.kind} type="button" aria-pressed={kind === d.kind}
            className="text-sm border border-[var(--border)] px-3 py-2 aria-pressed:border-[var(--accent)] aria-pressed:text-[var(--accent)]"
            onClick={() => changeKind(d.kind)}>{labels.tabs[d.kind]}</button>)}
        </div>}
        <div className={kind === "plan" && rooms.length ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_15rem]" : ""}>
        {current?.src ? (
          <div className="relative min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {(["read", "fit"] as const).map((value) => (
                  <button key={value} type="button" aria-pressed={reading === (value === "read")}
                    className="border border-[var(--border)] px-3 py-2 text-sm aria-pressed:border-[var(--accent)] aria-pressed:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    onClick={() => { setMode(value); setView({ scale: 1, x: 0, y: 0 }); pointers.current.clear(); pinch.current = null; }}>
                    {value === "read" ? labels.reading : labels.overview}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                <button type="button" className={btn} aria-label={labels.zoomIn} onClick={() => { setAnimate(true); zoomAt(1.25); }}>+</button>
                <button type="button" className={btn} aria-label={labels.zoomOut} onClick={() => { setAnimate(true); zoomAt(1 / 1.25); }}>−</button>
                <button type="button" className={btn} aria-label={labels.reset} onClick={reset}>⟲</button>
              </div>
            </div>
            <div
              ref={boxRef}
              tabIndex={0}
              role="region"
              aria-label={`${title} — ${labels.tabs[kind]}. ${reading ? labels.readingHint : labels.hint}`}
              data-drawing-mode={reading ? "read" : "fit"}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              className={[
                "relative bg-[var(--bg-surface)] border border-[var(--border)] select-none",
                reading ? "overflow-auto touch-auto h-[min(520px,65svh)]" : "overflow-hidden touch-none aspect-[4/3]",
                reading ? "" : view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
              ].join(" ")}
            >
              {kind === "plan" && current.svg ? <InteractivePlan svg={current.svg} rooms={rooms} active={activeRoom} onSelect={selectRoom} className={sheetClass} style={sheetStyle} /> : (
              /* eslint-disable-next-line @next/next/no-img-element -- standalone SVG */
              <img
                src={current.src}
                alt={`${title} — ${labels.tabs[kind]}`}
                draggable={false}
                className={sheetClass}
                style={sheetStyle}
              />
              )}
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {reading ? labels.readingHint : labels.hint} · {Math.round(view.scale * 100)}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 aspect-[16/9] border border-dashed border-[var(--text-muted)]/40 bg-[var(--bg-surface)] text-center px-6">
            <span className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">{labels.pending}</span>
            <span className="text-sm text-[var(--text)]/70">{labels.tabs[kind]}</span>
          </div>
        )}
        {kind === "plan" && rooms.length > 0 && <aside className="min-w-0 border border-[var(--border)] p-4 self-start" aria-label={labels.roomHint}>
          <p className="text-sm text-[var(--text-muted)] mb-4">{labels.roomHint}</p>
          <div className="flex flex-wrap gap-2 mb-4">{rooms.map(room => <button key={room.id} type="button" aria-pressed={activeRoom === room.id}
            onMouseEnter={() => selectRoom(room.id)} onFocus={() => selectRoom(room.id)} onClick={() => selectRoom(room.id)}
            className="text-sm px-2 py-1 border border-[var(--border)] aria-pressed:border-[var(--accent)] aria-pressed:text-[var(--accent)]">{room.name}</button>)}</div>
          <div aria-live="polite" aria-atomic="true">
            {selectedRoom && <><h3 className="text-base text-[var(--accent)] mb-3">{selectedRoom.name}</h3>
              {selectedRoom.images.length ? <><p className="text-xs text-[var(--text-muted)] mb-3">{labels.photoNote}</p>
                {selectedRoom.images.map(photo => <figure key={photo.src} className="mb-4"><Image src={photo.src} alt={photo.alt} width={480} height={360} sizes="(max-width: 1279px) 80vw, 240px" className="w-full h-auto" />
                  <figcaption className="mt-2 text-xs text-[var(--text-muted)]">{photo.alt}</figcaption></figure>)}</>
                : <p className="text-sm text-[var(--text-muted)]">{labels.photoPending}</p>}</>}
          </div>
        </aside>}
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)] [word-break:keep-all]">※ {labels.note}</p>
      </div>
    </div>
  );
}
