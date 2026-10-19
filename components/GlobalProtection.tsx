/**
 * components/GlobalProtection.tsx — 전역 이미지 보호 (클라이언트 컴포넌트)
 *
 * [역할]
 * - document 레벨에서 contextmenu(우클릭) 이벤트 차단
 * - document 레벨에서 dragstart(드래그) 이벤트 차단
 * - layout.tsx 에 마운트되어 모든 페이지에 적용
 *
 * [보호 구조 (3중)]
 * 1. GlobalProtection    : document 이벤트 리스너 (가장 광범위)
 * 2. globals.css img     : CSS user-drag:none / pointer-events:none
 * 3. 이미지 위 오버레이 div : 개별 이미지 클릭 영역 물리적 차단
 *
 * [렌더링]
 * - null 반환 — DOM에 실제 요소를 추가하지 않습니다
 */
"use client";

import { useEffect } from "react";

export default function GlobalProtection() {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}
