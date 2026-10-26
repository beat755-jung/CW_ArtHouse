# CW_ArtHouse

미니하우스를 설계·제작·판매하는 회사 **CW_ArtHouse**의 홈페이지입니다.
`Next.js 16` (App Router) · `React 19` · `Tailwind CSS 4` · `TypeScript`로 만들었고, 모든 페이지를 빌드 시 정적으로 생성합니다.

- 작업·콘텐츠 규칙: [CLAUDE.md](CLAUDE.md) — 사양 수치·회사 정보는 확인된 값만, 모르면 `[확인 필요]`
- 배포 전 점검과 채워야 할 항목: [docs/prelaunch/](docs/prelaunch/README.md)
- 이미지 현황: [docs/image-inventory.md](docs/image-inventory.md) · 처리 결과: [docs/image-report.md](docs/image-report.md)

---

## 1. 실행 방법

**필요한 것**: Node.js 20 이상 (도면 생성 스크립트는 Node 24 권장)

```powershell
npm install          # 처음 한 번
npm run dev          # 개발 서버 → http://localhost:3000 (/ → /ko 로 이동)
npm run build        # 운영 빌드 (정적 생성 확인)
npm run start        # 빌드 결과 실행
npm run lint         # ESLint
```

| 명령 | 하는 일 |
|---|---|
| `npm run images` | `assets-src/` 원본 → `public/images/` 결과물 + `docs/image-report.md` (4절) |
| `npm run drawings` | 개념 평면·입면·단면·상세 SVG 생성 후 최적화 (5절) |
| `npm run drawings:optimize` | `public/drawings/` SVG 정리만 |

### 환경변수 (`.env.local`, git 제외)

| 변수 | 용도 | 없을 때 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 사이트 주소 (예: `https://example.com`). OG 이미지 등 절대 주소의 기준 | `http://localhost:3000` — **배포 전에 반드시 설정** |
| `NEXT_PUBLIC_FORM_ENDPOINT` | 상담 폼 전송 서비스 주소 (우선) | — |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 상담 폼 mailto 수신 주소 | 둘 다 없으면 폼 전송 버튼 비활성 + "온라인 접수 준비 중" |

> 폼 전송 서비스를 쓰면 개인정보 **국외 이전 고지**를 동의 문구에 추가해야 합니다 (`lib/i18n/dictionaries/*.ts` `contact.form.consentItems`).

---

## 2. 사이트 구성

한국어 기본(`/ko`), 영어 병행(`/en`). 화면 고정 문구는 사전 파일, 프로젝트·공정 데이터는 `lib/projects.ts`.

| 경로 | 페이지 |
|---|---|
| `/[locale]` | 홈 — Hero(부유 이미지·CTA) · 핵심 정보 · 공정 요약 · 대표 프로젝트 · 문의 유도 |
| `/[locale]/process` | 제작 과정 — 9단계 공정, 사진 근거/`[확인 필요]` 품질관리, 사진 주석, 진행 표시줄 |
| `/[locale]/projects` | 프로젝트 목록 — 유형 필터 |
| `/[locale]/projects/[slug]` | 프로젝트 상세 — 대표 외관 · 사양표 · 도면 · 3D 개념 모델 · 갤러리 · 공정 · 상담 CTA |
| `/[locale]/about` | 회사 소개 — 철학 · 제작 방식 · 진행 절차 · 회사 정보 |
| `/[locale]/contact` | 상담·견적 문의 — 문의 폼 · 연락처 (`?model=slug` 로 관심 모델 자동 입력) |
| 그 밖의 URL | 404 (ko/en 병기) |

---

## 3. 폴더 구조

