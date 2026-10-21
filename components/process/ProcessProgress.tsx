/**
 * components/process/ProcessProgress.tsx — 공정 진행 표시줄 (클라이언트 컴포넌트)
 *
 * - 데스크톱(lg+): 왼쪽 세로 sticky 목록 + 진행선. 현재 단계에 앰버 점
 * - 모바일: 상단 바(64px) 아래 sticky 가로 칩. 현재 단계 칩을 가운데로 스크롤
 * - 현재 단계 판정: 윗변이 화면 45% 선을 지난 마지막 섹션 (scroll + requestAnimationFrame)
 * - 섹션 id = 공정 코드 (#framing 등) — 홈 공정 요약 카드도 같은 앵커로 연결
 * - prefers-reduced-motion: 칩 자동 스크롤을 즉시 이동으로
 */
"use client";

import { useEffect, useRef, useState } from "react";

interface StepLink {
  code: string;
  number: string;
  name: string;
}

interface Props {
  steps: StepLink[];
  label: string;
}

export default function ProcessProgress({ steps, label }: Props) {
  const [active, setActive] = useState(0);
  const chipsRef = useRef<HTMLOListElement>(null);

  // 현재 단계 = 윗변이 화면 45% 선을 지난 마지막 섹션 (맨 아래까지 내리면 마지막 단계)
  // 스크롤·리사이즈마다 rAF 로 한 번만 계산. 앵커(#roof 등)로 바로 열린 경우도 첫 프레임에서 반영
  useEffect(() => {
    const sections = steps
      .map((s) => document.getElementById(s.code))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let idx = 0;
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i;
      });
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? sections.length - 1 : idx);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [steps]);

  // 모바일 칩: 현재 단계를 가운데로 (페이지 세로 스크롤은 건드리지 않음)
  useEffect(() => {
    const list = chipsRef.current;
    const chip = list?.children[active] as HTMLElement | undefined;
    if (!list || !chip || list.offsetParent === null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active]);

  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <>
      {/* ── Mobile: sticky chips ─────────────────────────── */}
      <nav
        aria-label={label}
        className="lg:hidden sticky top-16 z-30 -mx-8 px-8 md:-mx-16 md:px-16 py-3 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)]"
      >
        <ol ref={chipsRef} className="list-none m-0 p-0 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.code} className="shrink-0">
                <a
                  href={`#${s.code}`}
                  aria-current={on ? "step" : undefined}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap motion-safe:transition-colors",
                    on
                      ? "border-[var(--accent)] text-[var(--text)]"
                      : "border-[var(--border)] text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  <span className={["lining-nums tabular-nums", on ? "text-[var(--accent)]" : ""].join(" ")}>{s.number}</span>
                  {s.name}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── Desktop: sticky rail ─────────────────────────── */}
      <nav aria-label={label} className="hidden lg:block sticky top-24 self-start">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-5">{label}</p>
        <div className="relative">
          <div aria-hidden className="absolute left-[5px] top-3 bottom-3 w-px bg-[var(--text-muted)]/30">
            <div
              className="w-px bg-[var(--accent)] motion-safe:transition-[height] motion-safe:duration-500"
              style={{ height: `${progress}%` }}
            />
          </div>
          <ol className="list-none m-0 p-0">
            {steps.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <li key={s.code}>
                  <a
                    href={`#${s.code}`}
                    aria-current={on ? "step" : undefined}
                    className={[
                      "relative flex items-baseline gap-2.5 py-1.5 pl-6 text-sm motion-safe:transition-colors [word-break:keep-all]",
                      on ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "absolute left-0 top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full border motion-safe:transition-colors",
                        on
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : done
                            ? "bg-[var(--bg)] border-[var(--accent)]"
                            : "bg-[var(--bg)] border-[var(--text-muted)]/50",
                      ].join(" ")}
                    />
                    <span className={["font-display text-xs lining-nums tabular-nums", on ? "text-[var(--accent)]" : ""].join(" ")}>{s.number}</span>
                    <span>{s.name}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
