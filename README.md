# CW_ArtHouse

미니하우스를 설계·제작·판매하는 회사 **CW_ArtHouse**(대표 정창원, Jung Chang-Won)의 홈페이지입니다.  
`Next.js 16` + `Tailwind CSS 4` + `TypeScript` 기반으로 제작되었습니다.

> 작가 포트폴리오(Lilly_ArtWorld) 코드에서 전환 중입니다. 아래 본문 중 작가 사이트 기준 설명은 문서화 단계에서 정리할 예정입니다.  
> 작업 규칙은 [CLAUDE.md](CLAUDE.md), 이미지 현황은 [docs/image-inventory.md](docs/image-inventory.md)를 참고하세요.

---

## 빠른 시작 (처음 실행할 때)

### 사전 준비 — Node.js 설치 확인

터미널(PowerShell 또는 명령 프롬프트)을 열고 아래 명령어로 설치 여부를 확인합니다.

```powershell
node --version
# v18 이상이면 정상 (현재 환경: v24.14.0)
```

Node.js가 없으면 → [nodejs.org](https://nodejs.org) 에서 LTS 버전 다운로드·설치

---

### Step 1 — 프로젝트 폴더로 이동

```powershell
cd "D:\MyRepos\CW_ArtHouse"
```

### Step 2 — 패키지 설치 (최초 1회만)

```powershell
npm install
```

> `node_modules` 폴더가 이미 있으면 이 단계는 건너뛰어도 됩니다.

### Step 3 — 개발 서버 실행

```powershell
npm run dev
```

콘솔에 아래 메시지가 나타나면 준비 완료입니다.

```
▲ Next.js 16.2.4 (Turbopack)
- Local:   http://localhost:3000
```

### Step 4 — 브라우저에서 열기

브라우저 주소창에 입력:

```
http://localhost:3000
```

> 서버를 종료하려면 터미널에서 `Ctrl + C`를 누릅니다.

---

## 명령어 한눈에 보기

| 명령어 | 설명 | 언제 사용? |
|---|---|---|
| `npm install` | 의존 패키지 설치 | 처음 실행할 때 / 패키지 추가 후 |
| `npm run dev` | 개발 서버 시작 (포트 3000) | 일반 작업·수정·미리보기 |
| `npm run build` | 프로덕션 빌드 생성 | 배포 전 최종 빌드 |
| `npm run start` | 빌드 결과물 실행 | 빌드 후 실제 속도 확인 |
| `npm run lint` | 코드 문법 검사 | 오류 점검 시 |

---

## 자주 발생하는 문제

### "포트 3000이 이미 사용 중" 오류

```powershell
# 포트 3000을 사용 중인 프로세스 확인
netstat -ano | findstr :3000

# 해당 PID 종료 (PID를 숫자로 대체)
taskkill /PID [PID번호] /F

# 또는 다른 포트로 실행
npm run dev -- --port 3001
# → http://localhost:3001 로 접속
```

### 이미지가 표시되지 않을 때

```
public/artworks/ 폴더 안에 이미지 파일이 있는지 확인하세요.
원본 위치: e:\Art_HY\Lilly_ArtWorld\HY_Art Data\
```

### `npm install` 오류 발생 시

```powershell
# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 사이트맵

```
/                   홈           — 다크 히어로 + 부유하는 작품 이미지 + Featured Works
/exhibition         전시 목록    — 연도별 타임라인
/exhibition/[slug]  전시 상세    — 마소나리 이미지 그리드 + 라이트박스
/artist             작품 아카이브 — 카테고리 탭 필터 + 전체 마소나리 갤러리
/about              작가 소개    — 스테이트먼트 · 학력 · Instagram · SAIC 주소
```

---

## 프로젝트 구조

```
CW_ArtHouse/
│
├── app/                          Next.js App Router 페이지
│   ├── layout.tsx                루트 레이아웃 (폰트·전역 보호·내비게이션)
│   ├── globals.css               디자인 토큰·이미지 보호·애니메이션 정의
│   ├── page.tsx                  홈 — Hero + Featured Works
│   ├── exhibition/
│   │   ├── page.tsx              전시 목록 (연도 타임라인)
│   │   └── [slug]/
│   │       ├── page.tsx          전시 상세 (서버 컴포넌트)
│   │       └── ExhibitionGallery.tsx  갤러리 + 라이트박스 (클라이언트)
│   ├── artist/
│   │   └── page.tsx              작품 아카이브 (카테고리 탭 + 마소나리)
│   └── about/
│       └── page.tsx              작가 소개 · 연락처
│
├── components/
│   ├── Navigation.tsx            좌측 사이드바 (데스크톱) / 햄버거 (모바일)
│   ├── GlobalProtection.tsx      전역 우클릭·드래그 차단 (null 렌더)
│   ├── ProtectedImage.tsx        저작권 보호 이미지 래퍼
│   └── ArtworkLightbox.tsx       전체화면 이미지 라이트박스
│
├── lib/
│   └── artworks.ts               작품·전시 데이터 단일 출처 (여기서만 수정)
│
├── public/
│   └── artworks/                 작품 이미지 (시리즈별 폴더 구조)
│       ├── birds-of-prey/
│       ├── ceramic-home-sweet-home/
│       ├── ceramic-sea-leather/
│       ├── ceramic-see-and-saw/
│       ├── ceramic-stars/
│       ├── individual/
│       ├── masked-up/
│       ├── saic-portfolio/
│       ├── scribbles-on-the-wall/
│       ├── tooth-plate/
│       └── ugly-duckling/
│
└── next.config.ts                이미지 최적화 설정 (WebP/AVIF 자동 변환)
```

---

## 디자인 시스템

### 색상 (CSS 변수 — `globals.css`)

| 변수 | 값 | 용도 |
|---|---|---|
| `--bg` | `#070707` | 메인 배경 (Artti 검정 계승) |
| `--bg-surface` | `#0e0e0e` | 카드·서피스 배경 |
| `--text` | `#ede8e0` | 본문 (따뜻한 오프화이트) |
| `--text-muted` | `#7a7570` | 라벨·날짜 등 부차 텍스트 |
| `--accent` | `#b8956a` | 강조 (도자기 흙빛 앰버 골드) |
| `--border` | `#1c1c1c` | 구분선 |
| `--nav-width` | `220px` | 사이드바 너비 |

### 폰트

| 변수 | 폰트 | 용도 |
|---|---|---|
| `--font-cormorant` | Cormorant Garamond | 제목·작가명·장식 텍스트 |
| `--font-inter` | Inter | 본문·캡션·UI 레이블 |

---

## 이미지 보호 구조 (3중)

```
1. GlobalProtection.tsx
   └─ document.addEventListener('contextmenu', e => e.preventDefault())
   └─ document.addEventListener('dragstart',   e => e.preventDefault())

2. globals.css
   └─ img { user-drag: none; user-select: none; pointer-events: none }

3. 개별 이미지 위 투명 오버레이 div
   └─ 클릭 영역을 물리적으로 차단
```

---

## 데이터 관리 — `lib/artworks.ts`

### 새 작품 시리즈 추가

```typescript
// 1. public/artworks/{새-slug}/ 폴더에 이미지 복사
// 2. artworks 배열에 아래 형태로 추가

{
  id: "new-series",
  title: "시리즈 제목",
  year: 2025,
  medium: "Ceramic",
  category: "ceramic",           // ceramic | painting | drawing | installation | video
  series: "시리즈 표시명",
  seriesSlug: "new-series",      // URL 및 이미지 폴더 경로에 사용
  coverImage: "/artworks/new-series/cover.jpg",
  images: makeImages("new-series", ["image1.jpg", "image2.jpg"]),
  featured: true,                // 홈 Featured Works 표시 여부
}
```

### 새 전시 추가

```typescript
// exhibitions 배열에 추가

{
  id: "2025-exhibition",
  slug: "2025-exhibition",       // URL: /exhibition/2025-exhibition
  title: "전시 제목",
  year: 2025,
  venue: "Gallery Name",
  location: "City, State",
  dateStart: "2025-06",
  description: "전시 설명...",
  artworkSlugs: ["birds-of-prey", "ceramic-stars"],  // 연결할 작품의 seriesSlug
}
```

---

## 배포 (Vercel 권장)

### 1단계 — 프로덕션 빌드 확인

```powershell
npm run build
# 오류 없이 완료되면 배포 준비 완료
```

### 2단계 — Vercel 배포

1. [github.com](https://github.com) 에 리포지토리 생성 후 코드 푸시
2. [vercel.com](https://vercel.com) 접속 → **Add New Project** → GitHub 리포지토리 선택
3. Framework Preset: **Next.js** (자동 감지)
4. **Deploy** 클릭 → 약 2~3분 후 배포 완료
5. `public/artworks/` 이미지도 자동으로 함께 배포됩니다

> **주의:** `public/artworks/` 폴더 크기가 클 경우 Git LFS 사용을 권장합니다.

---

## Artti 디자인 계승 포인트

| 원작 Artti (1999) | 현대적 재해석 |
|---|---|
| 순수 검정 배경 | `#070707` 배경 유지 |
| 신체 부위 이미지를 화면에 분절 배치 | 홈 Hero: 실제 작품 6점을 각도·위치 다르게 35% 투명도로 부유 |
| 이미지 기반 마우스오버 전환 | CSS transition + scale 호버 + amber 오버레이 |
| 고정 좌측 세로 내비게이션 | 220px 고정 사이드바, 현재 페이지에 amber 점 표시 |
| 몽환적·신비로운 분위기 | Cormorant Garamond + `#b8956a` 앰버 액센트 |

---

© CW_ArtHouse. All rights reserved.
