/**
 * lib/annotations.ts — 사진 주석(번호 마커) 데이터
 *
 * [형식]
 * - 키: 인벤토리 ID (예: "ing-23") — lib/projects.ts 의 공개 이미지여야 함 (없으면 빌드 오류)
 * - x, y: 원본 사진 기준 % 좌표 (왼쪽 위 0,0 → 오른쪽 아래 100,100)
 * - 번호는 배열 순서대로 ①②③… 자동 부여
 *
 * [콘텐츠 규칙 — CLAUDE.md]
 * - 라벨에는 사진에 보이는 것만 쓴다. 등급·두께·성능·용도 추정은 쓰지 않는다
 * - 표기된 글자는 "'OO' 표기"로 인용만 한다
 *
 * [좌표 찾기]
 * - 개발 서버에서 /ko/process?annotate=1 로 열고 사진을 클릭하면 % 좌표가 표시된다 (배포 사이트에는 없음)
 * - 주석이 있는 사진은 잘라내지 않고 원래 비율로 표시된다 (잘라내면 좌표가 어긋남)
 */
import { imageId, projects, type I18nText } from "@/lib/projects";

export interface Annotation {
  x: number;
  y: number;
  label: I18nText;
}

const a = (x: number, y: number, ko: string, en: string): Annotation => ({ x, y, label: { ko, en } });

// 좌표: 2026-10-21 10% 격자 오버레이로 확인
export const annotations: Record<string, Annotation[]> = {
  // 기초 — 섀시 하부
  "ing-03": [
    a(12, 59, "강재 섀시 레일", "Steel chassis rail"),
    a(41.5, 53, "적색 도장 강재 받침", "Red-painted steel support"),
    a(33, 57, "벽에 기대 놓은 타이어", "Tyre leaning against the wall"),
    a(84, 61, "콘크리트 블록 받침", "Concrete block support"),
    a(66, 23, "벽 패널의 연필 표기 (의미 [확인 필요])", "Pencil marks on the panel (meaning [To be confirmed])"),
  ],
  // 골조 — 강재 골조 측면
  "ing-23": [
    a(22.5, 50, "강재 각관 기둥", "Square steel tube post"),
    a(50, 35, "지붕 골조", "Roof framing"),
    a(45, 69, "바닥 프레임", "Floor frame"),
    a(28, 76, "적색 도장 섀시 받침", "Red-painted chassis support"),
    a(78, 83, "강재 절단기", "Steel cut-off saw"),
  ],
  // 지붕 — 지붕 패널과 패널 자재
  "ing-24": [
    a(45, 31, "골조 위에 얹은 지붕 패널", "Roof panels on the frame"),
    a(10, 63, "노란색 심재의 샌드위치 패널 자재", "Sandwich panels with a yellow core"),
    a(52, 52, "벽 패널이 없는 골조", "Frame without wall panels"),
    a(32, 73, "견인용 A형 프레임", "A-frame towing drawbar"),
    a(70, 70, "적색 도장 섀시 받침", "Red-painted chassis support"),
  ],
  // 단열·방수 — 창 둘레 충진과 롤 단열재
  "ing-16": [
    a(82.5, 45, "창 둘레 발포 충진", "Foam filling around the window"),
    a(48, 47, "알루미늄 피복 롤 단열재 ('HIMONETECH' 표기)", "Foil-faced insulation roll ('HIMONETECH' marking)"),
    a(33, 74, "바닥 위 수평계", "Spirit level on the floor"),
    a(55.5, 40, "강재 벽 스터드", "Steel wall stud"),
  ],
  // 단열·방수 — 패널 이음부 근접 (세로 사진)
  "ing-44": [
    a(13, 30, "패널 이음부를 따라 바른 실링", "Sealant along the panel joint"),
    a(16, 82, "패널 측면 'PIR PANEL' 표기", "'PIR PANEL' marking on the panel edge"),
    a(85, 52, "창 둘레 발포 충진", "Foam filling around the window"),
    a(75, 34, "창 위 가로 부재", "Horizontal member above the window"),
    a(60.5, 75, "강재 벽 스터드", "Steel wall stud"),
  ],
  // 설비 — 전선관
  "ing-17": [
    a(8, 40, "전선관(CD관) 다발", "Bundle of corrugated conduit"),
    a(78, 11, "천장을 따라 깐 전선관", "Conduit run along the ceiling"),
    a(92, 62, "벽에서 나온 배선", "Wiring coming out of the wall"),
    a(59, 35, "보드 칸막이 ('KNAUF' 표기)", "Board partition ('KNAUF' marking)"),
  ],
  // 내장 — 다락과 칸막이
  "ing-18": [
    a(60, 37, "다락 플랫폼", "Loft platform"),
    a(40, 30, "다락 쪽 상부 창", "Upper windows at the loft"),
    a(39.5, 72, "목재 스터드 칸막이", "Timber stud partition"),
    a(53, 42, "보드 ('KNAUF' 표기)", "Board ('KNAUF' marking)"),
    a(22, 65, "파란색 보드 판재 (종류 [확인 필요])", "Blue boards (type [To be confirmed])"),
    a(76, 60, "흰색 PVC 출입문 프레임", "White PVC door frame"),
  ],
};

// 키 검증 — 공개 이미지에 없는 ID 면 빌드 오류
const publicIds = new Set(projects.flatMap((p) => Object.values(p.images).flat()).map((i) => imageId(i.src)));
for (const [id, list] of Object.entries(annotations)) {
  if (!publicIds.has(id)) throw new Error(`[annotations] "${id}" 는 공개 이미지가 아닙니다`);
  for (const m of list) {
    if (m.x < 0 || m.x > 100 || m.y < 0 || m.y > 100) throw new Error(`[annotations] ${id}: 좌표 범위 오류 (${m.x}, ${m.y})`);
  }
}

export function getAnnotations(src: string): Annotation[] {
  return annotations[imageId(src)] ?? [];
}
