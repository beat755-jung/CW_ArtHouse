# Vercel 배포 가이드 (미리보기용)

다른 컴퓨터와 모바일에서 사이트가 어떻게 보이는지 확인하기 위해 Vercel에 올리는 순서입니다.
프로젝트 코드에서 바꿀 설정은 없습니다. 아래를 순서대로 따라 하면 됩니다.

- 소요 시간: 약 5~10분
- 준비물: GitHub 계정, Vercel 계정(로그인 가능한 상태)

---

## 0. 시작 전 확인

| 항목 | 내용 |
|---|---|
| 배포 대상 | `main` 브랜치 (마지막 커밋: `[16단계] 운송 사진 …`) |
| 올릴 저장소 | `https://github.com/beat755-jung/CW_ArtHouse` |
| 현재 상태 | 로컬 `main`이 위 저장소의 `main`을 추적 중이고, 커밋 1개가 아직 push 되지 않음 (`[16단계]`) |
| 빌드 명령 | `npm run build` (`--webpack` 포함, `package.json`에 이미 설정됨) |
| 검색 노출 | `noindex` 설정 중 → 검색에는 안 잡힘 |
| 주소를 아는 사람 | 누구나 볼 수 있음 (Vercel 보호 설정을 켜지 않은 경우) |

> 이 사이트에는 `[확인 필요]` 항목이 아직 많이 남아 있습니다. 주소는 필요한 사람에게만 공유하세요.

---

## 1. 최신 코드를 GitHub에 올리기

push는 이 프로젝트 규칙상 **직접 실행**합니다.

1. 터미널을 프로젝트 폴더에서 엽니다.
2. 현재 상태를 확인합니다.

   ```bash
   git status
   git log --oneline -3
   ```

   - 작업 폴더가 깨끗하고(`nothing to commit`), 가장 위 커밋이 `[16단계] …`이면 정상입니다.
3. GitHub로 push 합니다.

   ```bash
   git push
   ```

   - push 대상이 위 저장소인지 `git remote -v`로 확인합니다.
   - 처음이면 GitHub 로그인(브라우저 또는 토큰) 창이 뜰 수 있습니다. 로그인할 계정은 저장소 소유 계정입니다.
4. 브라우저에서 GitHub 저장소 페이지를 열어 최신 커밋이 보이는지 확인합니다.
   - `public/images/process/process-transport-01.jpg` 등이 보이면 이미지도 올라간 것입니다.

> 원본 사진(`assets-src/`)은 `.gitignore`로 제외되어 있어 올라가지 않습니다. 정상입니다.

---

## 2. Vercel에서 프로젝트 만들기

1. 브라우저에서 Vercel 대시보드를 엽니다.
   - 본인 팀 페이지: `https://vercel.com/beat755-jungs-projects`
2. 오른쪽 위 **Add New… → Project**를 누릅니다.
3. **Import Git Repository** 목록이 나옵니다.
   - 저장소가 안 보이면 **Adjust GitHub App Permissions**(또는 *Add GitHub Account*)를 눌러 GitHub 계정을 연결하고, `CW_ArtHouse` 저장소 접근을 허용합니다.
4. `CW_ArtHouse` 옆의 **Import**를 누릅니다.
5. **Configure Project** 화면에서 아래처럼 확인합니다.

   | 항목 | 값 |
   |---|---|
   | Project Name | 원하는 이름 (주소가 `이름.vercel.app`이 됨. 소문자·숫자·`-`만 가능) |
   | Framework Preset | **Next.js** (자동 인식) |
   | Root Directory | `./` (그대로) |
   | Build Command | 기본값 그대로 (`npm run build`) |
   | Output Directory | 기본값 그대로 |
   | Install Command | 기본값 그대로 |
   | Environment Variables | **비워둠** (아래 참고) |

   - **환경변수:** 상담 폼 전송용 `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_CONTACT_EMAIL`은 지금 넣지 않습니다. 비워두면 상담 폼은 "온라인 접수 준비 중"으로 표시되고 전송 버튼이 꺼집니다. 이것이 의도된 동작입니다.
6. **Deploy**를 누릅니다.

---

## 3. 배포 진행 확인

1. 빌드 로그가 흐르는 화면이 나옵니다. 보통 1~3분 걸립니다.
2. 끝나면 축하 화면과 함께 사이트 미리보기가 나옵니다.
3. **Continue to Dashboard**를 누르면 프로젝트 화면으로 갑니다.
4. **Domains** 영역(또는 **Visit** 버튼)에서 주소를 확인합니다.
   - 예: `https://<프로젝트명>.vercel.app`
   - 접속하면 `/` → `/ko`로 자동 이동합니다.

---

