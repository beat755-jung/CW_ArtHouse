# 06. 빌드 · 코드 정리 — 점검 결과 (미반영)

- 작성: 2026-10-26. **이 항목은 아직 코드에 반영하지 않았습니다** (승인 대기).

## 1. 빌드

| 점검 | 결과 |
|---|---|
| `npm run lint` | 오류·경고 0 |
| `npm run build` (캐시 삭제 후) | 오류·경고 0, 15개 경로 정적 생성 |

## 2. 정리 후보

| 대상 | 내용 | 제안 |
|---|---|---|
| `framer-motion` (dependencies) | 코드에서 import 0건 — 작가 사이트 잔재 | `npm uninstall framer-motion` |
| CSS `.artwork-card` · `.artwork-info` | 작가 사이트 이름이 남은 클래스 (홈 카드·갤러리에서 사용 중) | `.media-card` · `.media-info`로 이름 변경 |
| `app/globals.css` 주석 "Artti", "도자기의 흙빛" | 작가 사이트 설명 | 회사 기준 설명으로 수정 |
| `components/MasonryGallery.tsx` 주석 "artwork" | 〃 | 수정 |
| `public/drawings/prototype-01/plan.svg` | 데이터는 `plan-prototype-01.svg` 사용. 같은 내용이며 `scripts/generate-concept-plan.mjs`가 일부러 함께 생성 | **유지** (지우려면 스크립트도 같이 수정) |

## 3. 작가 사이트 문자열 검색 (2026-10-26)

| 문자열 | 결과 |
|---|---|
| `Hyeyoon`, `SAIC`, `정혜윤` | 0건 |
| `Lilly` | CLAUDE.md 1건 (프로젝트 출발점 설명 — 유지) · README 0건 (재작성) |
| `exhibition`, `Artti` | README 0건 (재작성) · globals.css 주석 1건 |
| `artwork` | CSS 클래스·주석 (위 2절) |

## 4. 이미 제거된 것 (이번 점검 중 반영)

- `components/GlobalProtection.tsx`, `components/ProtectedImage.tsx` — [05-image-protection.md](05-image-protection.md)
