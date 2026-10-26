# 02. SEO — 현황과 적용 계획

- 작성: 2026-10-26 (배포 전 점검). **이 문서는 계획이며 아직 코드에 반영하지 않았습니다.**
- 적용 시 Next 16 파일 규칙(`app/sitemap.ts`, `app/robots.ts`, `generateMetadata`의 `alternates`)을 사용합니다.
- 기준: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` (AGENTS.md 규칙)

## 1. 현황 (운영 빌드로 측정)

| 페이지 | title | description | canonical | hreflang | OG 이미지 | JSON-LD |
|---|---|---|---|---|---|---|
| `/ko` · `/en` | CW_ArtHouse | 있음 (14자 · 34자로 짧음) | ✗ | ✗ | ✗ | ✗ |
| `/[locale]/process` | 제작 과정 / Process | 사이트 기본값 (짧음) | ✗ | ✗ | ✗ | ✗ |
| `/[locale]/projects` | 프로젝트 / Projects | 있음 | ✗ | ✗ | ✗ | ✗ |
| `/[locale]/projects/prototype-01` | **"[확인 필요]"** | 있음 (짧음) | ✗ | ✗ | 대표 외관 사진 (주소가 localhost) | ✗ |
| `/[locale]/about` | 회사 소개 / About | 있음 | ✗ | ✗ | ✗ | ✗ |
| `/[locale]/contact` | 상담·견적 문의 | 있음 | ✗ | ✗ | ✗ | ✗ |

| 항목 | 현황 |
|---|---|
| `sitemap.xml` | 404 (없음) |
| `robots.txt` | 404 (없음) |
| robots 메타 | 모든 페이지 `noindex, nofollow` (공개 전까지 의도적으로 유지 중) |
| `metadataBase` | `NEXT_PUBLIC_SITE_URL` 없으면 `http://localhost:3000` → OG 주소가 localhost |
| `<html lang>` | ko / en 정상 |

## 2. 적용 계획

### 2-1. 사이트 주소와 색인 스위치 (먼저 결정 필요)

| 환경변수 | 값 | 효과 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 실제 도메인 (예: `https://cw-arthouse.com`) | canonical · hreflang · sitemap · OG 절대 주소 |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` 일 때만 색인 허용 | robots 메타 `index, follow` + robots.txt `Allow: /` + sitemap 노출. 없으면 지금처럼 차단 |

→ **도메인이 정해지고 `[확인 필요]` 항목(특히 프로젝트명)이 채워진 뒤** `ALLOW_INDEXING=true`로 켭니다.

### 2-2. 페이지별 title · description (ko / en)

확인된 사실만 씁니다. 수치·가격·인허가 표현 없음.

| 페이지 | title (ko / en) | description 초안 (ko) | description 초안 (en) |
|---|---|---|---|
| 홈 | CW_ArtHouse — 미니하우스 설계·제작·판매 / Mini house design, build & sales | 주택 마당의 별채부터 농장의 휴게 공간까지, 미니하우스를 설계·제작해 판매합니다. 제작 과정을 사진으로 공개합니다. | We design, build and sell mini houses — from garden annexes to farm rest spaces — and publish each build step in photos. |
| 제작 과정 | 제작 과정 / Process | 기초부터 준공·검수까지 9단계 공정과 단계별 확인 항목을 제작 현장 사진으로 보여드립니다. | Nine build steps from foundation to inspection, shown with photos from the build site. |
| 프로젝트 | 프로젝트 / Projects | CW_ArtHouse가 설계·제작한 미니하우스 프로젝트. | Mini house projects designed and built by CW_ArtHouse. |
| 프로젝트 상세 | {프로젝트명} / {name} | {프로젝트명} — 유형·연면적 등 확인된 사양만 자동 조합 | same |
| 회사 소개 | 회사 소개 / About | 미니하우스 설계·제작·판매 회사 CW_ArtHouse(대표 정창원)의 제작 방식과 진행 절차. | How CW_ArtHouse (founder Jung Chang-Won) builds mini houses and runs a project. |
| 상담·견적 | 상담·견적 문의 / Consultation & Quote | 설치 예정 지역과 용도를 알려 주시면 상담해 드립니다. | Tell us the site and intended use, and we will get in touch. |

### 2-3. canonical · hreflang

모든 페이지의 `generateMetadata`에 추가:

```ts
alternates: {
  canonical: `/${locale}${path}`,
  languages: { ko: `/ko${path}`, en: `/en${path}`, "x-default": `/ko${path}` },
},
```

### 2-4. sitemap.xml (`app/sitemap.ts`)

- 대상: 6개 경로 × ko/en = 12개 URL (+ 프로젝트가 늘면 자동 추가)
- 각 항목에 `alternates.languages` (ko/en) 포함
- `ALLOW_INDEXING`이 꺼져 있으면 빈 목록

### 2-5. robots.txt (`app/robots.ts`)

```text
# ALLOW_INDEXING=true
User-agent: *
Allow: /
Sitemap: {SITE_URL}/sitemap.xml

# 그 외 (지금)
User-agent: *
Disallow: /
```

### 2-6. OG 이미지

| 페이지 | 이미지 |
|---|---|
| 프로젝트 상세 | `Project.cover` (대표 외관 사진) — 이미 적용, 주소만 도메인 설정 필요 |
| 나머지 | 제작 현장 실사 대표 사진 (ING-05, `/images/process/process-exterior-29.jpg`) |

렌더(콘셉트·분위기 예시)는 OG 대표 이미지로 쓰지 않습니다 (실물처럼 보일 수 있음).

### 2-7. JSON-LD — `HomeAndConstructionBusiness`

홈(`/ko`, `/en`)에 한 번. **값이 `null`인 항목은 넣지 않습니다** (`lib/company.ts`가 채워지면 자동 추가).

| 속성 | 출처 | 지금 |
|---|---|---|
| `@type` | `HomeAndConstructionBusiness` | 넣음 |
| `name` | CW_ArtHouse (확정) | 넣음 |
| `url` | `NEXT_PUBLIC_SITE_URL` | 도메인 설정 후 |
| `founder` | `{ "@type": "Person", "name": "정창원 (Jung Chang-Won)" }` (확정) | 넣음 |
| `description` | 홈 description | 넣음 |
| `image` | ING-05 | 넣음 |
| `legalName` | `companyInfo.legalName` | **생략** (null) |
| `address` | `companyInfo.address` | **생략** (null) |
| `telephone` | `contactChannels.phone` | **생략** (null) |
| `email` | `contactChannels.email` | **생략** (null) |
| `taxID` | `companyInfo.businessNumber` | **생략** (null) |
| `sameAs` | 카카오톡 채널 등 | **생략** (null) |

평점·리뷰·가격대(`aggregateRating`, `priceRange`)는 근거가 없으므로 넣지 않습니다.

## 3. 적용 순서 제안

1. 도메인 확정 → `NEXT_PUBLIC_SITE_URL`
2. 위 2-2 ~ 2-7 코드 반영 (색인 스위치는 꺼진 상태로)
3. 프로젝트명 등 [확인 필요] 채우기 ([01-content-checklist.md](01-content-checklist.md))
4. `NEXT_PUBLIC_ALLOW_INDEXING=true` → 배포 → Google Search Console에 sitemap 제출
5. 검증: [리치 결과 테스트](https://search.google.com/test/rich-results), `curl {SITE_URL}/robots.txt`, `/sitemap.xml`
