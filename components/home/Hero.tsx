/**
 * components/home/Hero.tsx — 홈 Hero 섹션 (서버 컴포넌트)
 *
 * [목표] 첫 화면 3초 안에 "미니하우스를 설계·제작해서 파는 회사"로 인지
 * - H1(시안 C) + 보조 문장(대상 고객) + CTA 2개(상담·견적 문의 / 제작 과정 보기)
 *
 * [부유 이미지 — docs/image-inventory.md 4-1절 추천 8장]
 * - 왼쪽 위에서 시계 방향: 콘셉트(out-08) → 외관 제작(ing-05·08·02) → 실내 공정(ing-18·11)
 *   → 완성 분위기(in-07·09). "짓는 과정이 있는 집"으로 읽히도록 배치
 * - 모바일(< md)에서는 4장(out-08·ing-05·ing-18·in-07)만 상·하단에 작게 표시
 * - out-08: 사용자가 렌더 부분만 잘라 교체한 out-08-render-view.jpg (826×565, 휴대폰 UI 없음) — 3:2 프레임
 * - in-09 : 3:4 프레임 + 오른쪽 정렬로 창밖 아파트가 보이지 않음
 * - 렌더와 실사가 섞여 있으므로 하단에 "일부 이미지는 콘셉트 렌더" 표기 (CLAUDE.md)
 *
 * [가독성 — WCAG AA]
 * - 텍스트 뒤 스크림(rgba(7,7,7,0.9) 중심). 이미지 opacity 0.35 와 합쳐
 *   가장 밝은 픽셀 위에서도 본문 대비 15:1 이상, 보조색(--text-muted) 5:1 이상
 *
 * [애니메이션 — globals.css]
 * - 등장: CSS 애니메이션(.hero-in / .hero-frag) — JS 없이 바로 표시 (H1 지연 없음)
 * - 부유: .hero-float (상하 몇 px, 이미지마다 주기·위상 다름)
 * - prefers-reduced-motion: reduce → 등장·부유 애니메이션 모두 정지
 *
 * [로딩]
 * - 모바일에도 보이는 4장: preload (Next 16 에서 priority 대체)
 * - 데스크톱 전용 4장: loading="eager" + fetchPriority="low"
 *   (React 19 는 lazy 가 아닌 <img> 에 preload 힌트를 자동 삽입 → low 로 지정해 H1·CSS 와 경쟁 방지)
 */
import Image from "next/image";
import CtaLink from "@/components/CtaLink";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";

const P1 = "/projects/prototype-01";

interface Fragment {
  src: string;
  /** 프레임 비율 */
  ratio: string;
  /** object-position (크롭 위치) */
  position: string;
  /** 위치·크기 (모바일 기본 → md: 데스크톱) */
  className: string;
  rotate: number;
  /** 등장 지연(s) */
  delay: number;
  /** 부유 주기(s) */
  float: number;
  /** 모바일에서도 표시 → preload */
  mobile: boolean;
}

// 왼쪽 위에서 시계 방향 순서
const fragments: Fragment[] = [
  // ① 콘셉트 렌더 (야간)
  {
    src: `${P1}/exterior/out-08-render-view.jpg`, ratio: "3/2", position: "center",
    className: "top-2 left-[4%] w-[36vw] md:top-[6%] md:left-[3%] md:w-[19vw]",
    rotate: -2, delay: 0.15, float: 9, mobile: true,
  },
  // ② 외관 제작 — 견인부 쪽 끝
  {
    src: `${P1}/process/ing-05.jpg`, ratio: "4/3", position: "center",
    className: "top-2 right-[4%] w-[36vw] md:top-[5%] md:right-[4%] md:w-[21vw]",
    rotate: 2, delay: 0.3, float: 11, mobile: true,
  },
  // ③ 외관 제작 — 측면 입면
  {
    src: `${P1}/process/ing-08.jpg`, ratio: "4/3", position: "center",
    className: "hidden md:block md:top-[34%] md:right-[2%] md:w-[15vw]",
    rotate: -1.5, delay: 0.45, float: 10, mobile: false,
  },
  // ④ 창호·출입문
  {
    src: `${P1}/process/ing-02.jpg`, ratio: "4/3", position: "center",
    className: "hidden md:block md:top-[57%] md:right-[8%] md:w-[13vw]",
    rotate: 1.5, delay: 0.6, float: 12, mobile: false,
  },
  // ⑤ 실내 공정 — 다락
  {
    src: `${P1}/process/ing-18.jpg`, ratio: "4/3", position: "center",
    className: "bottom-2 right-[4%] w-[36vw] md:bottom-[5%] md:right-[3%] md:w-[17vw]",
    rotate: -2, delay: 0.75, float: 9.5, mobile: true,
  },
  // ⑥ 실내 공정 — 빛이 드는 돌출부
  {
    src: `${P1}/process/ing-11.jpg`, ratio: "4/3", position: "center",
    className: "hidden md:block md:bottom-[4%] md:left-[26%] md:w-[13vw]",
    rotate: 2.5, delay: 0.9, float: 10.5, mobile: false,
  },
  // ⑦ 완성 분위기 — 거실 (렌더)
  {
    src: `${P1}/interior/in-07.jpg`, ratio: "3/2", position: "center",
    className: "bottom-2 left-[4%] w-[36vw] md:bottom-[14%] md:left-[3%] md:w-[17vw]",
    rotate: 1.5, delay: 1.05, float: 11.5, mobile: true,
  },
  // ⑧ 완성 분위기 — 주방 (렌더, 창밖 제외 크롭)
  {
    src: `${P1}/interior/in-09.jpg`, ratio: "3/4", position: "right",
    className: "hidden md:block md:top-[30%] md:left-[3%] md:w-[10vw]",
    rotate: -1.5, delay: 1.2, float: 12.5, mobile: false,
  },
];

