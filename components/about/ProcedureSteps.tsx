/**
 * components/about/ProcedureSteps.tsx — 진행 절차 (서버 컴포넌트)
 *
 * - 상담 → 현장 확인 → 설계 → 계약 → 제작 → 운송·설치 → 인도·A/S (lib/company.ts procedureSteps)
 * - xl: 가로 7열 / 그 이하: 세로 목록 (번호 + 연결선)
 * - 기간·비용·보증 기간 같은 수치는 넣지 않는다. 인허가는 확정 표현 없이 note 로 안내만
 */
import type { ProcedureStep } from "@/lib/company";
import type { Locale } from "@/lib/i18n/config";

export default function ProcedureSteps({ steps, locale }: { steps: ProcedureStep[]; locale: Locale }) {
  return (
    <ol className="list-none m-0 p-0 grid gap-0 xl:grid-cols-7 xl:gap-4">
      {steps.map((s, i) => (
        <li key={s.code} className="relative flex xl:block gap-5 pb-8 xl:pb-0">
          {/* 번호 + 연결선 */}
          <div className="flex xl:flex-row flex-col items-center xl:items-center gap-0 xl:gap-3 xl:mb-4 shrink-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--accent)]/70 font-display text-sm lining-nums text-[var(--accent)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="flex-1 w-px min-h-6 mt-2 bg-[var(--text-muted)]/30 xl:w-auto xl:h-px xl:min-h-0 xl:mt-0" />
            )}
          </div>
          <div className="min-w-0 pt-1.5 xl:pt-0">
            <h3 className="font-korean text-lg text-[var(--text)] [word-break:keep-all]">{s.name[locale]}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)] [word-break:keep-all]">{s.description[locale]}</p>
            {s.note && (
              <p className="mt-2 text-xs leading-relaxed text-[var(--text)]/70 border-l border-[var(--accent)]/50 pl-2.5 [word-break:keep-all]">
                {s.note[locale]}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
