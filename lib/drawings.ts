/**
 * lib/drawings.ts — 프로젝트 도면 파일 찾기 (서버 전용, 빌드 시 실행)
 *
 * - lib/projects.ts의 drawings 경로로 SVG를 읽고 검증 (평면·정면·측면·단면·외벽 상세)
 * - 파일이 있으면 경로, 없으면 null → DrawingViewer 가 "도면 준비 중" 표시
 * - 도면의 치수·면적을 데이터로 옮겨 적지 않는다 (CLAUDE.md 콘텐츠 규칙)
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DrawingAsset, DrawingKind } from "@/lib/drawing-types";
import type { Project } from "@/lib/projects";
import { prepareSvg } from "@/scripts/lib/prepare-svg.mjs";

const KINDS: DrawingKind[] = ["plan", "elevation-front", "elevation-side", "section", "detail-wall"];

export function getDrawings(project: Project): DrawingAsset[] {
  return KINDS.map((kind) => {
    const src = project.drawings?.[kind];
    if (!src) return { kind, src: null };
    if (!/^\/drawings\/[\w-]+\/[\w-]+\.svg$/.test(src)) throw new Error(`Invalid drawing path: ${src}`);
    const file = path.join(process.cwd(), "public", src);
    if (!fs.existsSync(file)) return { kind, src: null };
    const result = prepareSvg(fs.readFileSync(file, "utf8"));
    // Fail the build if public assets still contain content that must be removed.
    if (result.removed.length) throw new Error(`Run npm run drawings:optimize: ${src}`);
    if (kind === "plan") for (const room of project.drawingRooms ?? []) {
      if (!result.ids.includes(room.id)) throw new Error(`Missing SVG room ID ${room.id}: ${src}`);
    }
    return { kind, src, svg: kind === "plan" ? result.svg : undefined, viewBox: result.viewBox as DrawingAsset["viewBox"] };
  });
}