interface Props {
  locale: Locale;
  home: Dictionary["home"];
}

export default function Hero({ locale, home }: Props) {
  return (
    <section className="relative min-h-[calc(100svh-64px)] md:min-h-screen flex items-start md:items-center justify-center overflow-hidden bg-[var(--bg)]">
      {/* Floating image fragments (decorative) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {fragments.map((f, i) => (
          <div
            key={f.src}
            className={`absolute hero-frag ${f.className}`}
            style={{ rotate: `${f.rotate}deg`, animationDelay: `${f.delay}s` }}
          >
            <div
              className="hero-float relative overflow-hidden"
              style={{
                aspectRatio: f.ratio,
                animationDuration: `${f.float}s`,
                animationDelay: `${-i * 1.3}s`,
              }}
            >
              <Image
                src={f.src}
                alt=""
                fill
                className="object-cover select-none"
                style={{ objectPosition: f.position }}
                sizes={f.mobile ? "(max-width: 767px) 36vw, 21vw" : "15vw"}
                draggable={false}
                // eager 만 주면 React 19 가 SSR 시 <link rel="preload"> 를 자동 삽입하므로
                // 데스크톱 전용 이미지는 fetchPriority="low" 로 자동 preload 를 막는다
                {...(f.mobile
                  ? { preload: true }
                  : { loading: "eager" as const, fetchPriority: "low" as const })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Scrim — desktop: radial (center text) */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 46% 52% at 50% 50%, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.9) 55%, rgba(7,7,7,0) 100%)",
        }}
        aria-hidden
      />
      {/* Scrim — mobile: vertical band behind text */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,7,7,0.2) 0%, rgba(7,7,7,0.9) 20%, rgba(7,7,7,0.9) 80%, rgba(7,7,7,0.2) 100%)",
        }}
        aria-hidden
      />

      {/* Text */}
      <div className="relative z-10 w-full max-w-3xl px-6 pt-[132px] pb-[124px] md:py-24 text-center">
        <p
          className="hero-in text-[11px] md:text-xs tracking-[0.35em] uppercase text-[var(--text-muted)] mb-4 md:mb-6"
          style={{ animationDelay: "0.05s" }}
        >
          {home.eyebrow}
        </p>

        <h1
          className="hero-in font-korean text-[1.875rem] leading-[1.22] md:text-[clamp(2.5rem,3.6vw,3.5rem)] md:leading-[1.18] tracking-[0.01em] text-[var(--text)] mb-4 md:mb-6 [word-break:keep-all]"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="block">{home.titleLine1}</span>
          <span className="block">
            {home.titleLine2.map((chunk, i) => (
              <span key={chunk}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">{chunk}</span>
              </span>
            ))}
          </span>
        </h1>

        <p
          className="hero-in text-[15px] md:text-base leading-relaxed text-[var(--text)]/85 max-w-xl mx-auto mb-7 md:mb-10 [word-break:keep-all] text-balance"
          style={{ animationDelay: "0.3s" }}
        >
          {home.subtitle}
        </p>

        <div
          className="hero-in flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4"
          style={{ animationDelay: "0.45s" }}
        >
          <CtaLink href={localePath(locale, "/contact")} variant="primary" className="w-full sm:w-auto">
            {home.ctaPrimary}
          </CtaLink>
          <CtaLink href={localePath(locale, "/process")} variant="secondary" className="w-full sm:w-auto">
            {home.ctaSecondary}
          </CtaLink>
        </div>

        <p
          className="hero-in mt-4 md:mt-8 text-[11px] tracking-wide text-[var(--text-muted)]"
          style={{ animationDelay: "0.6s" }}
        >
          {home.renderNote}
        </p>
      </div>

      {/* Scroll hint (desktop) */}
      <div
        className="hero-in absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ animationDelay: "1.4s" }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)]">
          {home.scroll}
        </span>
        <span className="block w-px h-10 bg-[var(--border)] motion-safe:animate-pulse" />
      </div>
    </section>
  );
}
