/**
 * components/contact/ContactForm.tsx — 상담·견적 문의 폼 (클라이언트 컴포넌트)
 *
 * [필드]
 * - 필수: 이름 · 연락처 · 문의 내용 · 개인정보 수집·이용 동의
 * - 선택: 이메일(형식 검사) · 설치 예정 지역 · 희망 면적 · 용도 · 예산 범위 · 희망 일정 · 관심 모델(?model= 기본값)
 * - 면적·예산은 자유 입력 — 구간 선택지는 회사 가격·규격처럼 보일 수 있어 두지 않는다
 *
 * [전송 — lib/company.ts getFormDelivery()]
 * - endpoint: 폼 전송 서비스로 JSON POST (NEXT_PUBLIC_FORM_ENDPOINT)
 * - mailto  : 메일 앱을 열어 본문 채움 (NEXT_PUBLIC_CONTACT_EMAIL)
 * - none    : 전송 버튼 비활성 + "온라인 접수 준비 중" — 보내지지 않는데 보낸 것처럼 보이지 않게
 *
 * [기타]
 * - 허니팟 필드(company_website)로 단순 스팸 차단
 * - ?model= 은 window.location 에서 읽음 (useSearchParams 를 쓰면 정적 HTML 에서 폼이 빠짐)
 */
"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import type { FormDelivery } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n/dictionaries/ko";

type Labels = Dictionary["contact"]["form"];

interface Props {
  delivery: FormDelivery;
  labels: Labels;
  /** 데이터에 있는 모델만 — slug → 표시 이름 */
  models: { slug: string; name: string }[];
}

type Field = "name" | "phone" | "email" | "region" | "area" | "purpose" | "budget" | "schedule" | "model" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "consent", string>>;

const EMPTY: Values = { name: "", phone: "", email: "", region: "", area: "", purpose: "", budget: "", schedule: "", model: "", message: "" };

const noopSubscribe = () => () => {};

