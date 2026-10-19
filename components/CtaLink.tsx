/**
 * components/CtaLink.tsx — CTA 버튼형 링크 (서버 컴포넌트)
 *
 * - primary  : 앰버 바탕 + 어두운 글자 (대비 7.24:1, WCAG AA)
 * - secondary: 테두리 + 밝은 글자
 * - 높이 48px (터치 영역), 모바일은 부모가 w-full 지정
 */
import Link from "next/link";

interface Props {
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center h-12 px-8 text-sm tracking-[0.08em] transition-colors duration-300 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

const variants = {
  primary: "bg-[var(--accent)] text-[var(--bg)] hover:bg-[#cba97e]",
  secondary:
    "border border-[var(--text)]/40 text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
};

export default function CtaLink({ href, variant = "primary", className = "", children }: Props) {
  return (
    <Link href={href} className={[base, variants[variant], className].join(" ")}>
      {children}
    </Link>
  );
}
