/**
 * lib/projects.ts — 프로젝트·제작 공정 데이터 레이어 (단일 데이터 출처)
 *
 * [역할]
 * - 사이트 전체에서 쓰는 프로젝트(Project)·공정(ProcessStep) 데이터와 표시 헬퍼
 * - 이 파일만 수정하면 홈·소개 등 모든 페이지에 반영됩니다.
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 면적·단열·가격·공기 등 사양 값은 절대 임의로 채우지 않는다. 모르면 null.
 * - null 값은 t() / formatArea() 를 거쳐 화면에 "[확인 필요]" / "[To be confirmed]" 로 표시된다.
 * - 이미지는 kind 로 실사(photo)와 렌더(render)를 구분한다.
 *
 * [이미지 경로 규칙 — 폴더는 "사이트에서의 용도" 기준]
 * - public/projects/{slug}/exterior | process | interior / {인벤토리 ID}.jpg
 *   - exterior: 완성(준공) 외관 사진 + 외관 콘셉트 렌더
 *   - process : 제작 과정 실사 전부 (외부·내부 시점은 view 로 구분)
 *   - interior: 완성(준공) 실내 사진 + 실내 분위기 렌더
 * - 파일명은 인벤토리 ID(ing-05, out-08, in-07 …)로 시작한다 (docs/image-inventory.md 와 같음).
 *   설명을 덧붙여도 된다: out-03-leftside-view.jpg
 * - 게시 불가 이미지는 public 밖의 _archive/ 에 둔다.
 *
 * [프로젝트 추가 방법]
 * 1. public/projects/{새-slug}/ 아래에 exterior, process, interior 폴더를 만들고 이미지 복사
 * 2. projects 배열에 Project 객체 추가 (모르는 값은 null, cover 로 대표 이미지 지정)
 * 3. featured: true 설정 시 홈 Featured 섹션에 표시
 */

// ── 공통 타입 · 표시 헬퍼 ──────────────────────────────────────────

import type { Locale } from "@/lib/i18n/config";

export type { Locale };

export interface I18nText {
  ko: string;
  en: string;
}

/** 값이 확인되지 않았을 때 화면에 표시하는 문구 */
export const UNCONFIRMED: I18nText = { ko: "[확인 필요]", en: "[To be confirmed]" };

/** 렌더 이미지 표기 */
export const RENDER_LABEL: I18nText = { ko: "렌더", en: "Render" };

/** I18nText | null → 해당 언어 문자열 (null 이면 UNCONFIRMED) */
export function t(value: I18nText | null, locale: Locale = "ko"): string {
  return (value ?? UNCONFIRMED)[locale];
}

/** 연면적(m²) 표시 (null 이면 UNCONFIRMED) */
export function formatArea(m2: number | null, locale: Locale = "ko"): string {
  if (m2 === null) return UNCONFIRMED[locale];
  return `${m2.toLocaleString(locale)} m²`;
}

// ── 프로젝트 타입 ─────────────────────────────────────────────────

export type ProjectType = "residential" | "second-house" | "stay" | "office" | "other";

export const PROJECT_TYPE_LABEL: Record<ProjectType, I18nText> = {
  residential: { ko: "주거형", en: "Residential" },
  "second-house": { ko: "세컨하우스", en: "Second House" },
  stay: { ko: "스테이", en: "Stay" },
  office: { ko: "오피스", en: "Office" },
  other: { ko: "기타", en: "Other" },
};

export type ProcessStepCode =
  | "foundation"
  | "framing"
  | "roof"
  | "insulation-waterproofing"
  | "windows"
  | "exterior"
  | "mep"
  | "interior"
  | "completion";

/** 촬영 시점 — 건물 바깥에서 찍었는지(exterior), 안에서 찍었는지(interior) */
export type ImageView = "exterior" | "interior";

export interface ProjectImage {
  src: string;
  alt: I18nText;
  /** photo: 실사 / render: 렌더·분위기 예시 — 렌더를 실물처럼 소개하지 않는다 */
  kind: "photo" | "render";
  /** 공정 이미지일 때 해당 단계 */
  step?: ProcessStepCode;
  /** 촬영 시점 (process 실사는 필수) — "제작 중 외관만" 같은 선별에 사용 */
  view?: ImageView;
  /** 사진 기록일 YYYY-MM-DD (원본 EXIF 기준). 공사 기간이 아니라 "촬영한 날"이다 */
  date?: string;
}

export interface ProjectSpecs {
  /** 연면적 (m²) */
  grossFloorAreaM2: number | null;
  /** 구조 방식 */
  structure: I18nText | null;
  /** 기초 방식 */
  foundation: I18nText | null;
  /** 외장재 */
  exteriorCladding: I18nText | null;
  /** 단열 사양 */
  insulation: I18nText | null;
  /** 창호 사양 */
  windows: I18nText | null;
  /** 공사 기간 */
  constructionPeriod: I18nText | null;
}

export interface Project {
  slug: string;
  name: I18nText | null;
  type: ProjectType | null;
  location: I18nText | null;
  specs: ProjectSpecs;
  /** 대표 이미지 (카드·목록 썸네일). null 이면 getCoverImage() 의 대체 규칙 사용 */
  cover: ProjectImage | null;
  images: {
    exterior: ProjectImage[];
    process: ProjectImage[];
    interior: ProjectImage[];
  };
  /** 평면도 경로 */
  floorPlan: string | null;
  featured: boolean;
}

/**
 * 근거 상태 (CLAUDE.md 콘텐츠 규칙)
 * - observed   : 해당 작업·자재가 사진에 기록됨 → evidence 에 근거 사진 ID 필수
 * - unconfirmed: 회사 확인 전 → 화면에 "[확인 필요]" 표시. 확인되면 observed/confirmed 로 바꾼다
 */
export type EvidenceStatus = "observed" | "unconfirmed";

