/**
 * components/process/ProcessStepSection.tsx — 공정 단계 한 섹션 (서버 컴포넌트)
 *
 * [구성]
 * - 머리: 단계 번호 · 이름 · 사진 기록일 범위 · 사진 수
 * - 왼쪽(xl+): StepMedia — 대표 사진(주석) + 주석 추가 사진 + 썸네일 + "사진 준비 중"
 * - 오른쪽: 무엇을 하는 단계인지 / 사진에서 확인된 자재 / 품질관리 포인트
 * - comparison 이 있으면 아래에 상태 비교 (예: 돌출부 펼침·접힘)
 *
 * [데이터]
 * - lib/projects.ts processSteps · getStepImages() / lib/annotations.ts
 * - 대표 사진: step.image → 없으면 그 단계의 첫 사진
 * - 날짜는 "사진 기록일" — 공사 기간이 아니다
 */
import Image from "next/image";
import EvidenceLink from "@/components/process/EvidenceLink";
import StepMedia, { type MediaItem } from "@/components/process/StepMedia";
import { getAnnotations } from "@/lib/annotations";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";
import {
  formatShotDate,
  getDateRange,
  getStepImages,
  imageId,
  isPortrait,
  UNCONFIRMED,
  type EvidenceItem,
  type ProcessStep,
  type ProjectImage,
} from "@/lib/projects";

interface Props {
  step: ProcessStep;
  locale: Locale;
  labels: Dictionary["process"];
  preloadLead?: boolean;
  children?: React.ReactNode;
}

function toMediaItem(img: ProjectImage, locale: Locale): MediaItem {
  const id = imageId(img.src);
  const parts = [img.alt[locale], id.toUpperCase(), img.date ? formatShotDate(img.date) : null].filter(Boolean);
  return {
    id,
    src: img.src,
    alt: img.alt[locale],
    caption: parts.join(" · "),
    annotations: getAnnotations(img.src),
    portrait: isPortrait(img.src),
  };
}

function formatRange(range: { from: string; to: string }): string {
  const from = formatShotDate(range.from);
  if (range.from === range.to) return from;
  // 같은 해면 두 번째 날짜의 연도 생략
  const to = formatShotDate(range.to);
  return from.slice(0, 4) === to.slice(0, 4) ? `${from} – ${to.slice(5)}` : `${from} – ${to}`;
}

function StatusBadge({ status, locale, labels }: { status: EvidenceItem["status"]; locale: Locale; labels: Dictionary["process"] }) {
  return status === "observed" ? (
    <span className="shrink-0 inline-flex items-center justify-center gap-1 w-[6.75rem] py-0.5 border border-[var(--accent)]/60 text-[10px] tracking-wide text-[var(--accent)]">
      <span aria-hidden>✓</span>
      {labels.observed}
    </span>
  ) : (
    <span className="shrink-0 inline-flex items-center justify-center w-[6.75rem] py-0.5 border border-[var(--border)] text-[10px] tracking-wide text-[var(--text-muted)]">
      {UNCONFIRMED[locale]}
    </span>
  );
}

