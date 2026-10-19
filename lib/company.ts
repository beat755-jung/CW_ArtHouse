/**
 * lib/company.ts — 회사 차원의 정보 (단일 데이터 출처)
 *
 * [역할]
 * - 프로젝트별 사양(lib/projects.ts)과 별개로, 회사·제품 공통의 핵심 정보를 둔다.
 * - 홈 "핵심 정보 바"(components/home/KeyFacts.tsx)에서 사용
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 구조·면적·공기·보증 등 수치·사양은 절대 임의로 채우지 않는다. 모르면 null.
 * - null 은 화면에 "[확인 필요]" / "[To be confirmed]" 로 표시된다 (t() / formatArea()).
 */
import type { I18nText } from "@/lib/projects";

export interface CompanyKeyFacts {
  /** 구조 방식 */
  structure: I18nText | null;
  /** 기본 면적 (m²) */
  baseAreaM2: number | null;
  /** 공사 기간 */
  constructionPeriod: I18nText | null;
  /** 보증 */
  warranty: I18nText | null;
}

export const keyFacts: CompanyKeyFacts = {
  structure: null,
  baseAreaM2: null,
  constructionPeriod: null,
  warranty: null,
};
