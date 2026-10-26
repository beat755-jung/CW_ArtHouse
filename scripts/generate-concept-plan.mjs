// Deterministic, standalone SVG. Geometry is shared with the interactive model.
// Run with Node 24+: node scripts/generate-concept-plan.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { walls, furniture, rooms } from "../lib/concept-house.ts";

const n = value => Number(value.toFixed(3));
const line = (x1, y1, x2, y2, cls = "fine") => `<path class="${cls}" d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}"/>`;
const rect = (x, y, w, h, cls) => `<rect class="${cls}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/>`;
function wallPlan(w, upper = false) {
  // Orthogonal wall coordinates: local X = length, Y = wall thickness.
  // Illustration planes, not measured heights. Only intersected openings cut the wall.
  const plane = upper ? 2.6 : 1.25;
  const available = w.openings.map((o, index) => ({ ...o, index })).filter(o => o.at >= w.from && o.at + o.width <= w.to);
  const openings = available.filter(o => o.sill < plane && o.sill + o.height > plane);
  let cursor = w.from;
  let drawing = "";
  for (const o of openings.toSorted((a, b) => a.at - b.at)) {
    if (o.at > cursor) drawing += rect(cursor, -.065, o.at - cursor, .13, "wall");
    drawing += `<g data-opening="${w.id}-${o.index}" data-level="cut">`;
    if (o.kind === "door") {
      const r = o.width / 2;
      drawing += `<path class="guess" d="M${o.at} 0v${r}m${o.width} ${-r}v${r}M${o.at} ${r}a${r} ${r} 0 0 0 ${r} ${-r}m0 0a${r} ${r} 0 0 0 ${r} ${r}"/>`;
    } else if (o.kind === "hatch") {
      drawing += line(o.at, 0, o.at + o.width, 0, "guess");
    } else {
      for (const dy of [-.05, 0, .05]) drawing += line(o.at, dy, o.at + o.width, dy, "window");
      drawing += line(o.at, -.065, o.at, .065, "fine") + line(o.at + o.width, -.065, o.at + o.width, .065, "fine");
    }
    drawing += "</g>";
    cursor = Math.max(cursor, o.at + o.width);
  }
  if (cursor < w.to) drawing += rect(cursor, -.065, w.to - cursor, .13, "wall");
  if (!upper) for (const o of available.filter(o => !openings.includes(o))) {
    const above = o.sill >= plane;
    drawing += `<g data-opening="${w.id}-${o.index}" data-level="${above ? "above" : "below"}"><title>${above ? "상부 창 · 추정 / Above cut" : "하부 해치 · 추정 / Below cut"}</title>${line(o.at, above ? -.18 : .18, o.at + o.width, above ? -.18 : .18, "overhead")}</g>`;
  }
  const transform = w.axis === "x" ? `translate(0 ${w.fixed})` : `translate(${w.fixed} 0) rotate(90)`;
  return `<g id="${upper ? "loft-" : ""}wall-${w.id}" transform="${transform}">${drawing}</g>`;
}
function furnishing(f) {
  let inside = "";
  if (f.kind === "sofa") inside = line(.17, .12, .17, f.d - .12) + line(.17, f.d / 2, f.w, f.d / 2);
  if (f.kind === "counter") inside = rect(.18, .12, .5, .3, "fine") + `<circle class="fine" cx="1.5" cy=".27" r=".1"/><circle class="fine" cx="1.82" cy=".27" r=".1"/>`;
  if (f.kind === "shower") inside = line(0, 0, f.w, f.d) + line(f.w, 0, 0, f.d);
  if (f.kind === "wc" || f.kind === "basin") inside = `<ellipse class="fine" cx="${f.w / 2}" cy="${f.d / 2}" rx="${f.w * .32}" ry="${f.d * .3}"/>`;
  if (f.kind === "bed") inside = rect(.12, .12, .42, .62, "fine") + rect(.12, 1.05, .42, .62, "fine") + line(.65, 0, .65, f.d);
  return `<g id="furniture-${f.id}" transform="translate(${f.x} ${f.z})">${rect(0, 0, f.w, f.d, "guess")}${inside}</g>`;
}
const roomAreas = { living: [-2.73,.45,4.46,2.08], kitchen: [-2.73,-2.53,4.46,2.4], flex: [-4.93,-1.43,2.06,2.86], bathroom: [2.84,-1.43,2.09,1.79], entry: [2.84,.47,2.09,.96] };
const roomLabels = rooms.map(r => {
  const [x,y,w,h] = roomAreas[r.id];
  return `<g id="room-${r.id}"><title>${r.ko} ${r.en} — 용도·배치 추정 / proposed use</title><rect class="room-hit" x="${x}" y="${y}" width="${w}" height="${h}" pointer-events="none"/><text class="room" x="${r.x}" y="${r.z}">${r.ko}</text><text class="english" x="${r.x}" y="${r.z + .24}">${r.en}</text></g>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1080" role="img" aria-labelledby="title desc">
<title id="title">CW_ArtHouse — 미니하우스 개념 평면도 / Concept floor plan</title>
<desc id="desc">제작 사진에 근거한 양측 확장형 미니하우스의 1층과 다락 배치 제안. 거실, 주방·식사, 다목적 공간, 욕실·수납, 출입구와 다락. 치수와 축척 없음. 실의 용도, 가구, 비례 및 가려진 부분은 추정. 북쪽 미정. Ground floor and loft concept, not to scale. Room uses, furniture and proportions are provisional.</desc>
<defs><pattern id="hatch" width=".12" height=".12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V.12" stroke="#b8956a" stroke-width=".02"/></pattern></defs>
<style>
text{font-family:Arial,'Malgun Gothic',sans-serif;fill:#ede8e0}
.wall{fill:#ede8e0;stroke:none}.fine{fill:none;stroke:#ede8e0;stroke-width:.018}.window{fill:none;stroke:#b8956a;stroke-width:.018}
.guess{fill:none;stroke:#b8956a;stroke-width:.022;stroke-dasharray:.08 .06}.overhead{fill:none;stroke:#7a7570;stroke-width:.018;stroke-dasharray:.06 .05}
.room{font-size:.24px;text-anchor:middle}.english{font-size:.18px;text-anchor:middle;fill:#b8956a}#room-loft .english{font-size:.23px}
.room-hit{fill:#b8956a;fill-opacity:0;stroke:none}g[id^="room-"]:hover .room-hit{fill-opacity:.12}
.meta{font-size:16px;fill:#7a7570}.sub{font-size:18px;fill:#b8956a}.small{font-size:15px;fill:#ede8e0}
</style>
<text x="72" y="65" class="sub" letter-spacing="4">CW_ART HOUSE / SPATIAL STUDY</text>
<text x="72" y="120" font-size="38">미니하우스 개념 평면도</text>
<text x="72" y="153" class="meta">CONCEPT FLOOR PLAN · 양측 확장 상태 / Expanded configuration</text>
<text x="1368" y="65" class="sub" text-anchor="end">CONCEPT / 개념도</text>
<path d="M72 180H1368" stroke="#7a7570" stroke-width=".6"/>
<text x="72" y="220" class="sub">01 / 1층 Ground floor</text>
<text x="1368" y="220" class="meta" text-anchor="end">비례 추정 · 축척 없음 / Not to scale</text>
<g transform="translate(745 450) scale(82)">
  <path d="M-5 -1.5H-2.8V-2.6H1.8V-1.5H5V1.5H1.8V2.6H-2.8V1.5H-5Z" fill="#b8956a" fill-opacity=".035"/>
  ${walls.map(w => wallPlan(w)).join("")}
  <path class="overhead" d="M-2.8 -1.5H1.8M-2.8 1.5H1.8M2.8 -1.5V1.5"/>
  <g id="interior-walls"><title>내벽 위치 추정 / Proposed partitions</title><path d="M2.8 -1.5V.4H4.1M4.8 .4H5" fill="none" stroke="#b8956a" stroke-width=".07" stroke-dasharray=".14 .045"/></g>
  <path class="guess" d="M4.1 .4v-.7m0 .7a.7 .7 0 0 0 .7 -.7"/>
  ${furniture.filter(f => !f.level).map(furnishing).join("")}
  <g id="loft-access" class="guess"><path d="M2.23 -.6H2.7V.25H2.23ZM2.23 -.4H2.7M2.23 -.2H2.7M2.23 0H2.7"/></g>
  ${roomLabels}
  <g id="section-aa" aria-label="A–A 거실 횡단면, 견인부에서 다락 쪽으로 보는 방향">
    <path d="M-2.05 -3.15V3.15M-2.05 -3.15h.4m-.12 -.1l.12 .1-.12 .1M-2.05 3.15h.4m-.12 -.1l.12 .1-.12 .1" fill="none" stroke="#b8956a" stroke-width=".025" stroke-dasharray=".18 .07 .03 .07"/>
    <text x="-2.3" y="-3.05" class="english">A</text><text x="-2.3" y="3.18" class="english">A</text>
  </g>
  <path class="fine" d="M-5 -1L-6.35 0L-5 1M-6.35 0H-6.65"/>
  <text x="-6" y=".48" class="english">견인부 Tow</text>
  <path class="guess" d="M3.48 2.3V1.8m-.12 .16l.12 -.16 .12 .16"/>
  <text x="3.48" y="2.62" class="english">진입 Entry</text>
</g>
<text x="970" y="716" text-anchor="middle" class="meta">A측 / A side · 확장 상태 / Expanded</text>
<text x="745" y="218" text-anchor="middle" class="meta">B측 / B side · 소형 창 / Small windows</text>
<path d="M72 735H1368" stroke="#7a7570" stroke-width=".6"/>
<text x="72" y="780" class="sub">02 / 다락 Loft</text>
<g transform="translate(70 800) scale(64)">
  <g transform="translate(-2.8 1.5)">
    ${walls.filter(w => w.id === "loft-end").map(w => wallPlan(w, true)).join("")}
    ${["a-entry", "b-rear"].map(id => wallPlan({ ...walls.find(w => w.id === id), from: 2.8 }, true)).join("")}
    <path class="guess" d="M2.8 -1.5V1.5"/>
    ${furniture.filter(f => f.level).map(furnishing).join("")}
  </g>
</g>
<g id="room-loft"><title>다락 Loft — 취침 용도 추정 / proposed sleeping area</title>
<rect class="room-hit" x="71" y="803" width="137" height="186" pointer-events="none"/>
<text x="285" y="835" class="small">다락 Loft · 출입문 쪽 끝의 상부 공간</text>
<text x="285" y="862" class="meta">Loft above the entrance end</text></g>
<text x="285" y="903" class="small">침구·접근 방식은 배치 제안</text>
<text x="285" y="930" class="meta">Bedding / access are provisional</text>
<text x="760" y="780" class="sub">범례 / Drawing key</text>
<path d="M760 818h46" stroke="#ede8e0" stroke-width="6"/><text x="825" y="824" class="small">사진에서 확인한 형태 / Observed form</text>
<path d="M760 855h46" stroke="#b8956a" stroke-width="2" stroke-dasharray="6 5"/><text x="825" y="861" class="small">추정·배치 제안 / Inferred or proposed</text>
<path d="M760 892h46" stroke="#7a7570" stroke-dasharray="4 4"/><text x="825" y="898" class="small">상부 창·하부 해치 / Above / below cut</text>
<text x="760" y="942" class="meta">방위 미정 / Orientation TBD · 축척 없음 / NTS</text>
<path d="M72 998H1368" stroke="#7a7570" stroke-width=".6"/>
<text x="72" y="1030" class="small">공간 이해를 위한 개념도 · 실 용도와 가구 배치는 추정이며, 최종 설계에 따라 달라집니다.</text>
<text x="72" y="1056" class="meta">Concept only. Room uses and furnishings are provisional. Dimensions and specifications to follow.</text>
</svg>`;
await mkdir(new URL("../public/drawings/prototype-01/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/drawings/prototype-01/plan.svg", import.meta.url), svg);
await writeFile(new URL("../public/drawings/prototype-01/plan-prototype-01.svg", import.meta.url), svg);
console.log("Generated plan-prototype-01.svg (and legacy plan.svg alias)");