function EvidenceList({ items, locale, labels }: { items: EvidenceItem[]; locale: Locale; labels: Dictionary["process"] }) {
  return (
    <ul className="list-none m-0 p-0 border-t border-[var(--border)]">
      {items.map((item) => (
        <li key={item.text.ko} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-[var(--border)]">
          <StatusBadge status={item.status} locale={locale} labels={labels} />
          <div className="min-w-0">
            <p className="m-0 text-sm leading-relaxed text-[var(--text)] [word-break:keep-all]">{item.text[locale]}</p>
            {item.evidence && item.evidence.length > 0 && (
              <p className="m-0 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--text-muted)]">
                <span>{labels.evidence}</span>
                {item.evidence.map((id) => (
                  <EvidenceLink key={id} id={id} label={`${labels.openPhoto}: ${id.toUpperCase()}`} />
                ))}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3">{children}</h3>;
}

export default function ProcessStepSection({ step, locale, labels, preloadLead, children }: Props) {
  const stepImages = getStepImages(step.code);
  const lead = step.image ?? stepImages[0] ?? null;
  const rest = stepImages.filter((img) => img.src !== lead?.src);
  const extras = rest.filter((img) => getAnnotations(img.src).length > 0);
  const thumbs = rest.filter((img) => !extras.includes(img));
  const ordered = [...(lead ? [lead] : []), ...extras, ...thumbs];
  const items = ordered.map((img) => toMediaItem(img, locale));
  const range = getDateRange(stepImages);
  const number = String(step.order).padStart(2, "0");
  const otherName = locale === "ko" ? step.name.en : null;

  return (
    <section
      id={step.code}
      aria-labelledby={`${step.code}-title`}
      className="scroll-mt-32 lg:scroll-mt-12 py-14 md:py-20 border-t border-[var(--border)] first:border-t-0 first:pt-4"
    >
      <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-8 md:mb-10">
        <span className="font-display text-4xl md:text-5xl leading-none lining-nums tabular-nums text-[var(--accent)]">{number}</span>
        <h2 id={`${step.code}-title`} className="font-korean text-2xl md:text-3xl text-[var(--text)] [word-break:keep-all]">
          {step.name[locale]}
        </h2>
        {otherName && <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">{otherName}</span>}
        <span className="basis-full xl:basis-auto xl:ml-auto text-xs text-[var(--text-muted)]">
          {range ? `${labels.recordLabel} ${formatRange(range)} · ${labels.photoCount.replace("{n}", String(stepImages.length))}` : labels.photoPending}
        </span>
      </header>

      <div className="grid gap-10 xl:gap-12 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <StepMedia
          items={items}
          featured={(lead ? 1 : 0) + extras.length}
          pending={step.pendingShots.map((p) => p[locale])}
          locale={locale}
          preloadLead={preloadLead}
          labels={{
            photoPending: labels.photoPending,
            noPhotosYet: labels.noPhotosYet,
            morePhotos: labels.morePhotos,
            openPhoto: labels.openPhoto,
            annotationsLabel: labels.annotationsLabel,
            annotateHint: labels.annotateHint,
          }}
        />

        <div className="min-w-0 space-y-9">
          {step.description && (
            <div>
              <SubHeading>{labels.whatHeading}</SubHeading>
              <p className="m-0 text-[15px] leading-[1.8] text-[var(--text)]/90 [word-break:keep-all]">{step.description[locale]}</p>
            </div>
          )}
          {step.materials.length > 0 && (
            <div>
              <SubHeading>{labels.materialsHeading}</SubHeading>
              <EvidenceList items={step.materials} locale={locale} labels={labels} />
            </div>
          )}
          <div>
            <SubHeading>{labels.qcHeading}</SubHeading>
            <EvidenceList items={step.qcPoints} locale={locale} labels={labels} />
          </div>
        </div>
      </div>

      {children && <div className="mt-14">{children}</div>}
      {step.comparison && (
        <div className="mt-14">
          <SubHeading>{labels.compareHeading}</SubHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {step.comparison.items.map(({ image, label }) => {
              const id = imageId(image.src);
              return (
                <figure key={image.src} className="m-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)]">
                    <Image
                      src={image.src}
                      alt={image.alt[locale]}
                      fill
                      sizes="(max-width: 640px) 90vw, 30vw"
                      className="object-cover select-none"
                      draggable={false}
                    />
                  </div>
                  <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-3 text-xs text-[var(--text-muted)]">
                    <span className="font-korean text-base text-[var(--text)]">{label[locale]}</span>
                    <span>{[id.toUpperCase(), image.date ? formatShotDate(image.date) : null].filter(Boolean).join(" · ")}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-[var(--text-muted)] [word-break:keep-all]">{step.comparison.note[locale]}</p>
        </div>
      )}
    </section>
  );
}
