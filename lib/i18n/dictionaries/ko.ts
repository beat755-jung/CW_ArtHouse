/**
 * lib/i18n/dictionaries/ko.ts — 한국어 사전 (Dictionary 타입의 기준)
 *
 * - 화면 고정 문구(메뉴·버튼·페이지 제목)만 둔다. 프로젝트·공정 데이터는 lib/projects.ts
 * - 키를 추가하면 en.ts 에도 같은 키를 추가해야 빌드가 통과한다.
 * - 회사 사실 정보·사양 수치는 넣지 않는다 (CLAUDE.md 콘텐츠 규칙)
 */
export const ko = {
  meta: {
    siteName: "CW_ArtHouse",
    description: "미니하우스 설계·제작·판매",
  },
  nav: {
    label: "주 메뉴",
    tagline: "미니하우스 설계 · 제작",
    process: "제작 과정",
    projects: "프로젝트",
    about: "회사 소개",
    contact: "상담·견적",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
  },
  language: {
    label: "언어 선택",
  },
  common: {
    comingSoon: "준비 중입니다.",
    backToList: "목록으로",
    viewDetail: "자세히 보기",
    allRightsReserved: "All rights reserved.",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    backHome: "홈으로",
  },
  home: {
    // Hero — H1 시안 C (2026-10-19 선택)
    eyebrow: "Mini House — Design · Build",
    titleLine1: "미니하우스,",
    // 둘째 줄은 의미 단위 덩어리 — 좁은 화면에서는 덩어리 사이에서만 줄바꿈
    titleLine2: ["설계·제작·판매까지", "한 곳에서"],
    subtitle: "주택 마당의 별채부터 농장의 휴게 공간까지, 직접 지은 집을 전합니다",
    ctaPrimary: "상담·견적 문의",
    ctaSecondary: "제작 과정 보기",
    renderNote: "일부 이미지는 콘셉트 렌더입니다",
    scroll: "Scroll",
    // 핵심 정보 바
    keyFactsHeading: "핵심 정보",
    keyFacts: {
      structure: "구조 방식",
      baseArea: "기본 면적",
      constructionPeriod: "공사 기간",
      warranty: "보증",
    },
    // 제작 공정 요약
    processEyebrow: "Process",
    processHeading: "제작 공정",
    processAll: "전체 과정 보기",
    processScrollLabel: "제작 공정 단계 (가로로 넘겨 보기)",
    // 대표 프로젝트
    projectsEyebrow: "Projects",
    projectsHeading: "대표 프로젝트",
    // 문의 유도
    contactHeading: "마당의 별채, 농장의 쉼터를 계획 중이신가요?",
    contactBody: "주택 마당의 별채, 농장의 휴게 공간 — 쉬고 머무는 작은 집을 함께 계획해 보세요.",
  },
  process: {
    eyebrow: "Process",
    title: "제작 과정",
    intro: "미니하우스 한 채가 만들어지는 과정을 공정 순서대로 정리했습니다. 이 페이지의 사진은 모두 제작 현장에서 찍은 실사입니다.",
    recordLabel: "사진 기록",
    legendObserved: "해당 작업이나 자재가 사진에 기록된 항목",
    legendUnconfirmed: "회사 확인 전 항목. 확인되는 대로 갱신합니다",
    progressLabel: "공정 단계",
    whatHeading: "무엇을 하는 단계인가요",
    materialsHeading: "사진에서 확인된 자재",
    qcHeading: "품질관리 포인트",
    observed: "사진 확인",
    evidence: "근거 사진",
    photoPending: "사진 준비 중",
    noPhotosYet: "이 단계의 사진을 준비하고 있습니다",
    photoCount: "사진 {n}장",
    morePhotos: "사진 {n}장 더 보기",
    openPhoto: "크게 보기",
    annotationsLabel: "사진 주석",
    compareHeading: "돌출부 상태 비교",
    annotateHint: "좌표 찾기 모드 — 사진을 클릭하면 % 좌표가 표시됩니다 (개발 모드 전용)",
  },
  projects: {
    eyebrow: "Projects",
    title: "프로젝트",
  },
  projectDetail: {
    specsHeading: "사양",
    specs: {
      type: "유형",
      location: "위치",
      grossFloorArea: "연면적",
      structure: "구조 방식",
      foundation: "기초 방식",
      exteriorCladding: "외장재",
      insulation: "단열 사양",
      windows: "창호 사양",
      constructionPeriod: "공사 기간",
    },
  },
  about: {
    eyebrow: "About",
    title: "회사 소개",
    coverCaption: "제작 중인 외관 (실사)",
  },
  contact: {
    eyebrow: "Contact",
    title: "상담·견적 문의",
  },
};

export type Dictionary = typeof ko;