```text
CW_ArtHouse/
├── app/
│   ├── [locale]/                     언어별 페이지 (layout · page · process · projects · about · contact · not-found)
│   ├── global-not-found.tsx          매칭되지 않는 URL 404
│   ├── globals.css                   디자인 토큰 · 폰트 순서 · 애니메이션 · 본문 바로가기
│   └── icon.svg                      파비콘 (임시)
├── components/
│   ├── Navigation.tsx · LanguageSwitcher.tsx · PageHeader.tsx · CtaLink.tsx · FilterTabs.tsx
│   ├── MasonryGallery.tsx · Lightbox.tsx · NotFoundContent.tsx
│   ├── home/                         Hero · KeyFacts · ProcessTimeline · FeaturedProjects · ContactCta
│   ├── process/                      ProcessProgress · ProcessStepSection · StepMedia · AnnotatedImage · EvidenceLink · PhotoPlaceholder
│   ├── projects/                     ProjectList · ProjectGallery · DrawingViewer · ProjectDrawings · InteractivePlan · ConceptHouseViewer
│   ├── about/ProcedureSteps.tsx
│   └── contact/                      ContactForm · SelectedModel
├── lib/
│   ├── projects.ts                   프로젝트 · 공정 데이터 단일 출처 (모르는 값은 null → [확인 필요])
│   ├── company.ts                    회사 정보 · 연락처 · 핵심 정보 · 진행 절차 · 폼 전송 설정
│   ├── image-map.json                이미지 대응표 (인벤토리 ID ↔ 원본 ↔ 결과물)
│   ├── annotations.ts                사진 주석 마커 좌표
│   ├── drawings.ts · drawing-types.ts 도면 파일 확인 (서버 전용)
│   ├── concept-house.ts · concept-house-scene.ts  3D 개념 모델 (three.js, 버튼을 누를 때만 로드)
│   ├── fonts.ts                      한글 폰트
│   └── i18n/                         config · dictionaries (ko.ts · en.ts)
├── public/
│   ├── images/{exterior,process,interior}/   npm run images 결과물 (직접 수정 금지)
│   └── drawings/{slug}/              도면 SVG · 미리보기 PNG
├── scripts/                          process-images · generate-concept-plan · generate-concept-drawings · optimize-drawings
├── assets-src/                       이미지 원본 (git 제외, 로컬 전용 · 절대 수정 금지)
├── _archive/                         게시 불가 이미지 (public 밖)
└── docs/                             image-inventory · image-report · prelaunch/
```

---

## 4. 이미지

**원칙**: 원본은 절대 수정하지 않습니다. 사이트는 `public/images/`의 결과물만 씁니다.

```text
assets-src/house_{out|ing|in}/{ID}.jpg   →  npm run images  →  public/images/{구분}/{구분}-{공정·공간}-{번호}.jpg
```

처리 내용 (`scripts/process-images.mjs`):

- EXIF 회전을 픽셀에 반영 → EXIF·GPS·ICC 메타데이터 제거 (결과를 다시 읽어 0건 검증)
- 긴 변 2400px 이하로 축소 (작은 원본은 확대하지 않음), JPEG 품질 82
- **실사만** 화이트밸런스 ±6% · 노출 ±0.25EV 이내 보정, 오른쪽 아래 작은 `CW_ArtHouse` 워터마크
- 렌더(외관 콘셉트 `out-*`, 실내 분위기 샘플 `in-*`)는 보정·워터마크 없음

| 옵션 | 효과 |
|---|---|
| `npm run images -- --compare` | `scripts/out/compare/`에 전후 비교 이미지 (git 제외) |
| `npm run images -- --no-adjust` | 톤 보정 끔 |
| `npm run images -- --no-watermark` | 워터마크 끔 |

> `assets-src/`는 git에 없습니다. 다른 PC에서 `npm run images`를 하려면 원본 폴더를 복사해 와야 합니다.

### 새 사진 추가

1. 기존 사진과 중복인지 확인
2. 촬영 시각 순서로 다음 ID 부여 (예: 공정 사진 `ing-85`)
3. 원본을 `assets-src/house_ing/ing-85.jpg`로 넣고 `lib/image-map.json`에 항목 추가 (`id` · `kind` · `category` · `group` · `source` · `output`)
4. `npm run images`
5. `lib/projects.ts` 목록에 등록 — `outside(imageSrc("ing-85"), "대체 텍스트 ko", "alt en", "framing")`
   - 대체 텍스트는 **사진에 보이는 것만** ("설치 전"처럼 상태를 추정하는 말 금지)
   - 촬영일은 `SHOT_DATES`에 추가 (화면에는 "사진 기록일"로만 표시)
   - `step`을 달면 `/process` 해당 단계에 자동 표시 → 채운 컷은 그 단계 `pendingShots`에서 삭제