export interface EvidenceItem {
  text: I18nText;
  status: EvidenceStatus;
  /** 근거 사진 ID (예: "ing-11") — 공개 이미지만. 없는 ID 는 빌드 오류 */
  evidence?: string[];
}

export interface ProcessComparison {
  items: { image: ProjectImage; label: I18nText }[];
  note: I18nText;
}

export interface ProcessStep {
  code: ProcessStepCode;
  order: number;
  name: I18nText;
  /** 홈 공정 요약 카드용 한 줄 (null 이면 홈에서 제외) */
  summary: I18nText | null;
  /** /process 설명 — 일반 고객이 이해할 수준 */
  description: I18nText | null;
  /** 홈 공정 요약 대표 사진 (null 이면 홈에서 제외). /process 는 null 이면 그 단계 첫 사진 사용 */
  image: ProjectImage | null;
  /** 사진에서 확인된 자재 — 등급·두께·성능은 쓰지 않는다 */
  materials: EvidenceItem[];
  /** 품질관리 포인트 */
  qcPoints: EvidenceItem[];
  /** 아직 없는 사진 — /process 에 "사진 준비 중" 자리로 표시. 사진을 추가하면 지운다 */
  pendingShots: I18nText[];
  /** 같은 대상의 상태 비교 (선택) */
  comparison?: ProcessComparison;
}

// ── 이미지 헬퍼 ───────────────────────────────────────────────────

/** 이미지 경로 → 인벤토리 ID ("/…/process/ing-05.jpg" → "ing-05", "out-03-leftside-view.jpg" → "out-03") */
export function imageId(src: string): string {
  const file = src.split("/").pop() ?? "";
  return file.match(/^(ing|out|in)-\d{2}/)?.[0] ?? file.replace(/\.jpg$/, "");
}

const ingRange = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `ing-${String(from + i).padStart(2, "0")}`);

// 사진 기록일 — 원본 EXIF (docs/image-inventory.md 7절). public/ 사본에는 메타데이터가 없어 여기서 관리
const SHOT_DATES: Record<string, string> = Object.fromEntries(
  (
    [
      ["2026-07-24", ingRange(19, 19)],
      ["2026-08-11", ingRange(20, 23)],
      ["2026-08-25", ingRange(24, 29)],
      ["2026-09-07", ingRange(30, 32)],
      ["2026-09-08", ingRange(33, 34)],
      ["2026-09-12", ingRange(35, 53)],
      ["2026-10-02", [...ingRange(9, 18), ...ingRange(54, 81)]],
      ["2026-10-06", [...ingRange(1, 8), ...ingRange(82, 84)]],
    ] as [string, string[]][]
  ).flatMap(([date, ids]) => ids.map((id) => [id, date])),
);

// 세로 사진 — 2026-09-12 촬영분(ing-35~53, 1440×1920)
const PORTRAIT_IDS = new Set(ingRange(35, 53));

/** 세로(portrait) 사진인지 — 주석 사진 폭 제한 등에 사용 */
export function isPortrait(src: string): boolean {
  return PORTRAIT_IDS.has(imageId(src));
}

const photo = (src: string, ko: string, en: string, step?: ProcessStepCode, view?: ImageView): ProjectImage => ({
  src,
  alt: { ko, en },
  kind: "photo",
  step,
  view,
  date: SHOT_DATES[imageId(src)],
});

/** 제작 과정 실사 — 건물 바깥에서 촬영 */
const outside = (src: string, ko: string, en: string, step?: ProcessStepCode) => photo(src, ko, en, step, "exterior");

/** 제작 과정 실사 — 건물 안에서 촬영 */
const inside = (src: string, ko: string, en: string, step?: ProcessStepCode) => photo(src, ko, en, step, "interior");

const render = (src: string, ko: string, en: string): ProjectImage => ({
  src,
  alt: { ko, en },
  kind: "render",
});

// ── prototype-01 이미지 (docs/image-inventory.md 기준) ─────────────

const P1 = "/projects/prototype-01";

// 완성 외관 사진은 준공 후 추가. 현재는 콘셉트 렌더만
// 2026-10-20 사용자가 렌더 시트에서 뷰별로 다시 잘라 교체 (가로 390~883px — 큰 확대 표시는 피할 것)
const p1Exterior: ProjectImage[] = [
  render(`${P1}/exterior/out-01-top-roof-view.jpg`, "콘셉트 렌더 — 지붕 평면도", "Concept render — top (roof) view"),
  render(`${P1}/exterior/out-02-front-view.jpg`, "콘셉트 렌더 — 정면도", "Concept render — front view"),
  render(`${P1}/exterior/out-03-leftside-view.jpg`, "콘셉트 렌더 — 좌측면도 (슬라이드아웃)", "Concept render — left side view (slide-out)"),
  render(`${P1}/exterior/out-04-back-view.jpg`, "콘셉트 렌더 — 후면도", "Concept render — back view"),
  render(`${P1}/exterior/out-05-perspective-view.jpg`, "콘셉트 렌더 — 투시도", "Concept render — perspective view"),
  render(`${P1}/exterior/out-08-render-view.jpg`, "콘셉트 렌더 — 야간 투시도", "Concept render — night perspective"),
];

