/**
 * components/projects/FloorPlan.tsx — 평면도 영역 (서버 컴포넌트)
 *
 * - Project.floorPlan 경로가 있으면 표시 (.svg 개념 평면도 권장 — 밝은 배경 도면은 surface 판 위에 표시)
 * - 없으면 점선 자리 "평면도 준비 중 — 개념 평면도(SVG)가 들어갈 자리"
 * - 평면도 치수·면적은 이미지에 있는 그대로만 보여주고 데이터로 옮겨 적지 않는다 (CLAUDE.md)
 */
import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  labels: { floorPlanPending: string; floorPlanPendingDetail: string };
}

export default function FloorPlan({ src, alt, labels }: Props) {
  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 aspect-[16/7] border border-dashed border-[var(--text-muted)]/40 bg-[var(--bg-surface)] text-center px-6">
        <span className="text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">{labels.floorPlanPending}</span>
        <span className="text-sm text-[var(--text)]/70 [word-break:keep-all]">{labels.floorPlanPendingDetail}</span>
      </div>
    );
  }
  return (
    <div className="bg-[var(--bg-surface)] p-4 md:p-8">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="(max-width: 1024px) 100vw, 70vw"
        className="block w-full h-auto select-none"
        draggable={false}
        unoptimized={src.endsWith(".svg")}
      />
    </div>
  );
}
