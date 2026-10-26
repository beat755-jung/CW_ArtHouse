"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";
import type { HouseMode, HouseScene, HouseView } from "@/lib/concept-house-scene";

type Labels = Dictionary["projectDetail"]["concept3d"];

export default function ConceptHouseViewer({ labels }: { labels: Labels }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HouseScene | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mode, setMode] = useState<HouseMode>("interior");

  useEffect(() => {
    if (!attempt || !hostRef.current) return;
    let cancelled = false;
    let instance: HouseScene | undefined;
    import("@/lib/concept-house-scene").then(({ createHouseScene }) => {
      if (cancelled || !hostRef.current) return;
      instance = createHouseScene(hostRef.current, () => setStatus("error"), () => setStatus("ready"));
      sceneRef.current = instance;
      setStatus("ready");
    }).catch(error => {
      if (!cancelled) { console.error("Concept 3D initialization failed", error); setStatus("error"); }
    });
    return () => { cancelled = true; instance?.dispose(); sceneRef.current = null; };
  }, [attempt]);

  const button = "border border-[var(--border)] px-3 py-2 text-xs text-[var(--text)] hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed";
  const ready = status === "ready";
  const changeMode = (value: HouseMode) => { setMode(value); sceneRef.current?.mode(value); };

  return (
    <section aria-labelledby="concept-3d-title" className="mt-12 border-t border-[var(--border)] pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] tracking-[.25em] text-[var(--accent)] uppercase mb-2">{labels.eyebrow}</p>
          <h3 id="concept-3d-title" className="font-korean text-xl">{labels.title}</h3>
        </div>
        <span className="text-xs text-[var(--text-muted)]">{labels.badge}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={labels.modeLabel}>
        {(["interior", "exterior", "loft"] as const).map(value => (
          <button key={value} type="button" disabled={!ready} aria-pressed={mode === value} onClick={() => changeMode(value)} className={`${button} ${mode === value ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}>{labels.modes[value]}</button>
        ))}
      </div>
      <div className="relative border border-[var(--border)] bg-[var(--bg-surface)]">
        <div
          ref={hostRef}
          tabIndex={ready ? 0 : -1}
          role="group"
          aria-label={`${labels.title}. ${labels.keyboard}`}
          aria-describedby="concept-3d-hint"
          className="h-[360px] sm:h-[460px] lg:h-[540px] w-full overflow-hidden touch-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-grab active:cursor-grabbing"
          onKeyDown={event => {
            const actions: Record<string, () => void> = {
              ArrowLeft: () => sceneRef.current?.rotate(.15, 0), ArrowRight: () => sceneRef.current?.rotate(-.15, 0),
              ArrowUp: () => sceneRef.current?.rotate(0, -.15), ArrowDown: () => sceneRef.current?.rotate(0, .15),
              "+": () => sceneRef.current?.zoom(1.2), "=": () => sceneRef.current?.zoom(1.2),
              "-": () => sceneRef.current?.zoom(1 / 1.2), "0": () => sceneRef.current?.view("perspective"),
            };
            if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
          }}
        />
        {!ready && (
          <div className="absolute inset-0 bg-[var(--bg-surface)]">
            <Image src="/drawings/prototype-01/interior-preview.png" alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 1100px" className="object-contain" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 border border-[var(--border)] bg-[var(--bg)]/90 p-4">
              <p role="status" className="max-w-sm text-xs text-[var(--text-muted)]">{status === "error" ? labels.error : status === "loading" ? labels.loading : labels.intro}</p>
              {(status === "idle" || status === "error") && <button type="button" className={`${button} !border-[var(--accent)]`} onClick={() => { setMode("interior"); setStatus("loading"); setAttempt(value => value + 1); }}>{status === "error" ? labels.retry : labels.start}</button>}
            </div>
          </div>
        )}
        {ready && <div data-preview-label className="absolute left-4 top-4 pointer-events-none text-[11px] tracking-wider text-[var(--accent)]">{labels.modes[mode]} · {labels.proposed}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3" role="group" aria-label={labels.viewLabel}>
        {(["perspective", "top", "bottom", "a", "b", "tow", "rear"] as HouseView[]).map(value => (
          <button type="button" disabled={!ready} className={button} key={value} onClick={() => sceneRef.current?.view(value)}>{labels.views[value]}</button>
        ))}
        <button type="button" disabled={!ready} className={button} aria-label={labels.zoomIn} onClick={() => sceneRef.current?.zoom(1.2)}>+</button>
        <button type="button" disabled={!ready} className={button} aria-label={labels.zoomOut} onClick={() => sceneRef.current?.zoom(1 / 1.2)}>−</button>
      </div>
      <p id="concept-3d-hint" className="mt-3 text-xs text-[var(--text-muted)]">{labels.hint}</p>
      <ol className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-5 text-xs text-[var(--text)]" aria-label={labels.roomLabel}>
        {labels.rooms.map((room, i) => <li key={room}><span className="text-[var(--accent)] mr-2">{String(i + 1).padStart(2, "0")}</span>{room}</li>)}
      </ol>
      <p className="mt-5 text-xs leading-relaxed text-[var(--text-muted)] [word-break:keep-all]">{labels.note}</p>
    </section>
  );
}
