export type DrawingKind = "plan" | "elevation-front" | "elevation-side" | "section" | "detail-wall";
export type DrawingCategory = "plan" | "elevation" | "section" | "detail-wall";
export interface DrawingAsset {
  kind: DrawingKind;
  src: string | null;
  svg?: string;
  viewBox?: [number, number, number, number];
}
export interface DrawingRoom {
  id: string;
  name: string;
  images: { src: string; alt: string }[];
}