// 제작 과정 실사 — 촬영일 순 (EXIF 원본 기준, docs/image-inventory.md 7절)
// ing-19(2026-07-24, 섀시 조립 — 작업자 노출)는 동의 확인 전까지 _archive/ 보관, 목록 제외
const p1Process: ProjectImage[] = [
  // 2026-08-11 — 강재 골조
  outside(`${P1}/process/ing-20.jpg`, "강재 골조 — 섀시 위에 선 벽·지붕 골조", "Steel frame — wall and roof framing on the chassis", "framing"),
  outside(`${P1}/process/ing-21.jpg`, "강재 골조 — 견인부 쪽에서 본 모습", "Steel frame — seen from the towing end", "framing"),
  outside(`${P1}/process/ing-22.jpg`, "강재 골조 — 측면 사선", "Steel frame — oblique side view", "framing"),
  outside(`${P1}/process/ing-23.jpg`, "강재 골조 — 측면 입면", "Steel frame — side elevation", "framing"),
  // 2026-08-25 — 지붕 패널
  outside(`${P1}/process/ing-24.jpg`, "지붕 패널 설치와 샌드위치 패널 자재", "Roof panels installed, sandwich panels stacked nearby", "roof"),
  outside(`${P1}/process/ing-25.jpg`, "지붕 패널이 얹힌 골조와 패널 자재", "Frame with roof panels and stacked panels", "roof"),
  outside(`${P1}/process/ing-26.jpg`, "지붕 패널이 얹힌 골조 — 측면", "Frame with roof panels — side view", "roof"),
  outside(`${P1}/process/ing-27.jpg`, "지붕 패널이 얹힌 골조 — 사선", "Frame with roof panels — oblique view", "roof"),
  outside(`${P1}/process/ing-28.jpg`, "지붕 패널이 얹힌 골조 — 돌출부 쪽", "Frame with roof panels — bump-out side", "roof"),
  outside(`${P1}/process/ing-29.jpg`, "지붕 패널이 얹힌 골조 — 측면 입면", "Frame with roof panels — side elevation", "roof"),
  // 2026-09-07~08 — 벽 패널·창호 설치
  outside(`${P1}/process/ing-30.jpg`, "벽 패널과 창호 설치 — 출입문과 창", "Wall panels and windows fitted — entrance door and windows", "windows"),
  outside(`${P1}/process/ing-31.jpg`, "출입문과 창, 설치 전 창호 부품", "Entrance door and windows, window units waiting to be fitted", "windows"),
  outside(`${P1}/process/ing-32.jpg`, "벽 패널과 창호 설치 — 견인부 쪽 끝과 A측 돌출부", "Wall panels and windows — towing end and side A bump-out", "exterior"),
  outside(`${P1}/process/ing-33.jpg`, "작업장 마당의 전경", "Wide view in the workshop yard", "exterior"),
  outside(`${P1}/process/ing-34.jpg`, "작업장 마당 전경 — 산을 배경으로", "Wide view of the yard with hills behind", "exterior"),
  // 2026-09-12 — 세로 사진 (실내)
  inside(`${P1}/process/ing-35.jpg`, "A측 돌출부 실내 — 미서기창과 바닥 프레임", "Side A bump-out interior — sliding window and floor frame", "windows"),
  inside(`${P1}/process/ing-36.jpg`, "A측 돌출부 실내 — 미서기창과 바닥 자재", "Side A bump-out interior — sliding window and floor materials", "windows"),
  inside(`${P1}/process/ing-37.jpg`, "실내 강재 스터드와 전선관 — 다락 쪽", "Interior steel studs and conduit — toward the loft end", "mep"),
  inside(`${P1}/process/ing-38.jpg`, "다락 쪽 실내 골조와 전선관", "Loft-end interior framing and conduit", "mep"),
  inside(`${P1}/process/ing-39.jpg`, "실내 골조와 열린 바닥 프레임", "Interior framing and open floor frame", "framing"),
  inside(`${P1}/process/ing-40.jpg`, "B측 돌출부 실내 — 창과 바닥 프레임", "Side B bump-out interior — windows and floor frame", "framing"),
  inside(`${P1}/process/ing-41.jpg`, "B측 돌출부 실내 — 창 세 개", "Side B bump-out interior — three windows", "framing"),
  inside(`${P1}/process/ing-42.jpg`, "B측 돌출부 실내 — 창과 벽 스터드", "Side B bump-out interior — windows and wall studs", "framing"),
  inside(`${P1}/process/ing-43.jpg`, "실내 창호와 벽 스터드", "Interior window and wall studs", "framing"),
  inside(`${P1}/process/ing-44.jpg`, "패널 이음부 실링과 창 둘레 — 근접", "Close-up of a panel joint seal and window surround", "insulation-waterproofing"),
  inside(`${P1}/process/ing-45.jpg`, "다락 쪽 강재 골조와 창", "Loft-end steel framing and window", "framing"),
  inside(`${P1}/process/ing-46.jpg`, "바닥 프레임 위에 놓인 판재", "Boards laid on the floor frame", "framing"),
  // 2026-09-12 — 세로 사진 (외부)
  outside(`${P1}/process/ing-47.jpg`, "외관 — 끝벽과 측면의 창", "Exterior — windows on the end wall and side", "exterior"),
  outside(`${P1}/process/ing-48.jpg`, "외관 — 돌출부 모서리와 창", "Exterior — bump-out corner and window", "exterior"),
  outside(`${P1}/process/ing-49.jpg`, "외관 — A측 미서기창", "Exterior — side A sliding window", "windows"),
  outside(`${P1}/process/ing-50.jpg`, "외관 — 견인부 쪽 끝과 A측 돌출부", "Exterior — towing end and side A bump-out", "exterior"),
  outside(`${P1}/process/ing-51.jpg`, "외관 — 견인부 쪽 끝과 A측 돌출부 (다른 구도)", "Exterior — towing end and side A bump-out (another angle)", "exterior"),
  outside(`${P1}/process/ing-52.jpg`, "외관 — 공장 건물을 배경으로", "Exterior — with the factory building behind", "exterior"),
  outside(`${P1}/process/ing-53.jpg`, "외관 — 공장 건물을 배경으로 (다른 구도)", "Exterior — with the factory building behind (another angle)", "exterior"),
  // 2026-10-02 — 실내
  inside(`${P1}/process/ing-09.jpg`, "실내 — 다락, 사다리, 칸막이", "Interior — loft, ladder and partition", "interior"),
  inside(`${P1}/process/ing-10.jpg`, "B측 돌출부 — 바닥 프레임과 벽 스터드", "Side B bump-out — floor frame and wall studs", "framing"),
  inside(`${P1}/process/ing-11.jpg`, "A측 돌출부 — 미서기창과 창 주변 폼 충진", "Side A bump-out — sliding window with foam-filled surround", "insulation-waterproofing"),
  inside(`${P1}/process/ing-12.jpg`, "A측 돌출부와 다락 쪽 실내", "Side A bump-out and loft end", "interior"),
  inside(`${P1}/process/ing-13.jpg`, "중앙 통로 — 양측 돌출부 바닥", "Central aisle — floors of both bump-outs", "framing"),
  inside(`${P1}/process/ing-14.jpg`, "반대쪽 끝에서 본 다락 쪽 실내", "Looking toward the loft end", "interior"),
  inside(`${P1}/process/ing-15.jpg`, "B측 돌출부 — 바닥 프레임과 자재", "Side B bump-out — floor frame and materials", "framing"),
  inside(`${P1}/process/ing-16.jpg`, "A측 돌출부 — 창 주변 폼 충진과 롤 단열재", "Side A bump-out — foam-filled window surround and insulation roll", "insulation-waterproofing"),
  inside(`${P1}/process/ing-17.jpg`, "천장 전선관 다발", "Bundled electrical conduit at the ceiling", "mep"),
  inside(`${P1}/process/ing-18.jpg`, "다락, 사다리, 목재 스터드와 칸막이 판재", "Loft, ladder, timber studs and partition boards", "interior"),
  inside(`${P1}/process/ing-54.jpg`, "B측 돌출부 실내 — 창 세 개와 바닥 프레임", "Side B bump-out interior — three windows and floor frame", "framing"),
  inside(`${P1}/process/ing-55.jpg`, "A측 돌출부 실내 — 미서기창과 롤 단열재", "Side A bump-out interior — sliding window and insulation roll", "insulation-waterproofing"),
  inside(`${P1}/process/ing-77.jpg`, "실내 — 칸막이 보드와 작은 방 출입부", "Interior — partition boards and a small room doorway", "interior"),
  inside(`${P1}/process/ing-78.jpg`, "실내 — KNAUF 보드 칸막이와 다락 틀", "Interior — KNAUF board partition and loft frame", "interior"),
  inside(`${P1}/process/ing-79.jpg`, "다락 쪽 — 다락 틀과 칸막이", "Loft end — loft frame and partition", "interior"),
  inside(`${P1}/process/ing-80.jpg`, "다락 플랫폼과 상부 창", "Loft platform and upper windows", "interior"),
  inside(`${P1}/process/ing-81.jpg`, "다락 아래 공간과 사다리", "Space under the loft with a stepladder", "interior"),
  // 2026-10-02 — 외부 (돌출부 펼친 상태)
  outside(`${P1}/process/ing-56.jpg`, "외관 — 끝벽 상부 창 두 개", "Exterior — two upper windows on the end wall", "exterior"),
  outside(`${P1}/process/ing-57.jpg`, "외관 — 끝벽과 돌출부", "Exterior — end wall and bump-out", "exterior"),
  outside(`${P1}/process/ing-58.jpg`, "외관 — 끝벽 모서리와 출입문 쪽", "Exterior — end-wall corner and entrance side", "exterior"),
  outside(`${P1}/process/ing-59.jpg`, "외관 — 양개 출입문과 프로젝트창", "Exterior — double entrance door and awning windows", "windows"),
  outside(`${P1}/process/ing-60.jpg`, "외관 — 출입문과 돌출부", "Exterior — entrance door and bump-out", "exterior"),
  outside(`${P1}/process/ing-61.jpg`, "외관 — 출입문 쪽 정면", "Exterior — entrance door, frontal", "exterior"),
  outside(`${P1}/process/ing-62.jpg`, "외관 — A측 미서기창과 출입문", "Exterior — side A sliding window and entrance door", "exterior"),
  outside(`${P1}/process/ing-63.jpg`, "외관 — A측 돌출부 입면 (펼친 상태)", "Exterior — side A bump-out elevation (extended)", "exterior"),
  outside(`${P1}/process/ing-64.jpg`, "외관 — A측 사선, 돌출부 펼친 상태", "Exterior — side A oblique, bump-out extended", "exterior"),
  outside(`${P1}/process/ing-65.jpg`, "외관 — 견인부 쪽 끝과 A측, 돌출부 펼친 상태", "Exterior — towing end and side A, bump-out extended", "exterior"),
  outside(`${P1}/process/ing-66.jpg`, "외관 — 견인부 쪽 끝과 A측", "Exterior — towing end and side A", "exterior"),
  outside(`${P1}/process/ing-67.jpg`, "외관 — 견인부 쪽 끝, 역광", "Exterior — towing end, backlit", "exterior"),
  outside(`${P1}/process/ing-68.jpg`, "외관 — 견인부 쪽 끝 정면", "Exterior — towing end, frontal", "exterior"),
  outside(`${P1}/process/ing-69.jpg`, "외관 — 견인부 쪽 끝과 B측", "Exterior — towing end and side B", "exterior"),
  outside(`${P1}/process/ing-70.jpg`, "외관 — B측 사선과 수납 해치", "Exterior — side B oblique and storage hatch", "exterior"),
  outside(`${P1}/process/ing-71.jpg`, "외관 — B측 돌출부와 견인부 쪽 끝", "Exterior — side B bump-out and towing end", "exterior"),
  outside(`${P1}/process/ing-72.jpg`, "창 둘레 실링과 수납 해치 — 근접", "Close-up of a window seal and storage hatch", "windows"),
  outside(`${P1}/process/ing-73.jpg`, "B측 창 — 근접", "Side B windows — close-up", "windows"),
  outside(`${P1}/process/ing-74.jpg`, "B측 창과 프로젝트창 — 근접", "Side B windows and awning window — close-up", "windows"),
  outside(`${P1}/process/ing-75.jpg`, "외관 — B측 돌출부와 창", "Exterior — side B bump-out and windows", "exterior"),
  outside(`${P1}/process/ing-76.jpg`, "외관 — 모서리와 창, 사다리", "Exterior — corner with windows and a ladder", "exterior"),
  // 2026-10-06 — 외부 (돌출부 접힌 상태)
  outside(`${P1}/process/ing-01.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 B측면", "Exterior under construction — towing end and side B", "exterior"),
  outside(`${P1}/process/ing-02.jpg`, "제작 중인 외관 — A측면 출입문과 창호", "Exterior under construction — side A entrance door and windows", "windows"),
  outside(`${P1}/process/ing-03.jpg`, "하부 섀시 레일과 받침, 장착 전 타이어", "Chassis rail and supports, tyres not yet fitted", "foundation"),
  outside(`${P1}/process/ing-04.jpg`, "제작 중인 외관 — B측면과 열린 수납 해치", "Exterior under construction — side B with open storage hatch", "exterior"),
  outside(`${P1}/process/ing-05.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 B측면", "Exterior under construction — towing end and side B, hills behind", "exterior"),
  outside(`${P1}/process/ing-06.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 A측면", "Exterior under construction — towing end and side A", "exterior"),
  outside(`${P1}/process/ing-07.jpg`, "제작 중인 외관 — A측면 사선", "Exterior under construction — side A, oblique view", "exterior"),
  outside(`${P1}/process/ing-08.jpg`, "제작 중인 외관 — A측면 입면", "Exterior under construction — side A elevation", "exterior"),
  outside(`${P1}/process/ing-82.jpg`, "외관 — 견인부 쪽 끝 정면", "Exterior — towing end, frontal", "exterior"),
  outside(`${P1}/process/ing-83.jpg`, "외관 — 견인부 쪽 끝과 B측, 돌출부 접힌 상태", "Exterior — towing end and side B, bump-out retracted", "exterior"),
  outside(`${P1}/process/ing-84.jpg`, "외관 — 출입문 쪽과 출입문", "Exterior — entrance side and door", "exterior"),
];

// house_in 분위기 샘플 — 실제 제품과 구성이 다르며 추후 교체 예정
const p1Interior: ProjectImage[] = [
  render(`${P1}/interior/in-02.jpg`, "인테리어 분위기 예시 — 아이소메트릭 단면", "Interior mood sample — isometric cutaway"),
  render(`${P1}/interior/in-03.jpg`, "인테리어 분위기 예시 — 욕실", "Interior mood sample — bathroom"),
  render(`${P1}/interior/in-04.jpg`, "인테리어 분위기 예시 — 침실", "Interior mood sample — bedroom"),
  render(`${P1}/interior/in-05.jpg`, "인테리어 분위기 예시 — 현관에서 본 거실", "Interior mood sample — living area from the entrance"),
  render(`${P1}/interior/in-06.jpg`, "인테리어 분위기 예시 — 거실 TV벽", "Interior mood sample — living room media wall"),
  render(`${P1}/interior/in-07.jpg`, "인테리어 분위기 예시 — 거실", "Interior mood sample — living room"),
  render(`${P1}/interior/in-08.jpg`, "인테리어 분위기 예시 — 침실", "Interior mood sample — bedroom"),
  render(`${P1}/interior/in-09.jpg`, "인테리어 분위기 예시 — 주방", "Interior mood sample — kitchen"),
  // in-11~14: 같은 SketchUp 모델의 추가 씬 (창밖 아파트 — 사용 시 크롭 주의)
  render(`${P1}/interior/in-11.jpg`, "인테리어 분위기 예시 — 안방", "Interior mood sample — master bedroom"),
  render(`${P1}/interior/in-12.jpg`, "인테리어 분위기 예시 — 세탁 공간", "Interior mood sample — laundry space"),
  render(`${P1}/interior/in-13.jpg`, "인테리어 분위기 예시 — 발코니 복도", "Interior mood sample — balcony corridor"),
  render(`${P1}/interior/in-14.jpg`, "인테리어 분위기 예시 — 수납 선반", "Interior mood sample — storage shelves"),
];

const findImage = (src: string): ProjectImage | null =>
  [...p1Exterior, ...p1Process, ...p1Interior].find((img) => img.src === src) ?? null;

// ── Projects ──────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "prototype-01",
    name: null,
    type: null,
    location: null,
    specs: {
      grossFloorAreaM2: null,
      structure: null,
      foundation: null,
      exteriorCladding: null,
      insulation: null,
      windows: null,
      constructionPeriod: null,
    },
    // 대표 이미지: 제작 중 외관 실사 (준공 사진이 생기면 교체)
    cover: findImage(`${P1}/process/ing-05.jpg`),
    images: {
      exterior: p1Exterior,
      process: p1Process,
      interior: p1Interior,
    },
    floorPlan: null,
    featured: true,
  },
];

// ── Process steps ─────────────────────────────────────────────────

const allImages = [...p1Exterior, ...p1Process, ...p1Interior];

/** 인벤토리 ID 로 공개 이미지 찾기 — 없으면 빌드 오류 (링크 깨짐 방지) */
function mustImage(id: string): ProjectImage {
  const img = allImages.find((i) => imageId(i.src) === id);
  if (!img) throw new Error(`[projects] 이미지 ID "${id}" 가 데이터에 없습니다`);
  return img;
}

// 근거 항목 작성 헬퍼
const seen = (ko: string, en: string, evidence: string[]): EvidenceItem => ({ text: { ko, en }, status: "observed", evidence });
const tbc = (ko: string, en: string): EvidenceItem => ({ text: { ko, en }, status: "unconfirmed" });
const shot = (ko: string, en: string): I18nText => ({ ko, en });

/**
 * 공정 9단계 — /process 페이지와 홈 공정 요약의 단일 출처
 * - summary    : 홈 카드용 한 줄 (2026-10-19·20 사용자 승인 초안)
 * - description: /process 설명. 사진에 보이는 작업만, 과장 표현 없이 행동으로 서술 (2026-10-21 초안)
 * - materials/qcPoints: seen() = 사진 근거 있음, tbc() = [확인 필요]. 회사가 확인하면 status 를 바꾼다
 * - 구조재 함수율은 목재에만 해당 → 주 골조(강재)가 아닌 내장 단계(목재 스터드)에 둠
 */
export const processSteps: ProcessStep[] = [
  {
    code: "foundation", order: 1, name: { ko: "기초", en: "Foundation" },
    summary: { ko: "강재 섀시와 바닥 프레임을 조립합니다", en: "Assembling the steel chassis and floor frame" },
    description: {
      ko: "집 전체를 받치는 강재 섀시(차대)를 만들고 그 위에 바닥 프레임을 조립합니다. 섀시는 받침(잭)과 바퀴 위에 놓입니다. 현장에 설치할 때의 고정 방식은 [확인 필요]입니다.",
      en: "We build the steel chassis that carries the whole house and assemble the floor frame on top. The chassis sits on support jacks and wheels. How it is fixed on site is [To be confirmed].",
    },
    // 홈 대표 사진은 ing-19(섀시 조립 — 작업자 노출, 동의 확인 전 _archive/). /process 는 이 단계 첫 사진(ing-03) 사용
    image: null,
    materials: [
      seen("강재 섀시 레일", "Steel chassis rails", ["ing-03"]),
      seen("적색 도장 강재 받침", "Red-painted steel supports", ["ing-03", "ing-23"]),
      tbc("도장 종류와 방청 사양", "Paint type and anti-corrosion specification"),
    ],
    qcPoints: [
      tbc("섀시를 받침(잭)으로 세운 뒤 수평계로 수평을 맞춥니다", "Level the chassis on its jacks with a spirit level"),
      tbc("양 대각선 길이를 재서 섀시가 직각인지 확인합니다", "Measure both diagonals to confirm the chassis is square"),
      tbc("용접부를 눈으로 점검한 뒤 방청 도장합니다", "Inspect the welds visually, then apply anti-corrosion paint"),
    ],
    pendingShots: [
      shot("섀시 조립 작업", "Chassis assembly in progress"),
      shot("용접부 근접", "Weld close-up"),
    ],
  },
  {
    code: "framing", order: 2, name: { ko: "골조", en: "Framing" },
    summary: { ko: "바닥 프레임과 벽체 골조를 짭니다", en: "Framing the floor and walls" },
    description: {
      ko: "섀시 위에 강재 각관으로 벽과 지붕의 뼈대를 세웁니다. 창과 문이 들어갈 자리, 측면 돌출부의 뼈대도 이 단계에서 만듭니다.",
      en: "Square steel tubes are raised on the chassis to form the wall and roof frame, including the openings for windows and doors and the frame of the side bump-outs.",
    },
    image: mustImage("ing-23"),
    materials: [
      seen("강재 각관 골조", "Square steel tube frame", ["ing-20", "ing-21", "ing-22", "ing-23"]),
      tbc("강재 규격과 아연도금 여부", "Steel section sizes and galvanising"),
    ],
    qcPoints: [
      tbc("기둥마다 수직을 확인합니다", "Check every post for plumb"),
      tbc("창·문 개구부의 위치와 크기를 도면과 대조합니다", "Compare window and door openings with the drawings"),
      tbc("용접·볼트 체결부를 점검합니다", "Inspect welded and bolted joints"),
    ],
    pendingShots: [shot("골조 접합부 근접", "Frame joint close-up")],
  },
  {
    code: "roof", order: 3, name: { ko: "지붕", en: "Roof" },
    summary: { ko: "골조 위에 지붕 패널을 얹습니다", en: "Placing roof panels on the frame" },
    description: {
      ko: "벽 패널보다 먼저 골조 위에 지붕 패널을 얹습니다. 2026년 8월 25일 기록에서는 지붕이 덮여 있고 벽은 아직 열려 있습니다.",
      en: "Roof panels go on the frame before the wall panels. In the 25 August 2026 record the roof is covered while the walls are still open.",
    },
    image: mustImage("ing-24"),
    materials: [
      seen("노란색 심재의 샌드위치 패널", "Sandwich panels with a yellow core", ["ing-24", "ing-25"]),
      tbc("지붕 패널의 심재 종류와 두께", "Roof panel core type and thickness"),
    ],
    qcPoints: [
      seen("벽 패널보다 지붕 패널을 먼저 설치합니다", "Install the roof panels before the wall panels", ["ing-24", "ing-26"]),
      tbc("지붕 패널 겹침부와 체결부를 실링합니다", "Seal roof panel laps and fixings"),
      tbc("빗물이 고이지 않도록 배수 방향을 확인합니다", "Check the drainage direction so rainwater does not pool"),
    ],
    pendingShots: [shot("지붕 상면과 빗물막이(후레싱)", "Roof surface and flashing")],
  },
  {
    code: "insulation-waterproofing", order: 4, name: { ko: "단열·방수", en: "Insulation & Waterproofing" },
    summary: { ko: "창 둘레 틈을 채우고 단열합니다", en: "Sealing gaps and insulating" },
    description: {
      ko: "벽과 지붕은 심재가 든 샌드위치 패널로 짓습니다. 창 둘레에 남는 틈은 발포재로 채우고, 패널 이음부는 따라가며 실링합니다. 패널 측면에 'PIR PANEL' 표기가 보이며, 단열 성능과 두께는 [확인 필요]입니다.",
      en: "Walls and roof are built from sandwich panels with a core. Gaps around the windows are filled with foam and the panel joints are sealed along their length. A 'PIR PANEL' marking is visible on the panel edge; thermal performance and thickness are [To be confirmed].",
    },
    image: mustImage("ing-16"),
    materials: [
      seen("샌드위치 패널 — 측면 'PIR PANEL' 표기", "Sandwich panel — 'PIR PANEL' marking on the edge", ["ing-44"]),
      seen("노란색 발포 충진재", "Yellow expanding foam filler", ["ing-11", "ing-16", "ing-44"]),
      seen("알루미늄 피복 롤 단열재 — 'HIMONETECH' 표기", "Foil-faced insulation roll — 'HIMONETECH' marking", ["ing-16", "ing-55"]),
      tbc("롤 단열재의 시공 위치", "Where the insulation roll is installed"),
    ],
    qcPoints: [
      seen("창 둘레 틈을 발포재로 채웁니다", "Fill the gaps around windows with foam", ["ing-11", "ing-16"]),
      seen("패널 이음부를 따라 실링합니다", "Seal along the panel joints", ["ing-44"]),
      tbc("충진·실링 후 빈틈이 남지 않았는지 확인합니다", "Check that no gaps remain after filling and sealing"),
      tbc("방수층은 정해진 폭 이상 겹쳐 시공합니다", "Lap the waterproofing layer by at least the specified width"),
    ],
    pendingShots: [shot("방수층 시공", "Waterproofing layer")],
  },
  {
    code: "windows", order: 5, name: { ko: "창호", en: "Windows & Doors" },
    summary: { ko: "창과 출입문을 설치합니다", en: "Installing windows and doors" },
    description: {
      ko: "골조의 개구부에 창과 출입문을 끼워 고정합니다. 흰색 PVC 프레임의 창과 양개 출입문, 아래쪽이 바깥으로 밀려 열리는 진회색 프레임의 프로젝트창이 쓰였습니다.",
      en: "Windows and entrance doors are fitted into the frame openings: white PVC-framed windows and a double door, and dark-grey awning windows that open outward at the bottom.",
    },
    image: mustImage("ing-02"),
    materials: [
      seen("흰색 PVC 프레임 창·양개 출입문", "White PVC-framed windows and double door", ["ing-02", "ing-30", "ing-35"]),
      seen("진회색 프레임 프로젝트창", "Dark-grey framed awning windows", ["ing-02", "ing-59", "ing-74"]),
      tbc("유리 사양", "Glazing specification"),
    ],
    qcPoints: [
      seen("보호필름을 붙인 채 설치해 마감 전까지 프레임 표면을 보호합니다", "Fit units with their protective film on to protect the frames until finishing", ["ing-02", "ing-30"]),
      tbc("설치 후 수평·수직을 확인합니다", "Check level and plumb after fitting"),
      tbc("모든 창과 문을 열고 닫아 작동을 확인합니다", "Open and close every window and door to check operation"),
    ],
    pendingShots: [],
  },
  {
    code: "exterior", order: 6, name: { ko: "외장", en: "Exterior Cladding" },
    summary: { ko: "외벽 패널을 세웁니다", en: "Raising the exterior panels" },
    description: {
      ko: "골조에 외벽 패널을 세워 집의 겉모습을 만듭니다. 측면 돌출부는 바깥으로 펼친 상태와 본체 쪽으로 접은 상태가 모두 기록되어 있으며, 작동 방식은 [확인 필요]입니다.",
      en: "Exterior wall panels are raised on the frame to form the outer shell. The side bump-out is recorded both extended and retracted; how it operates is [To be confirmed].",
    },
    image: mustImage("ing-08"),
    materials: [
      seen("금속 외피 샌드위치 패널", "Metal-faced sandwich panels", ["ing-08", "ing-65"]),
      seen("패널 이음부 발포재 — 트림 마감 전", "Foam at panel joints — before trim finishing", ["ing-07", "ing-72"]),
      tbc("외피 재질과 도장", "Facing material and coating"),
    ],
    qcPoints: [
      seen("돌출부를 펼친 상태와 접은 상태를 각각 기록합니다", "Record the bump-out both extended and retracted", ["ing-65", "ing-06"]),
      tbc("돌출부를 여닫을 때 이음부 기밀을 점검합니다", "Check joint airtightness when the bump-out is moved"),
      tbc("코너 트림과 이음부 마감 후 실링 상태를 점검합니다", "Inspect sealing after corner trims and joints are finished"),
    ],
    pendingShots: [shot("코너 트림 마감", "Corner trim finish")],
    comparison: {
      items: [
        { image: mustImage("ing-65"), label: { ko: "펼친 상태", en: "Extended" } },
        { image: mustImage("ing-06"), label: { ko: "접은 상태", en: "Retracted" } },
      ],
      note: {
        ko: "같은 쪽(견인부 쪽 끝과 A측면)에서 찍은 두 사진입니다. 돌출부의 작동 방식은 [확인 필요]입니다.",
        en: "Both photos are taken from the same side (towing end and side A). How the bump-out operates is [To be confirmed].",
      },
    },
  },
  {
    code: "mep", order: 7, name: { ko: "설비 (전기·급배수)", en: "Services (Electrical & Plumbing)" },
    summary: { ko: "전기 배관과 배선을 깝니다", en: "Running electrical conduit and wiring" },
    description: {
      ko: "벽과 천장 안으로 전선관(CD관)을 먼저 깔고, 그 안으로 배선합니다. 급배수 배관 공정은 사진을 준비하고 있습니다.",
      en: "Electrical conduit is laid inside the walls and ceiling first, and the wiring runs through it. Photos of the plumbing work are being prepared.",
    },
    image: mustImage("ing-17"),
    materials: [
      seen("전선관(CD관)", "Corrugated electrical conduit", ["ing-17", "ing-37", "ing-38"]),
      tbc("분전반과 배선 규격", "Distribution board and cable specification"),
    ],
    qcPoints: [
      seen("전선관을 먼저 깔고 그 안으로 배선합니다", "Lay the conduit first, then run the wiring through it", ["ing-17", "ing-37", "ing-38"]),
      tbc("전기를 넣기 전에 절연저항을 측정합니다", "Measure insulation resistance before energising"),
      tbc("누전차단기 작동을 시험합니다", "Test the residual-current breaker"),
      tbc("급배수 배관에 물을 흘려 누수를 확인합니다", "Run water through the plumbing to check for leaks"),
    ],
    pendingShots: [
      shot("급배수 배관", "Plumbing pipework"),
      shot("분전반", "Distribution board"),
    ],
  },
  {
    code: "interior", order: 8, name: { ko: "내장", en: "Interior Finishing" },
    summary: { ko: "다락과 실내 칸막이를 만듭니다", en: "Building the loft and partitions" },
    description: {
      ko: "목재 스터드로 실내 칸막이와 다락 틀을 짜고 보드를 붙입니다. 다락은 상부 창이 있는 실내 한쪽 끝에 만듭니다.",
      en: "Timber studs form the interior partitions and the loft frame, and boards are fixed to them. The loft sits at one end of the interior, below the upper windows.",
    },
    image: mustImage("ing-18"),
    materials: [
      seen("목재 스터드", "Timber studs", ["ing-18", "ing-78"]),
      seen("보드 — 'KNAUF' 표기", "Boards — 'KNAUF' marking", ["ing-17", "ing-18", "ing-78"]),
      tbc("파란색 보드 판재의 종류", "Type of the blue boards"),
    ],
    qcPoints: [
      tbc("칸막이용 목재의 함수율을 확인한 뒤 사용합니다", "Check the moisture content of partition timber before use"),
      tbc("보드 고정 간격과 이음부 처리를 점검합니다", "Inspect board fixing spacing and joint treatment"),
      tbc("다락 바닥과 난간의 고정 상태를 점검합니다", "Check that the loft floor and guard are securely fixed"),
    ],
    pendingShots: [shot("내장 마감 (도장·바닥재)", "Interior finishes (paint, flooring)")],
  },
  {
    code: "completion", order: 9, name: { ko: "준공·검수", en: "Completion & Inspection" },
    summary: null,
    description: {
      ko: "완성된 집을 최종 점검한 뒤 인도합니다. 준공 사진과 검수 기록은 준비하고 있습니다.",
      en: "The finished house is inspected before handover. Completion photos and inspection records are being prepared.",
    },
    image: null,
    materials: [],
    qcPoints: [
      tbc("전기·급배수 설비의 작동을 최종 확인합니다", "Make a final check that electrical and plumbing services work"),
      tbc("외부 이음부와 창호 둘레의 누수를 점검합니다", "Check external joints and window surrounds for leaks"),
      tbc("마감 상태를 점검표에 따라 확인합니다", "Inspect the finishes against a checklist"),
    ],
    pendingShots: [
      shot("완성 외관", "Finished exterior"),
      shot("완성 실내", "Finished interior"),
      shot("검수 기록", "Inspection record"),
    ],
  },
];

// 근거 사진 ID 검증 — 데이터에 없는 ID 가 있으면 빌드 오류
for (const step of processSteps) {
  for (const item of [...step.materials, ...step.qcPoints]) {
    if (item.status === "observed" && !item.evidence?.length) {
      throw new Error(`[projects] ${step.code}: observed 항목에 근거 사진이 없습니다 — "${item.text.ko}"`);
    }
    item.evidence?.forEach(mustImage);
  }
}

// ── Query helpers ─────────────────────────────────────────────────

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

/** 홈 공정 요약용: 대표 사진과 한 줄 요약이 모두 있는 단계 (순서 유지) */
export function getProcessHighlights(): (ProcessStep & { image: ProjectImage; summary: I18nText })[] {
  return processSteps.filter(
    (s): s is ProcessStep & { image: ProjectImage; summary: I18nText } =>
      s.image !== null && s.summary !== null,
  );
}

/** 공정 단계에 속한 제작 과정 실사 (사진 기록일 → ID 순) */
export function getStepImages(code: ProcessStepCode): ProjectImage[] {
  return projects
    .flatMap((p) => p.images.process)
    .filter((img) => img.step === code)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "") || imageId(a.src).localeCompare(imageId(b.src)));
}

/** 사진 기록일 범위 (없으면 null) — "공사 기간"이 아니라 촬영일 범위 */
export function getDateRange(images: ProjectImage[]): { from: string; to: string } | null {
  const dates = images.map((i) => i.date).filter((d): d is string => !!d).sort();
  return dates.length ? { from: dates[0], to: dates[dates.length - 1] } : null;
}

/** "2026-08-11" → "2026.08.11" */
export function formatShotDate(date: string): string {
  return date.replaceAll("-", ".");
}

/** 제작 과정 실사 중 특정 시점(외부/내부)만 */
export function getProcessImagesByView(project: Project, view: ImageView): ProjectImage[] {
  return project.images.process.filter((img) => img.view === view);
}

/**
 * 대표 이미지: cover → 완성 외관 실사 → 제작 중 외관 실사 → 첫 외관 이미지(렌더) → null
 * 렌더가 대표 이미지가 되는 것은 마지막 수단
 */
export function getCoverImage(project: Project): ProjectImage | null {
  const { exterior } = project.images;
  return (
    project.cover ??
    exterior.find((img) => img.kind === "photo") ??
    getProcessImagesByView(project, "exterior")[0] ??
    exterior[0] ??
    null
  );
}
