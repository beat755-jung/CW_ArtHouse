/**
 * lib/drawings.ts — 프로젝트 도면 파일 찾기 (서버 전용, 빌드 시 실행)
 *
 * - 위치: public/drawings/{slug}/{kind}-{slug}.svg (평면·정면·측면·단면·외벽 상세)
 * - 파일이 있으면 경로, 없으면 null → DrawingViewer 가 "도면 준비 중" 표시
 * - 도면의 치수·면적을 데이터로 옮겨 적지 않는다 (CLAUDE.md 콘텐츠 규칙)
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DrawingKind } from "@/components/projects/DrawingViewer";

const KINDS: DrawingKind[] = ["plan", "elevation-front", "elevation-side", "section", "detail-wall"];

export function getDrawings(slug: string): { kind: DrawingKind; src: string | null }[] {
  return KINDS.map((kind) => {
    const rel = `/drawings/${slug}/${kind}-${slug}.svg`;
    return { kind, src: fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null };
  });
}
