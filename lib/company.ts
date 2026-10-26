/**
 * lib/company.ts — 회사 차원의 정보 (단일 데이터 출처)
 *
 * [역할]
 * - 프로젝트별 사양(lib/projects.ts)과 별개로, 회사·제품 공통의 정보를 둔다.
 * - 홈 핵심 정보 바(components/home/KeyFacts.tsx), 회사 소개(/about), 상담(/contact)에서 사용
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 수치·사양·사실 정보(상호·사업자번호·주소·연락처·A/S 기간 등)는 절대 임의로 채우지 않는다. 모르면 null.
 * - null 은 화면에 "[확인 필요]" / "[To be confirmed]" 로 표시된다 (t() / formatArea()).
 * - 인허가·신고 관련 확정 표현("신고 없이 설치 가능" 등)은 쓰지 않는다.
 */
import type { I18nText } from "@/lib/projects";

// ── 핵심 정보 (홈) ────────────────────────────────────────────────

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

// ── 회사 정보 (/about) ────────────────────────────────────────────

export interface CompanyInfo {
  /** 상호 (사업자등록상) */
  legalName: I18nText | null;
  /** 대표자 (사업자등록상) — 확인 후 입력 */
  representative: I18nText | null;
  /** 사업자등록번호 */
  businessNumber: string | null;
  /** 건설업 등록 여부 */
  constructionLicense: I18nText | null;
  /** 주소 */
  address: I18nText | null;
}

export const companyInfo: CompanyInfo = {
  legalName: null,
  representative: null,
  businessNumber: null,
  constructionLicense: null,
  address: null,
};

// ── 연락처 (/contact) ─────────────────────────────────────────────

export interface ContactChannels {
  phone: string | null;
  email: string | null;
  /** 카카오톡 채널 URL (예: https://pf.kakao.com/…) */
  kakaoChannel: string | null;
}

export const contactChannels: ContactChannels = {
  phone: null,
  email: null,
  kakaoChannel: null,
};

/**
 * 문의 폼 전송 설정 — 환경변수로만 켠다 (둘 다 없으면 "온라인 접수 준비 중")
 * - NEXT_PUBLIC_FORM_ENDPOINT : 폼 전송 서비스 엔드포인트 (우선). 사용 시 개인정보 국외 이전 고지 문구 추가 필요
 * - NEXT_PUBLIC_CONTACT_EMAIL : mailto 수신 주소
 */
export type FormDelivery = { mode: "endpoint"; url: string } | { mode: "mailto"; email: string } | { mode: "none" };

export function getFormDelivery(): FormDelivery {
  const url = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  if (url) return { mode: "endpoint", url };
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? contactChannels.email ?? undefined;
  if (email) return { mode: "mailto", email };
  return { mode: "none" };
}

// ── 진행 절차 (/about) ────────────────────────────────────────────

export interface ProcedureStep {
  code: string;
  name: I18nText;
  /** 한 줄 설명 — 기간·비용·보증 기간 같은 수치는 쓰지 않는다 */
  description: I18nText;
  /** 단계별 주의 문구 (선택) */
  note?: I18nText;
}

export const procedureSteps: ProcedureStep[] = [
  {
    code: "consult",
    name: { ko: "상담", en: "Consultation" },
    description: { ko: "용도와 설치 예정 지역, 원하는 규모를 듣습니다.", en: "We hear about the intended use, the site location and the size you have in mind." },
  },
  {
    code: "site",
    name: { ko: "현장 확인", en: "Site check" },
    description: { ko: "설치할 자리의 진입로와 바닥 상태를 확인합니다.", en: "We check access to the site and the ground where the house will sit." },
  },
  {
    code: "design",
    name: { ko: "설계", en: "Design" },
    description: { ko: "평면과 창호 위치, 마감을 정해 도면으로 정리합니다.", en: "Layout, window positions and finishes are settled and drawn up." },
  },
  {
    code: "contract",
    name: { ko: "계약", en: "Contract" },
    description: { ko: "확정한 설계와 사양, 일정을 계약서에 담습니다.", en: "The agreed design, specification and schedule go into the contract." },
  },
  {
    code: "build",
    name: { ko: "제작", en: "Build" },
    description: { ko: "작업장에서 골조부터 내장까지 공정 순서대로 만듭니다.", en: "The house is built in the workshop, step by step from frame to interior." },
  },
  {
    code: "delivery",
    name: { ko: "운송·설치", en: "Transport & installation" },
    description: { ko: "완성한 집을 현장으로 옮겨 자리를 잡습니다. 운송 방식은 [확인 필요]입니다.", en: "The finished house is moved to the site and set in place. Transport method is [To be confirmed]." },
    note: {
      ko: "설치 지역과 용도에 따라 필요한 인허가·신고 절차가 다를 수 있습니다. 관할 지자체 확인이 필요합니다.",
      en: "Permit and notification requirements can differ by location and use. Please check with the local authority.",
    },
  },
  {
    code: "handover",
    name: { ko: "인도·A/S", en: "Handover & aftercare" },
    description: { ko: "사용 방법을 안내하고 인도합니다. A/S 범위와 기간은 [확인 필요]입니다.", en: "We walk you through the house and hand it over. Aftercare scope and period are [To be confirmed]." },
  },
];
