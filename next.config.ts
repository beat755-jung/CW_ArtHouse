/**
 * next.config.ts — Next.js 설정
 *
 * [이미지 최적화]
 * - WebP / AVIF 포맷 자동 변환으로 파일 크기 최소화
 * - deviceSizes: 반응형 srcset 생성 기준 해상도 (모바일 → 4K)
 * - imageSizes: <Image fill /> 외 고정 크기 이미지용 srcset 기준
 *
 * [다국어]
 * - redirects: "/" → "/ko" (307 임시 이동 — 기본 언어·방식 변경 여지를 남김)
 *
 * [404]
 * - experimental.globalNotFound: 루트 레이아웃이 app/[locale] 동적 세그먼트이므로
 *   매칭되지 않는 URL은 app/global-not-found.tsx 로 처리 (Next 16 문서 권장)
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [256, 384, 512, 640],
  },
  async redirects() {
    return [{ source: "/", destination: "/ko", permanent: false }];
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
