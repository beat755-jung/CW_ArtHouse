/**
 * components/PageHeader.tsx — 하위 페이지 공통 머리말 (서버 컴포넌트)
 *
 * - eyebrow: 작은 영문 라벨 (Process, Projects …)
 * - title  : 페이지 제목 (사전 문구)
 */
interface Props {
  eyebrow: string;
  title: string;
}

export default function PageHeader({ eyebrow, title }: Props) {
  return (
    <header className="mb-16">
      <p className="text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-3">
        {eyebrow}
      </p>
      <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-wide text-[var(--text)]">
        {title}
      </h1>
    </header>
  );
}
