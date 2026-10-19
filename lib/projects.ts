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
 * [이미지 경로 규칙]
 * - public/projects/{slug}/exterior | process | interior / {인벤토리 ID}.jpg
 * - 인벤토리 ID(ing-05, out-08, in-07 …)는 docs/image-inventory.md 와 같다.
 * - 게시 불가 이미지는 public 밖의 _archive/ 에 둔다.
 *
 * [프로젝트 추가 방법]
 * 1. public/projects/{새-slug}/ 아래에 exterior, process, interior 폴더를 만들고 이미지 복사
 * 2. projects 배열에 Project 객체 추가 (모르는 값은 null)
 * 3. featured: true 설정 시 홈 Featured 섹션에 표시
 */

// ── 공통 타입 · 표시 헬퍼 ──────────────────────────────────────────

export type Locale = "ko" | "en";

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

export interface ProjectImage {
  src: string;
  alt: I18nText;
  /** photo: 실사 / render: 렌더·분위기 예시 — 렌더를 실물처럼 소개하지 않는다 */
  kind: "photo" | "render";
  /** 공정 이미지일 때 해당 단계 */
  step?: ProcessStepCode;
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
  images: {
    exterior: ProjectImage[];
    process: ProjectImage[];
    interior: ProjectImage[];
  };
  /** 평면도 경로 */
  floorPlan: string | null;
  featured: boolean;
}

export interface ProcessStep {
  code: ProcessStepCode;
  order: number;
  name: I18nText;
  description: I18nText | null;
  image: ProjectImage | null;
  /** 품질관리 포인트 — 빈 배열이면 화면에 UNCONFIRMED 표시 */
  qcPoints: I18nText[];
}

// ── 이미지 헬퍼 ───────────────────────────────────────────────────

const photo = (src: string, ko: string, en: string, step?: ProcessStepCode): ProjectImage => ({
  src,
  alt: { ko, en },
  kind: "photo",
  step,
});

const render = (src: string, ko: string, en: string): ProjectImage => ({
  src,
  alt: { ko, en },
  kind: "render",
});

// ── prototype-01 이미지 (docs/image-inventory.md 기준) ─────────────

const P1 = "/projects/prototype-01";

