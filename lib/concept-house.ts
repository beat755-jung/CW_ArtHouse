/**
 * Shared diagram geometry, in UNITLESS illustration coordinates (never mm/metres).
 * X: towing end (-) → entrance/loft end (+). Z: B side (-) → A side (+).
 * Photo evidence: ING-05/08/14/18/65, docs/image-inventory.md.
 * Positions/proportions are approximate; room uses and furnishings are proposals.
 * Upper windows are separated in the SVG so they cannot read as ground-floor windows.
 */
export type Opening = { at: number; width: number; sill: number; height: number; kind?: "door" | "hatch" };
export type Wall = { id: string; axis: "x" | "z"; fixed: number; from: number; to: number; height: number; openings: Opening[]; pod?: boolean };
export const body = { left: -5, right: 5, back: -1.5, front: 1.5, height: 3.2 };
export const pod = { left: -2.8, right: 1.8, depth: 1.1, height: 2.65 };
export const loft = { left: 2.8, right: 5, back: -1.5, front: 1.5, level: 2.05 };
export const walls: Wall[] = [
  { id: "tow-end", axis: "z", fixed: -5, from: -1.5, to: 1.5, height: 3.2, openings: [{ at: -1.1, width: .8, sill: 2.15, height: .65 }, { at: .3, width: .8, sill: 2.15, height: .65 }] },
  { id: "loft-end", axis: "z", fixed: 5, from: -1.5, to: 1.5, height: 3.2, openings: [{ at: -1.15, width: .8, sill: 2.3, height: .65 }, { at: .35, width: .8, sill: 2.3, height: .65 }] },
  { id: "a-tow", axis: "x", fixed: 1.5, from: -5, to: -2.8, height: 3.2, openings: [{ at: -4.75, width: .8, sill: 2.05, height: .7 }, { at: -4.8, width: 1, sill: .1, height: 1.05, kind: "hatch" }] },
  { id: "b-tow", axis: "x", fixed: -1.5, from: -5, to: -2.8, height: 3.2, openings: [{ at: -4.75, width: .8, sill: 2.05, height: .7 }, { at: -4.8, width: 1, sill: .1, height: 1.05, kind: "hatch" }] },
  { id: "a-entry", axis: "x", fixed: 1.5, from: 1.8, to: 5, height: 3.2, openings: [{ at: 2.05, width: .55, sill: 1.15, height: .55 }, { at: 2.85, width: 1.25, sill: 0, height: 2, kind: "door" }, { at: 4.35, width: .5, sill: 1.1, height: .55 }, { at: 4.35, width: .5, sill: 2.3, height: .65 }] },
  { id: "b-rear", axis: "x", fixed: -1.5, from: 1.8, to: 5, height: 3.2, openings: [{ at: 2.05, width: .55, sill: 1.15, height: .55 }, { at: 4.35, width: .5, sill: 1.1, height: .55 }, { at: 4.35, width: .5, sill: 2.3, height: .65 }] },
  { id: "a-pod", axis: "x", fixed: 2.6, from: -2.8, to: 1.8, height: 2.65, pod: true, openings: [{ at: -.95, width: 1.65, sill: .25, height: 1.9 }] },
  { id: "b-pod", axis: "x", fixed: -2.6, from: -2.8, to: 1.8, height: 2.65, pod: true, openings: [{ at: -2, width: .65, sill: 1.15, height: .8 }, { at: -.65, width: .65, sill: 1.15, height: .8 }, { at: .7, width: .65, sill: 1.15, height: .8 }] },
  { id: "a-pod-tow", axis: "z", fixed: -2.8, from: 1.5, to: 2.6, height: 2.65, pod: true, openings: [{ at: 1.7, width: .65, sill: 1.15, height: .65 }] },
  { id: "a-pod-rear", axis: "z", fixed: 1.8, from: 1.5, to: 2.6, height: 2.65, pod: true, openings: [] },
  { id: "b-pod-tow", axis: "z", fixed: -2.8, from: -2.6, to: -1.5, height: 2.65, pod: true, openings: [] },
  { id: "b-pod-rear", axis: "z", fixed: 1.8, from: -2.6, to: -1.5, height: 2.65, pod: true, openings: [{ at: -2.35, width: .65, sill: 1.15, height: .65 }] },
];

export type Furniture = { id: string; x: number; z: number; w: number; d: number; h: number; kind: "sofa" | "table" | "chair" | "counter" | "cabinet" | "shower" | "wc" | "basin" | "bed"; level?: number };
export const furniture: Furniture[] = [
  { id: "sofa", x: -2.45, z: 1.1, w: .72, d: 1.32, h: .45, kind: "sofa" },
  { id: "coffee", x: -.75, z: 1.55, w: 1.15, d: .55, h: .35, kind: "table" },
  { id: "kitchen", x: -2.55, z: -2.43, w: 2.1, d: .55, h: .85, kind: "counter" },
  { id: "dining", x: .25, z: -2.15, w: 1.1, d: .65, h: .7, kind: "table" },
  { id: "chair-1", x: .25, z: -1.3, w: .4, d: .38, h: .4, kind: "chair" },
  { id: "chair-2", x: .9, z: -1.3, w: .4, d: .38, h: .4, kind: "chair" },
  { id: "storage", x: -4.78, z: -.5, w: .55, d: 1, h: 1.1, kind: "cabinet" },
  { id: "shower", x: 4.05, z: -1.3, w: .7, d: .75, h: .08, kind: "shower" },
  { id: "wc", x: 3.1, z: -1.28, w: .48, d: .6, h: .45, kind: "wc" },
  { id: "basin", x: 4.35, z: -.2, w: .4, d: .45, h: .75, kind: "basin" },
  { id: "bed", x: 3.18, z: -.95, w: 1.55, d: 1.9, h: .22, kind: "bed", level: 2.16 },
];
export const rooms = [
  { id: "living", ko: "거실", en: "Living", x: -.4, z: 1, number: "01" },
  { id: "kitchen", ko: "주방·식사", en: "Kitchen / Dining", x: -.5, z: -1.05, number: "02" },
  { id: "flex", ko: "다목적·수납", en: "Flex / Storage", x: -3.5, z: .1, number: "03" },
  { id: "bathroom", ko: "욕실·수납", en: "Bath / Storage", x: 3.65, z: -.35, number: "04" },
  { id: "entry", ko: "출입구", en: "Entry", x: 3.55, z: 1.05, number: "05" },
];
