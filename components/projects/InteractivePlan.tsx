"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { DrawingRoom } from "@/lib/drawing-types";

/** Build-validated SVG lives in a shadow root so its styles and IDs stay local. */
export default function InteractivePlan({ svg, rooms, active, onSelect, className, style }: {
  svg: string; rooms: DrawingRoom[]; active: string | null; onSelect: (id: string) => void;
  className: string; style: CSSProperties;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const root = host.current.shadowRoot ?? host.current.attachShadow({ mode: "open" });
    root.innerHTML = svg;
    const sheet = document.createElement("style");
    sheet.textContent = `
      :host{display:block}svg{display:block;width:100%;height:100%}
      g[role=button]{cursor:pointer;outline:none}
      .room-hit{pointer-events:none;fill:var(--accent);fill-opacity:0!important}
      g[data-active=true] .room-hit,g[role=button]:focus-visible .room-hit{fill-opacity:.22!important}
      g[data-active=true] text,g[role=button]:focus-visible text{fill:var(--accent)!important}
      g[role=button]:focus-visible text{text-decoration:underline}
    `;
    root.append(sheet);
    root.querySelector("svg")?.setAttribute("role", "group");
    const cleanup: (() => void)[] = [];
    for (const room of rooms) {
      const group = root.getElementById(room.id);
      if (!group) continue;
      group.setAttribute("role", "button");
      group.setAttribute("tabindex", "0");
      group.setAttribute("aria-label", room.name);
      const select = () => onSelect(room.id);
      const key = (e: Event) => {
        if (["Enter", " "].includes((e as KeyboardEvent).key)) { e.preventDefault(); select(); }
      };
      for (const event of ["pointerenter", "focus", "click"]) {
        group.addEventListener(event, select);
        cleanup.push(() => group.removeEventListener(event, select));
      }
      group.addEventListener("keydown", key);
      cleanup.push(() => group.removeEventListener("keydown", key));
    }
    return () => { cleanup.forEach(fn => fn()); root.replaceChildren(); };
  }, [svg, rooms, onSelect]);

  useEffect(() => {
    for (const group of host.current?.shadowRoot?.querySelectorAll('g[role="button"]') ?? []) {
      group.setAttribute("data-active", String(group.id === active));
      group.setAttribute("aria-pressed", String(group.id === active));
    }
  }, [active, svg, rooms]);

  return <div ref={host} className={className} style={style} data-interactive-plan />;
}
