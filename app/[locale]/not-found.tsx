/**
 * app/[locale]/not-found.tsx — 언어 세그먼트 안의 404 (notFound() 호출 시)
 *
 * - 현재 정적 생성(dynamicParams=false)이라 없는 경로는 대부분 global-not-found 로 간다. 데이터를 동적으로 불러올 때를 대비해 유지
 * - 사이드바(레이아웃)는 그대로 유지되고 본문은 global-not-found 와 같다 (components/NotFoundContent)
 */
import NotFoundContent from "@/components/NotFoundContent";

export default function LocaleNotFound() {
  return <NotFoundContent />;
}