## 4. 다른 기기에서 확인하기

주소를 휴대폰 브라우저와 다른 컴퓨터에서 엽니다. (카카오톡 "나에게 보내기"로 주소를 보내면 편합니다.)

확인할 곳:

| 페이지 | 주소 | 볼 것 |
|---|---|---|
| 홈 | `/ko` | Hero 이미지, 공정 요약 카드 |
| 제작 과정 | `/ko/process` | 상단 진행 칩(모바일), 사진 주석, **"기초"·"운송" 단계 사진**, 돌출부 접은 상태 비교 4칸 |
| 프로젝트 | `/ko/projects` | 카드 목록, 필터 탭 |
| 프로젝트 상세 | `/ko/projects/prototype-01` | 갤러리, 라이트박스, 도면 탭 |
| 회사 소개 | `/ko/about` | 진행 절차, 문구 줄바꿈 |
| 상담 | `/ko/contact` | 폼, 전송 버튼이 꺼져 있는지 |
| 영어 | `/en`, `/en/process` | 영어 문구 누락 여부 |

모바일에서 특히 볼 것:

- 좌측 사이드바(220px)가 메뉴로 바뀌어 잘 열리고 닫히는지
- 큰 사진이 느리게 뜨지 않는지 (이미지가 40MB 정도입니다)
- 글자가 잘리거나 겹치는 곳이 없는지
- 사진을 탭했을 때 라이트박스가 열리는지

이상한 곳은 **화면 캡처 + 어느 페이지인지**를 메모해 두었다가 Claude에게 전달하면 됩니다.

---

## 5. 접속할 때 로그인을 요구하는 경우

다른 컴퓨터나 휴대폰에서 Vercel 로그인 화면이 뜨면 **Deployment Protection**이 켜져 있는 것입니다.

1. Vercel 대시보드 → 해당 프로젝트 → **Settings → Deployment Protection**
2. 선택지
   - **Vercel Authentication 끄기:** 주소를 아는 누구나 볼 수 있음 (확인용으로 가장 간단)
   - **켜둔 채로 확인:** 확인하는 기기에서 Vercel에 로그인해서 열기
3. 변경 후 **Save**. 몇 초 뒤 다시 접속해 봅니다.

> 확인이 끝나면 다시 켜 두는 것을 권장합니다 (공개 전까지).

---

## 6. 고친 뒤 다시 배포하기

- 코드를 고치고 커밋한 뒤 `git push github main`을 하면 **자동으로 다시 배포**됩니다.
- 대시보드의 **Deployments** 탭에서 진행 상태를 볼 수 있습니다.
- 브랜치를 따로 만들어 push 하면 그 브랜치 전용 미리보기 주소가 생깁니다.

---

## 7. 문제가 생겼을 때

| 증상 | 확인 |
|---|---|
| 빌드 실패 (`Build Failed`) | 로그 맨 아래 오류를 확인. 로컬에서 `npm run lint`, `npm run build`가 통과하는지 먼저 확인 |
| 저장소가 Import 목록에 없음 | GitHub App 권한에서 `CW_ArtHouse` 저장소 접근 허용 |
| 이미지가 깨져 보임 | GitHub에 `public/images/…` 파일이 올라갔는지 확인 (`git push github main` 했는지) |
| 주소 접속 시 404 | 주소 끝에 `/ko`를 붙여 접속. `/` 리다이렉트는 `next.config.ts` 설정 |
| 접속 시 로그인 화면 | 5번 항목 참고 |
| `git push`가 거부됨 | `git remote -v`로 push 대상이 위 저장소인지 확인. 원격에 먼저 올라간 커밋이 있으면 Claude에게 상태를 알려주세요 |
| `git push`가 인증 오류 | 로그인 창이 안 뜨면 GitHub 개인 액세스 토큰(PAT)으로 인증 |

---

## 8. 공개(정식 오픈) 전에 할 일

미리보기 확인 단계에서는 필요 없고, 실제로 공개할 때 처리합니다.

- `[확인 필요]` 항목 채우기 → `docs/prelaunch/00-to-confirm.md`, `01-content-checklist.md`
- `noindex` 제거 (검색 노출 시작) → `app/[locale]/layout.tsx`, `docs/prelaunch/02-seo.md`
- 상담 폼 전송 방식 설정 (환경변수) → 이 문서 2-5번, `lib/company.ts`의 `getFormDelivery()`
  - 폼 전송 서비스를 쓰면 개인정보 국외 이전 고지를 동의 문구에 추가해야 합니다.
- 도메인 연결: Vercel 프로젝트 → **Settings → Domains**
- 배포 전 점검(SEO·접근성·성능) → `docs/prelaunch/`