const p1Exterior: ProjectImage[] = [
  photo(`${P1}/exterior/ing-01.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 B측면", "Exterior under construction — towing end and side B"),
  photo(`${P1}/exterior/ing-02.jpg`, "제작 중인 외관 — A측면 출입문과 창호", "Exterior under construction — side A entrance door and windows", "windows"),
  photo(`${P1}/exterior/ing-04.jpg`, "제작 중인 외관 — B측면과 열린 수납 해치", "Exterior under construction — side B with open storage hatch"),
  photo(`${P1}/exterior/ing-05.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 B측면", "Exterior under construction — towing end and side B, hills behind"),
  photo(`${P1}/exterior/ing-06.jpg`, "제작 중인 외관 — 견인부 쪽 끝과 A측면", "Exterior under construction — towing end and side A"),
  photo(`${P1}/exterior/ing-07.jpg`, "제작 중인 외관 — A측면 사선", "Exterior under construction — side A, oblique view"),
  photo(`${P1}/exterior/ing-08.jpg`, "제작 중인 외관 — A측면 입면", "Exterior under construction — side A elevation", "exterior"),
  render(`${P1}/exterior/out-01.jpg`, "콘셉트 렌더 — 지붕 평면 일부와 정면도", "Concept render — partial roof plan and front view"),
  render(`${P1}/exterior/out-02.jpg`, "콘셉트 렌더 — 지붕 평면", "Concept render — roof plan"),
  render(`${P1}/exterior/out-03.jpg`, "콘셉트 렌더 — 평면·정면·측면·후면·투시 시트", "Concept render sheet — top, front, side, back and perspective views"),
  render(`${P1}/exterior/out-04.jpg`, "콘셉트 렌더 — 투시도", "Concept render — perspective view"),
  render(`${P1}/exterior/out-05.jpg`, "콘셉트 렌더 — 좌측면도", "Concept render — left side view"),
  render(`${P1}/exterior/out-06.jpg`, "콘셉트 렌더 — 후면도", "Concept render — back view"),
  // out-08: 휴대폰 화면 캡처 — 게시 전 UI 크롭 필요
  render(`${P1}/exterior/out-08.jpg`, "콘셉트 렌더 — 야간 투시도", "Concept render — night perspective"),
];

const p1Process: ProjectImage[] = [
  photo(`${P1}/process/ing-03.jpg`, "하부 섀시 레일과 받침, 장착 전 타이어", "Chassis rail and supports, tyres not yet fitted", "foundation"),
  photo(`${P1}/process/ing-09.jpg`, "실내 — 다락, 사다리, 칸막이", "Interior — loft, ladder and partition", "interior"),
  photo(`${P1}/process/ing-10.jpg`, "B측 돌출부 — 바닥 프레임과 벽 스터드", "Side B bump-out — floor frame and wall studs", "framing"),
  photo(`${P1}/process/ing-11.jpg`, "A측 돌출부 — 미서기창과 창 주변 폼 충진", "Side A bump-out — sliding window with foam-filled surround", "insulation-waterproofing"),
  photo(`${P1}/process/ing-12.jpg`, "A측 돌출부와 다락 쪽 실내", "Side A bump-out and loft end", "interior"),
  photo(`${P1}/process/ing-13.jpg`, "중앙 통로 — 양측 돌출부 바닥", "Central aisle — floors of both bump-outs", "framing"),
  photo(`${P1}/process/ing-14.jpg`, "반대쪽 끝에서 본 다락 쪽 실내", "Looking toward the loft end", "interior"),
  photo(`${P1}/process/ing-15.jpg`, "B측 돌출부 — 바닥 프레임과 자재", "Side B bump-out — floor frame and materials", "framing"),
  photo(`${P1}/process/ing-16.jpg`, "A측 돌출부 — 창 주변 폼 충진과 롤 단열재", "Side A bump-out — foam-filled window surround and insulation roll", "insulation-waterproofing"),
  photo(`${P1}/process/ing-17.jpg`, "천장 전선관 다발", "Bundled electrical conduit at the ceiling", "mep"),
  photo(`${P1}/process/ing-18.jpg`, "다락, 사다리, 목재 스터드와 칸막이 판재", "Loft, ladder, timber studs and partition boards", "interior"),
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
];

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

const findImage = (src: string): ProjectImage | null =>
  [...p1Exterior, ...p1Process, ...p1Interior].find((img) => img.src === src) ?? null;

export const processSteps: ProcessStep[] = [
  { code: "foundation", order: 1, name: { ko: "기초", en: "Foundation" }, description: null, image: null, qcPoints: [] },
  { code: "framing", order: 2, name: { ko: "골조", en: "Framing" }, description: null, image: findImage(`${P1}/process/ing-10.jpg`), qcPoints: [] },
  { code: "roof", order: 3, name: { ko: "지붕", en: "Roof" }, description: null, image: null, qcPoints: [] },
  { code: "insulation-waterproofing", order: 4, name: { ko: "단열·방수", en: "Insulation & Waterproofing" }, description: null, image: findImage(`${P1}/process/ing-16.jpg`), qcPoints: [] },
  { code: "windows", order: 5, name: { ko: "창호", en: "Windows & Doors" }, description: null, image: findImage(`${P1}/exterior/ing-02.jpg`), qcPoints: [] },
  { code: "exterior", order: 6, name: { ko: "외장", en: "Exterior Cladding" }, description: null, image: findImage(`${P1}/exterior/ing-08.jpg`), qcPoints: [] },
  { code: "mep", order: 7, name: { ko: "설비", en: "Building Services" }, description: null, image: findImage(`${P1}/process/ing-17.jpg`), qcPoints: [] },
  { code: "interior", order: 8, name: { ko: "내장", en: "Interior Finishing" }, description: null, image: findImage(`${P1}/process/ing-18.jpg`), qcPoints: [] },
  { code: "completion", order: 9, name: { ko: "준공", en: "Completion" }, description: null, image: null, qcPoints: [] },
];

// ── Query helpers ─────────────────────────────────────────────────

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

/** 대표 이미지: 첫 번째 실사 외관 → 첫 번째 외관 → null */
export function getCoverImage(project: Project): ProjectImage | null {
  const { exterior } = project.images;
  return exterior.find((img) => img.kind === "photo") ?? exterior[0] ?? null;
}
