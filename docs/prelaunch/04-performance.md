# 04. 성능 — 점검 결과와 Lighthouse 측정 방법

- 작성: 2026-10-26 (운영 빌드 `npm run build` + `next start` 기준)

## 1. 점검 결과

| 항목 | 결과 | 조치 |
|---|---|---|
| 홈 Hero (LCP) | 모바일에도 보이는 부유 이미지 4장 `preload`, 데스크톱 전용 4장 `eager + fetchPriority=low`. H1 텍스트는 JS 없이 CSS 애니메이션으로 즉시 표시 → LCP는 H1 텍스트일 가능성이 높음 | 변경 없음 |
| 이미지 `sizes` | 주요 `next/image` 모두 지정 (Hero · 카드 · 갤러리 · 라이트박스 · 공정 썸네일) | 변경 없음 |
| 이미지 용량 | 원본 220 MB → 결과 36 MB, 긴 변 2400px, 메타데이터 제거 (`docs/image-report.md`). 화면 크기별 사본은 Next 이미지 최적화가 자동 생성 (WebP/AVIF) | 변경 없음 |
| `quality` 속성 | Next 16 기본 허용값은 75뿐 — 코드에 다른 값이 남아 있지 않음 | 확인만 |
| 3D 개념 모델 (three.js, 약 546 KB) | **처음 페이지를 열 때 로드되지 않음** — 버튼을 누를 때 `import()`로 불러옴. 프로젝트 상세 첫 로드 JS 합계 약 561 KB (three 제외) | 변경 없음 (점검 초기 판단 정정) |
| 폰트 | Cormorant Garamond · Inter: latin subset만. Noto Serif/Sans KR: Google 분할 파일, `preload: false` → 페이지에 쓰인 한글 조각만 다운로드 (페이지당 한글 약 200~350 KB, 브라우저 캐시) | 변경 없음 |
| 영문 폰트 preload | webpack 빌드(`--webpack`)에서는 영문 폰트 preload 태그가 생성되지 않음 (Turbopack 빌드에서는 생성됨). 첫 화면에서 영문 제목이 기본 글꼴로 잠깐 보였다 바뀔 수 있음 | 빌드 방식 변경은 별도 단계 |
| 정적 생성 | 15개 경로 모두 빌드 시 생성 (서버 계산 없음) | — |

## 2. Lighthouse 모바일 점수 확인 방법

**반드시 운영 빌드로 측정합니다** (`npm run dev`는 최적화가 꺼져 있어 점수가 낮게 나옵니다).

```powershell
npm run build
npx next start -p 3000
```

### 방법 A — Chrome 개발자 도구

1. Chrome(시크릿 창 권장, 확장 프로그램 영향 제거)에서 `http://localhost:3000/ko` 열기
2. `F12` → **Lighthouse** 탭
3. Mode: **Navigation** · Device: **Mobile** · Categories: Performance, Accessibility, Best Practices, SEO
4. **Analyze page load**

### 방법 B — 명령줄 (lighthouse 패키지를 내려받음)

```powershell
npx lighthouse http://localhost:3000/ko --form-factor=mobile --screenEmulation.mobile --output=html --output-path=./lighthouse-ko.html --view
```

결과 HTML은 git에 넣지 않습니다.

### 측정 권장 페이지

| 페이지 | 이유 |
|---|---|
| `/ko` | Hero 부유 이미지 8장 |
| `/ko/process` | 이미지가 가장 많음 (썸네일 + 주석 사진) |
| `/ko/projects/prototype-01` | 갤러리 · 도면 · 3D 뷰어 버튼 |

### 참고

- 로컬 측정은 네트워크가 빨라 실제보다 좋게 나올 수 있습니다. 배포 후 [PageSpeed Insights](https://pagespeed.web.dev/)로 실제 주소를 한 번 더 측정하세요.
- SEO 점수는 지금 `noindex` 때문에 낮게 나옵니다 (의도된 상태, [02-seo.md](02-seo.md)).
