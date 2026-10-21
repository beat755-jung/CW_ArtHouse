/**
 * components/process/EvidenceLink.tsx — 근거 사진 ID 버튼 (클라이언트 컴포넌트)
 *
 * - 누르면 "cw:open-photo" 이벤트를 보내고, 그 사진을 가진 StepMedia 가 라이트박스를 연다
 *   (다른 단계의 사진이어도 동작)
 */
"use client";

export const OPEN_PHOTO_EVENT = "cw:open-photo";

export default function EvidenceLink({ id, label }: { id: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent<string>(OPEN_PHOTO_EVENT, { detail: id }))}
      aria-label={label}
      className="font-mono text-[11px] text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)] transition-colors"
    >
      {id.toUpperCase()}
    </button>
  );
}