6. `docs/image-inventory.md` 갱신

게시하면 안 되는 사진(작업자 얼굴, 저작권 미확인 등)은 `public/` 밖 `_archive/`에 둡니다.

---

## 5. 도면

- 위치: `public/drawings/{slug}/` — 데이터의 `Project.drawings`에 등록한 SVG만 표시
  (평면 `plan` · 정면 `elevation-front` · 측면 `elevation-side` · 단면 `section` · 외벽 상세 `detail-wall`)
- 파일이 없으면 상세 페이지에 "도면 준비 중"
- 모든 도면 아래 **"개념도이며 실제 치수와 다를 수 있습니다"** 문구 유지. 도면 속 치수·면적을 데이터로 옮겨 적지 않습니다.
- 개념도 다시 만들기: `npm run drawings` (생성 → 최적화). 직접 그린 SVG를 넣었다면 `npm run drawings:optimize`
  - 정리되지 않은 SVG(스크립트 등)가 남아 있으면 빌드가 실패합니다.

---

## 6. 프로젝트 추가

1. 사진을 4절 방식으로 추가 (외관 `out-*` / 공정 `ing-*` / 실내 `in-*`)
2. `lib/projects.ts`의 `projects` 배열에 `Project` 추가
   - 모르는 값은 모두 `null` (화면에 `[확인 필요]` / `[To be confirmed]`)
   - `cover`에 대표 이미지 지정 (렌더가 대표 이미지가 되지 않도록)
   - `featured: true`면 홈 대표 프로젝트에 표시
3. 도면이 있으면 `public/drawings/{slug}/`에 넣고 `drawings`에 경로 등록
4. `npm run build` — 없는 이미지 ID·근거 사진 ID는 빌드 오류로 잡힙니다

---

## 7. 콘텐츠 규칙 요약

- 면적·단열·가격·공기 등 **사양 수치와 회사 사실 정보는 확인된 값만**. 모르면 `[확인 필요]`
- 렌더와 실사를 구분해 표기 (렌더를 실물처럼 소개하지 않음)
- 인허가·신고 관련 확정 표현 금지 ("지역·용도에 따라 다를 수 있으며 관할 지자체 확인 필요" 수준만)
- 과장 표현("최고", "완벽") 대신 구체적인 행동으로
- 사용자에게 보이는 모든 문구는 ko/en 함께 (en 사전은 `Dictionary` 타입 — 키가 빠지면 빌드 오류)

---

## 8. 배포 전 체크리스트

- [ ] `NEXT_PUBLIC_SITE_URL` 설정
- [ ] `[확인 필요]` 항목 채우기 — [docs/prelaunch/01-content-checklist.md](docs/prelaunch/01-content-checklist.md)
- [ ] SEO 반영 (sitemap · robots · canonical · hreflang · JSON-LD) — [docs/prelaunch/02-seo.md](docs/prelaunch/02-seo.md)
- [ ] 검색 노출 허용: 지금은 모든 페이지 `noindex` (`app/[locale]/layout.tsx`) — 내용이 확정된 뒤 해제
- [ ] 상담 폼 전송 방식 설정 + 개인정보 동의 문구(보유 기간·처리 책임자) 확정
- [ ] Lighthouse 모바일 측정 — [docs/prelaunch/04-performance.md](docs/prelaunch/04-performance.md)

배포는 Next.js를 지원하는 호스팅(예: Vercel)에서 `npm run build`로 합니다. `public/images/`와 `public/drawings/`는 git에 포함되어 함께 배포됩니다.

© CW_ArtHouse. All rights reserved.
