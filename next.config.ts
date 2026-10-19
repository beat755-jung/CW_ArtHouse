/**
 * next.config.ts — Next.js 설정
 *
 * [이미지 최적화]
 * - WebP / AVIF 포맷 자동 변환으로 파일 크기 최소화
 * - deviceSizes: 반응형 srcset 생성 기준 해상도 (모바일 → 4K)
 * - imageSizes: <Image fill /> 외 고정 크기 이미지용 srcset 기준
 * - 원본 고화질 파일은 Next.js Image 서버를 통해서만 제공되므로
 *   직접 URL 접근으로 고해상도 원본을 얻기 어렵습니다.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [256, 384, 512, 640],
  },
};

export default nextConfig;