export default function ContactForm({ delivery, labels, models }: Props) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const summaryRef = useRef<HTMLDivElement>(null);

  // ?model= (데이터에 있는 slug 만) → 관심 모델 기본값
  const urlModel = useSyncExternalStore(
    noopSubscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("model");
      return models.find((m) => m.slug === slug)?.name ?? "";
    },
    () => "",
  );

  const [values, setValues] = useState<Values>(EMPTY);
  const [touchedModel, setTouchedModel] = useState(false);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const model = touchedModel ? values.model : values.model || urlModel;
  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (f === "model") setTouchedModel(true);
    setValues((v) => ({ ...v, [f]: e.target.value }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = labels.errRequired;
    if (!values.phone.trim()) e.phone = labels.errRequired;
    else if ((values.phone.match(/\d/g) ?? []).length < 9 || !/^[\d\s+\-()]+$/.test(values.phone)) e.phone = labels.errPhone;
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = labels.errEmail;
    if (!values.message.trim()) e.message = labels.errRequired;
    if (!consent) e.consent = labels.errConsent;
    return e;
  };

  const rows = (): [string, string][] => [
    [labels.name, values.name],
    [labels.phone, values.phone],
    [labels.email, values.email],
    [labels.region, values.region],
    [labels.area, values.area ? `${values.area} ${labels.areaUnit}` : ""],
    [labels.purpose, values.purpose],
    [labels.budget, values.budget],
    [labels.schedule, values.schedule],
    [labels.model, model],
    [labels.message, values.message],
  ];

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (delivery.mode === "none") return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (trap) {
      setStatus("sent"); // 허니팟: 봇에게는 성공처럼 보이고 실제 전송은 하지 않음
      return;
    }

    if (delivery.mode === "mailto") {
      const body = rows()
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      window.location.href = `mailto:${delivery.email}?subject=${encodeURIComponent(labels.mailSubject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(delivery.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, model, consent: true, _subject: labels.mailSubject }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <p role="status" className="p-6 border border-[var(--accent)]/50 bg-[var(--bg-surface)] text-[var(--text)] [word-break:keep-all]">
        {delivery.mode === "mailto" ? labels.sentMailto : labels.sentEndpoint}
      </p>
    );
  }

  const errorList = Object.entries(errors);
  const inputCls = (f: Field) =>
    [
      "w-full h-11 px-3 bg-[var(--bg-surface)] border text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]",
      "focus:outline-none focus-visible:border-[var(--accent)]",
      errors[f] ? "border-[var(--accent)]" : "border-[var(--border)]",
    ].join(" ");

  const label = (f: Field, text: string, required = false) => (
    <label htmlFor={id(f)} className="block mb-1.5 text-xs text-[var(--text-muted)]">
      {text}
      {required && (
        <span className="ml-1 text-[var(--accent)]" aria-hidden>
          *
        </span>
      )}
      {required && <span className="sr-only"> ({labels.required})</span>}
    </label>
  );

  const errorText = (f: Field | "consent") =>
    errors[f] ? (
      <p id={id(`${f}-err`)} className="mt-1.5 text-xs text-[var(--accent)]">
        {errors[f]}
      </p>
    ) : null;

  const describedBy = (f: Field, hint?: boolean) =>
    [errors[f] ? id(`${f}-err`) : "", hint ? id(`${f}-hint`) : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={id("heading")} className="space-y-0">
      <h2 id={id("heading")} className="font-korean text-2xl text-[var(--text)] mb-6">
        {labels.heading}
      </h2>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 p-4 border border-[var(--accent)]/60 text-sm text-[var(--text)] focus:outline-none">
          {labels.errorSummary}
        </div>
      )}

      {/* 허니팟 — 사람에게는 보이지 않음 */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={id("trap")}>company website</label>
        <input id={id("trap")} name="company_website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
        <div>
          {label("name", labels.name, true)}
          <input id={id("name")} name="name" autoComplete="name" className={inputCls("name")} value={values.name} onChange={set("name")} aria-required aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          {errorText("name")}
        </div>
        <div>
          {label("phone", labels.phone, true)}
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={labels.phoneHint} className={inputCls("phone")} value={values.phone} onChange={set("phone")} aria-required aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
          {errorText("phone")}
        </div>
        <div className="sm:col-span-2">
          {label("email", labels.email)}
          <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" className={inputCls("email")} value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
          {errorText("email")}
        </div>
        <div>
          {label("region", labels.region)}
          <input id={id("region")} name="region" placeholder={labels.regionHint} className={inputCls("region")} value={values.region} onChange={set("region")} />
        </div>
        <div>
          {label("area", labels.area)}
          <div className="relative">
            <input id={id("area")} name="area" inputMode="decimal" className={`${inputCls("area")} pr-10`} value={values.area} onChange={set("area")} />
            <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
              {labels.areaUnit}
            </span>
          </div>
        </div>
        <div>
          {label("purpose", labels.purpose)}
          <select id={id("purpose")} name="purpose" className={inputCls("purpose")} value={values.purpose} onChange={set("purpose")}>
            <option value="">{labels.select}</option>
            {labels.purposeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          {label("schedule", labels.schedule)}
          <select id={id("schedule")} name="schedule" className={inputCls("schedule")} value={values.schedule} onChange={set("schedule")}>
            <option value="">{labels.select}</option>
            {labels.scheduleOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          {label("budget", labels.budget)}
          <input id={id("budget")} name="budget" placeholder={labels.budgetHint} className={inputCls("budget")} value={values.budget} onChange={set("budget")} />
        </div>
        <div>
          {label("model", labels.model)}
          <input id={id("model")} name="model" className={inputCls("model")} value={model} onChange={set("model")} />
        </div>
        <div className="sm:col-span-2">
          {label("message", labels.message, true)}
          <textarea id={id("message")} name="message" rows={6} className={`${inputCls("message")} h-auto py-2.5 leading-relaxed`} value={values.message} onChange={set("message")} aria-required aria-invalid={!!errors.message} aria-describedby={describedBy("message")} />
          {errorText("message")}
        </div>
      </div>

      {/* 개인정보 수집·이용 동의 (필수) */}
      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-required
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? id("consent-err") : undefined}
            className="mt-0.5 w-4 h-4 accent-[var(--accent)]"
          />
          <label htmlFor={id("consent")} className="text-sm text-[var(--text)] [word-break:keep-all]">
            {labels.consent}
            <span className="ml-1 text-[var(--accent)]" aria-hidden>
              *
            </span>
            <span className="sr-only"> ({labels.required})</span>
          </label>
        </div>
        {errorText("consent")}
        <details className="mt-3 ml-7 text-xs text-[var(--text-muted)]">
          <summary className="cursor-pointer w-fit hover:text-[var(--text)]">{labels.consentView}</summary>
          <ul className="mt-2 space-y-1 list-disc pl-4 [word-break:keep-all]">
            {labels.consentItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={delivery.mode === "none" || status === "sending"}
          aria-describedby={id("delivery-note")}
          className="inline-flex items-center justify-center h-12 px-8 w-full sm:w-auto bg-[var(--accent)] text-[var(--bg)] text-sm tracking-[0.08em] hover:bg-[var(--accent)]/85 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          {status === "sending" ? labels.sending : labels.submit}
        </button>
        <p id={id("delivery-note")} className="mt-3 text-xs text-[var(--text-muted)] [word-break:keep-all]">
          {delivery.mode === "none" ? labels.notReady : delivery.mode === "mailto" ? labels.mailtoNote : ""}
        </p>
        {status === "failed" && (
          <p role="alert" className="mt-3 text-sm text-[var(--accent)] [word-break:keep-all]">
            {labels.failed}
          </p>
        )}
      </div>
    </form>
  );
}
