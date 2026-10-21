/**
 * components/process/PhotoPlaceholder.tsx — "사진 준비 중" 자리 (서버·클라이언트 공용)
 *
 * - 사진이 없는 공정·컷을 숨기지 않고 자리를 남겨, 사진이 생기면 같은 위치에 채운다
 * - 데이터: lib/projects.ts processSteps[].pendingShots
 */
interface Props {
  title: string;
  detail?: string;
  size?: "tile" | "lead";
}

export default function PhotoPlaceholder({ title, detail, size = "tile" }: Props) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center aspect-[4/3] border border-dashed",
        "border-[var(--text-muted)]/40 bg-[var(--bg-surface)] text-[var(--text-muted)]",
        size === "lead" ? "gap-2 px-8" : "gap-1 px-3",
      ].join(" ")}
    >
      <span className={size === "lead" ? "text-xs tracking-[0.25em] uppercase" : "text-[10px] tracking-[0.2em] uppercase"}>
        {title}
      </span>
      {detail && (
        <span className={["[word-break:keep-all] text-[var(--text)]/70", size === "lead" ? "text-sm" : "text-[11px] leading-snug"].join(" ")}>
          {detail}
        </span>
      )}
    </div>
  );
}
