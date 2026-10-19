/**
 * components/home/ContactCta.tsx — 문의 유도 섹션 (서버 컴포넌트)
 *
 * - 대상 고객(주택 마당 별채 · 농장 휴게 공간)을 질문형으로 짚고 상담·견적 문의로 연결
 * - 연락처(전화·이메일)는 [확인 필요] — 확인 전 표시하지 않음
 */
import CtaLink from "@/components/CtaLink";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";

interface Props {
  locale: Locale;
  home: Dictionary["home"];
}

export default function ContactCta({ locale, home }: Props) {
  return (
    <section aria-labelledby="contact-cta-heading" className="border-t border-[var(--border)] px-6 md:px-8 py-20 md:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="contact-cta-heading"
          className="font-korean text-[1.6rem] md:text-[clamp(1.9rem,3vw,2.6rem)] leading-snug text-[var(--text)] [word-break:keep-all] text-balance"
        >
          {home.contactHeading}
        </h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-[var(--text-muted)] [word-break:keep-all]">
          {home.contactBody}
        </p>
        <div className="mt-8 md:mt-10 flex justify-center">
          <CtaLink href={localePath(locale, "/contact")} variant="primary" className="w-full sm:w-auto">
            {home.ctaPrimary}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
