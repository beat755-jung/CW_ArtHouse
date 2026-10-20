@AGENTS.md

# CW_ArtHouse

## 프로젝트 목적

- 미니하우스를 설계·제작·판매하는 회사 **CW_ArtHouse**의 공식 홈페이지
- 중심 인물: **정창원 (Jung Chang-Won, JCW)** — 회사명 "CW"의 유래
- 핵심 콘텐츠: (1) 회사·대표 소개 (2) 제품(미니하우스) 소개
- 출발점: 작가 포트폴리오(Lilly_ArtWorld) 코드를 복사함. 작가 관련 콘텐츠는 단계적으로 교체·제거 중

## 기술 스택

- Next.js 16.2.4 (App Router) + React 19 + Tailwind CSS 4 + TypeScript
- `npm run dev` / `npm run build` 는 `--webpack` 사용
- 프로젝트 루트 = package.json 위치 (하위 폴더 없음)
- Next.js API는 학습 데이터와 다를 수 있음 → 코드 작성 전 `node_modules/next/dist/docs/` 확인

## 디자인 원칙

- 기존 다크 톤 유지
  - 배경 `--bg #070707` / 서피스 `--bg-surface #0e0e0e`
  - 본문 `--text #ede8e0` / 보조 `--text-muted #8a857f` (배경 대비 5.51:1, WCAG AA)
  - 강조 앰버 `--accent #b8956a` / 구분선 `--border #1c1c1c`
- 색·폰트는 `app/globals.css` 토큰만 사용. 컴포넌트에 색상값 하드코딩 금지
- 폰트: Cormorant Garamond(제목) · Inter(본문) · Nanum Myeongjo(한글)
- 유지할 UI 패턴: 좌측 220px 사이드바, Hero 부유 이미지, 마소나리 그리드, 라이트박스
- 밝은 배경 이미지(도면 등)는 다크 화면과의 대비를 고려해 배치

## 작업 규칙

1. 단계별로 진행한다. 한 단계 = 하나의 주제.
2. 파일 수정 전에 계획(변경 파일·내용·영향 범위)을 먼저 제시하고, 승인 후 수정한다.
3. 승인 범위 밖의 파일은 건드리지 않는다. 삭제 시 대상 목록을 먼저 보여준다.
4. 단계가 끝나면 `npm run lint`와 `npm run build` 통과를 확인한 뒤 커밋한다.
   커밋 메시지에는 단계 번호와 요약을 적는다.
5. git 명령은 실행 전에 먼저 보여주고 확인을 받는다. push는 사용자가 직접 실행한다.
6. 커밋 작성자는 정원석 `<beat755@gmail.com>` (저장소 로컬 설정). Co-Authored-By 줄은 넣지 않는다.

## 콘텐츠 규칙

- 면적·단열 성능·가격·공사 기간(공기)·중량·자재 등 **사양 수치는 절대 임의로 만들지 않는다.**
  출처가 확인되지 않은 값은 `[확인 필요]`로 표시한다.
- 회사 연혁·대표 경력·주소·연락처·인증·고객 사례 등 사실 정보도 동일하게 적용한다.
- 이미지 속 텍스트(도면 라벨 등)에서 제품명·치수를 추정하지 않는다.
- 렌더링 이미지와 실제 제작 사진을 구분해 표기한다. 렌더링을 실물처럼 소개하지 않는다.

## 언어

- 한국어/영어 이중 언어. 사용자에게 보이는 모든 텍스트는 ko/en을 함께 작성한다.
- 표기: 회사 `CW_ArtHouse`(밑줄 포함, 확정), 대표 `Jung Chang-Won`
- 구현 방식: `app/[locale]/` 경로 분리 (`/ko` 기본, `/en`), 외부 i18n 라이브러리 없음. `/` → `/ko` 는 `next.config.ts` redirects
  - 화면 고정 문구(메뉴·버튼·제목): `lib/i18n/dictionaries/ko.ts`·`en.ts` (en 은 `Dictionary` 타입 → 키 누락 시 빌드 오류)
  - 프로젝트·공정 데이터: `lib/projects.ts` 의 `I18nText`
- 폰트: 영문 Cormorant Garamond·Inter + 한글 Noto Serif KR·Noto Sans KR (`next/font`, 한글은 분할 파일·preload 없음)

## 이미지 자산

- 데이터 단일 출처: `lib/projects.ts` (Project · ProcessStep). 모르는 값은 `null` → 화면에 `[확인 필요]` / `[To be confirmed]`
- 이미지 경로: `public/projects/{slug}/exterior | process | interior / {인벤토리 ID}.jpg`
  - 파일명 ID(`ing-05`, `out-08`, `in-07` …)는 `docs/image-inventory.md`와 같다.
  - `ing-*` 제작 현장 실사, `out-*` 외관 콘셉트 렌더, `in-*` 내부 **분위기 샘플** 렌더
  - `in-*`는 실제 제품과 구성이 다르며 추후 교체 예정. 현재는 분위기 참고용으로 그대로 사용한다.
- 게시 불가 이미지는 `public` 밖 `_archive/`에 둔다 (`public/` 안 파일은 배포 시 누구나 접근 가능).
  - `out-07` 중복, `in-01` SketchUp 파일명 노출, `in-10` 저작권 확인 전, `ing-19` 작업자 노출(동의 확인 전)
- `public/` 사진은 긴 변 1920px 사본(카메라 메타데이터 제거). 고해상도 원본은 `_originals/` (git 제외, 로컬 전용)
- 새 이미지 추가 시: 기존 이미지와 중복 확인 → 촬영 시각 순으로 다음 ID 부여 → `lib/projects.ts`·`docs/image-inventory.md` 함께 갱신
