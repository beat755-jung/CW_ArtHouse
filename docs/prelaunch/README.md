# 배포 전 점검 (2026-10-26)

| 문서 | 내용 | 상태 |
|---|---|---|
| [01-content-checklist.md](01-content-checklist.md) | 채워 주셔야 할 `[확인 필요]` 항목표 (회사·연락처·사양·공정 31건·준비 중 사진 12컷·동의 문구) | **입력 필요** |
| [02-seo.md](02-seo.md) | title·description·canonical·hreflang·sitemap·robots·OG·JSON-LD 현황과 적용 계획 | 계획 (미반영) — 도메인 확정 필요 |
| [03-accessibility.md](03-accessibility.md) | WCAG AA 점검, 라이트박스 대화상자·대비·본문 바로가기 | 반영 완료 + 사람 확인 4건 |
| [04-performance.md](04-performance.md) | LCP·이미지·폰트·3D 뷰어 점검, Lighthouse 측정 방법 | 점검 완료 (코드 변경 없음) |
| [05-image-protection.md](05-image-protection.md) | 전역 우클릭 차단 제거 + 실사 워터마크 | 반영 완료 |
| [06-code-cleanup.md](06-code-cleanup.md) | 미사용 패키지·작가 사이트 잔재 | 점검 완료 (미반영, 승인 대기) |

404 페이지 재디자인과 README 전면 재작성도 이번 점검에서 반영했습니다.

## 배포를 막는 항목

1. `NEXT_PUBLIC_SITE_URL` 미설정 → OG 이미지 주소가 localhost
2. 모든 페이지 `noindex` (의도적으로 유지 중) → 검색 노출 안 됨
3. 프로젝트명 `[확인 필요]` → 상세 페이지 제목·OG 노출
4. 상담 폼 전송 방식 미설정 → 문의 접수 불가
