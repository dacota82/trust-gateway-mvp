"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import demo from "@/fixtures/demo-work-order.json";
import {
  DEFAULT_LOCALE,
  formatStep,
  isLocale,
  LOCALE_LABEL,
  LOCALES,
  messages,
  type Locale,
  type ValidationErrorCode,
} from "@/lib/i18n";
import { canApprove, validateContract } from "@/lib/validate";
import type {
  Contract,
  EvidenceItemStatus,
  EvidencePack,
  HumanJudgment,
  JudgmentDecision,
} from "@/lib/types";

type Step = "start" | "contract" | "evidence" | "judgment" | "done";

const STORAGE_KEY = "tg-locale";

function emptyContract(): Contract {
  return {
    id: "ctr-new",
    title: "",
    objective: "",
    constraints: [""],
    acceptanceCriteria: [""],
    status: "draft",
  };
}

function buildDemoContract(locale: Locale): Contract {
  const d = messages[locale].demo;
  return {
    id: demo.contract.id,
    title: d.title,
    objective: d.objective,
    constraints: [...d.constraints],
    acceptanceCriteria: [...d.acceptanceCriteria],
    status: "draft",
  };
}

function buildDemoEvidence(locale: Locale): EvidencePack {
  const d = messages[locale].demo;
  const base = structuredClone(demo.evidence) as EvidencePack;
  return {
    ...base,
    items: base.items.map((item, i) => ({
      ...item,
      claim: d.items[i]?.claim ?? item.claim,
      note: d.items[i]?.note ?? item.note,
    })),
  };
}

const STATUS_STYLE: Record<
  EvidenceItemStatus,
  { badge: string; iconBg: string; icon: string }
> = {
  ok: {
    badge: "bg-secondary-container text-secondary",
    iconBg: "bg-secondary-container text-secondary",
    icon: "✓",
  },
  conflict: {
    badge: "bg-error-container text-error",
    iconBg: "bg-error-container text-error",
    icon: "!",
  },
  unknown: {
    badge: "bg-tertiary-container text-tertiary",
    iconBg: "bg-tertiary-container text-tertiary",
    icon: "?",
  },
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-on-surface-variant"
    >
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function LocaleSwitch({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div
      className="flex overflow-hidden rounded-lg border border-outline-variant text-xs font-bold"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`px-2.5 py-1.5 transition ${
            locale === code
              ? "bg-primary-container text-on-primary"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          {LOCALE_LABEL[code]}
        </button>
      ))}
    </div>
  );
}

export default function TrustGatewayApp() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [step, setStep] = useState<Step>("start");
  const [contract, setContract] = useState<Contract>(() =>
    buildDemoContract(DEFAULT_LOCALE),
  );
  const [errors, setErrors] = useState<ValidationErrorCode[]>([]);
  const [evidence, setEvidence] = useState<EvidencePack | null>(null);
  const [decision, setDecision] = useState<JudgmentDecision>("hold");
  const [rationale, setRationale] = useState("");
  const [ack, setAck] = useState(false);
  const [judgment, setJudgment] = useState<HumanJudgment | null>(null);

  const m = messages[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) {
      setLocale(saved);
      setContract(buildDemoContract(saved));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const contractValid = contract.status === "valid";
  const approveAllowed = useMemo(
    () => canApprove(contractValid, evidence),
    [contractValid, evidence],
  );

  function changeLocale(next: Locale) {
    setLocale(next);
    setErrors([]);
    if (step === "start") {
      setContract(buildDemoContract(next));
      return;
    }
    if (step === "contract" && contract.id === demo.contract.id) {
      setContract({ ...buildDemoContract(next), status: contract.status });
    }
    if (step === "evidence") {
      setEvidence(buildDemoEvidence(next));
      if (contract.id === demo.contract.id) {
        setContract({ ...buildDemoContract(next), status: "valid" });
      }
    }
  }

  function resetSession(next: Step, nextContract: Contract) {
    setContract(nextContract);
    setEvidence(null);
    setErrors([]);
    setDecision("hold");
    setRationale("");
    setAck(false);
    setJudgment(null);
    setStep(next);
  }

  function openDemo() {
    resetSession("contract", buildDemoContract(locale));
  }

  function createContract() {
    resetSession("contract", emptyContract());
  }

  function onValidate() {
    const result = validateContract(contract);
    if (!result.ok) {
      setContract({ ...contract, status: "invalid" });
      setErrors(result.errorCodes);
      setEvidence(null);
      return;
    }
    setContract({ ...contract, status: "valid" });
    setErrors([]);
    setEvidence(buildDemoEvidence(locale));
    setStep("evidence");
  }

  function goJudgmentAfterInvalid() {
    if (contract.status !== "invalid") return;
    setEvidence(null);
    setDecision("hold");
    setAck(false);
    setStep("judgment");
  }

  function onSubmitJudgment() {
    if (decision === "approve" && !approveAllowed) return;
    if (!rationale.trim() || !ack) return;

    const record: HumanJudgment = {
      workOrderId: demo.workOrderId,
      decision,
      rationale: rationale.trim(),
      decidedAt: new Date().toISOString(),
    };
    setJudgment(record);
    setStep("done");
  }

  function updateList(
    key: "constraints" | "acceptanceCriteria",
    index: number,
    value: string,
  ) {
    const next = [...contract[key]];
    next[index] = value;
    setContract({ ...contract, [key]: next, status: "draft" });
  }

  function Shell({
    children,
    showHow,
  }: {
    children: ReactNode;
    showHow?: boolean;
  }) {
    return (
      <div className="flex min-h-screen flex-col bg-surface text-on-surface">
        <nav className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
          <div className="mx-auto flex h-16 max-w-[760px] items-center justify-between gap-3 px-4 md:px-8">
            <div className="text-lg font-bold tracking-tight text-on-surface uppercase">
              {m.brand}
            </div>
            <div className="flex items-center gap-3">
              <LocaleSwitch locale={locale} onChange={changeLocale} />
              {showHow !== false && (
                <a
                  href="#flow"
                  className="hidden text-sm text-on-surface-variant transition-colors hover:text-primary sm:inline"
                >
                  {m.howItWorks}
                </a>
              )}
            </div>
          </div>
        </nav>
        <main className="mx-auto flex w-full max-w-[760px] flex-grow flex-col px-4 py-10 md:px-8">
          {children}
        </main>
      </div>
    );
  }

  function StepProgress({ current }: { current: 1 | 2 | 3 }) {
    const steps = [
      { n: 1 as const, label: m.stepContract },
      { n: 2 as const, label: m.stepEvidence },
      { n: 3 as const, label: m.stepJudgment },
    ];
    return (
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2 text-sm">
        {steps.map((s, i) => {
          const done = current > s.n;
          const active = current === s.n;
          return (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-outline-variant">—</span>}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                  active
                    ? "bg-primary-container text-on-primary"
                    : done
                      ? "bg-surface-container text-on-surface-variant"
                      : "bg-surface-container-high text-outline"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-medium">
                  {done ? "✓" : s.n}
                </span>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  const statusLabel = (status: EvidenceItemStatus) => {
    if (status === "ok") return m.statusVerified;
    if (status === "conflict") return m.statusConflict;
    return m.statusUnknown;
  };

  if (step === "start") {
    return (
      <Shell>
        <section className="flex flex-grow flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 h-1 w-16 rounded-full bg-primary opacity-80" />
          <h1 className="mb-3 max-w-xl text-3xl font-medium tracking-tight text-on-surface md:text-5xl md:leading-[56px]">
            {m.startTitle}
          </h1>
          <p className="mb-10 max-w-md text-lg leading-7 text-on-surface-variant">
            {m.startSubtitle}
          </p>
          <div className="mb-12 flex w-full max-w-md flex-col gap-4">
            <button
              type="button"
              onClick={createContract}
              className="h-12 w-full rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110 active:scale-[0.98]"
            >
              {m.createContract}
            </button>
            <button
              type="button"
              onClick={openDemo}
              className="h-12 w-full rounded-lg bg-surface-container-high text-sm font-bold text-on-surface-variant transition hover:brightness-95 active:scale-[0.98]"
            >
              {m.openDemo}
            </button>
          </div>
          <p
            id="flow"
            className="text-sm font-medium tracking-[0.2em] text-outline uppercase"
          >
            {m.flowLabel}
          </p>
        </section>
      </Shell>
    );
  }

  if (step === "contract") {
    return (
      <Shell>
        <div className="mb-2 flex items-center justify-between text-sm text-on-surface-variant">
          <button
            type="button"
            onClick={() => setStep("start")}
            className="hover:text-primary"
          >
            {m.backStart}
          </button>
          <span className="flex items-center gap-2">
            {formatStep(locale, 1)}
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-high">
              <span className="block h-full w-1/3 bg-primary-container" />
            </span>
          </span>
        </div>
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-on-surface">
          {m.contractTitle}
        </h1>
        <p className="mb-8 text-center text-on-surface-variant">
          {m.contractSubtitle}
        </p>

        <div className="space-y-5">
          <div>
            <FieldLabel htmlFor="title">{m.fieldTitle}</FieldLabel>
            <input
              id="title"
              className={inputClass}
              placeholder={m.fieldTitlePh}
              value={contract.title}
              onChange={(e) =>
                setContract({
                  ...contract,
                  title: e.target.value,
                  status: "draft",
                })
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="objective">{m.fieldObjective}</FieldLabel>
            <textarea
              id="objective"
              className={`${inputClass} min-h-24`}
              placeholder={m.fieldObjectivePh}
              value={contract.objective}
              onChange={(e) =>
                setContract({
                  ...contract,
                  objective: e.target.value,
                  status: "draft",
                })
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="c0">{m.fieldConstraints}</FieldLabel>
            {contract.constraints.map((c, i) => (
              <input
                key={`c-${i}`}
                id={i === 0 ? "c0" : undefined}
                className={inputClass}
                value={c}
                onChange={(e) => updateList("constraints", i, e.target.value)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="a0">{m.fieldAcceptance}</FieldLabel>
            {contract.acceptanceCriteria.map((c, i) => (
              <input
                key={`a-${i}`}
                id={i === 0 ? "a0" : undefined}
                className={inputClass}
                value={c}
                onChange={(e) =>
                  updateList("acceptanceCriteria", i, e.target.value)
                }
              />
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <ul className="mt-6 space-y-1 rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
            {errors.map((code) => (
              <li key={code}>{m.errors[code]}</li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onValidate}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110 active:scale-[0.98]"
          >
            {m.validateContract}
          </button>
          {contract.status === "invalid" && (
            <button
              type="button"
              onClick={goJudgmentAfterInvalid}
              className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-sm font-bold text-on-surface-variant"
            >
              {m.goJudgmentBlocked}
            </button>
          )}
          <button
            type="button"
            onClick={openDemo}
            className="h-12 w-full rounded-lg bg-surface-container-high text-sm font-bold text-on-surface-variant"
          >
            {m.loadDemo}
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "evidence" && evidence) {
    return (
      <Shell>
        <StepProgress current={2} />
        <p className="mb-2 text-sm font-bold tracking-wide text-primary uppercase">
          {m.evidenceEyebrow}
        </p>
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-on-surface">
          {m.evidenceTitle}
        </h1>
        <p className="mb-2 text-on-surface-variant">{m.evidenceSubtitle}</p>
        <p className="mb-8 text-sm text-outline">
          {m.overallLabel}:{" "}
          <strong className="text-on-surface">{evidence.overall}</strong>
        </p>

        <ul className="mb-10 space-y-3">
          {evidence.items.map((item) => {
            const ui = STATUS_STYLE[item.status];
            return (
              <li
                key={item.id}
                className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${ui.iconBg}`}
                  >
                    {ui.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="font-medium text-on-surface">
                        {m.claimLabel}: {item.claim}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${ui.badge}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {m.sourceLabel}: {item.source}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-sm text-outline">{item.note}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep("contract")}
            className="h-12 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm font-bold text-primary"
          >
            {m.backContract}
          </button>
          <button
            type="button"
            onClick={() => {
              setDecision(approveAllowed ? "approve" : "hold");
              setStep("judgment");
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110"
          >
            {m.proceedJudgment}
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "judgment") {
    const options: {
      value: JudgmentDecision;
      label: string;
      hint: string;
      disabled?: boolean;
    }[] = [
      {
        value: "approve",
        label: m.approve,
        hint: m.approveHint,
        disabled: !approveAllowed,
      },
      { value: "hold", label: m.hold, hint: m.holdHint },
      { value: "reject", label: m.reject, hint: m.rejectHint },
    ];

    return (
      <Shell>
        <StepProgress current={3} />
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-on-surface">
          {m.judgmentTitle}
        </h1>
        <p className="mb-8 text-center text-on-surface-variant">
          {m.judgmentSubtitle}
        </p>

        <div className="mb-6 rounded-lg bg-surface-container px-4 py-4">
          <p className="mb-2 text-xs font-medium tracking-wider text-on-surface-variant uppercase">
            {m.reviewSummary}
          </p>
          <p className="text-sm text-on-surface">
            {m.contractStatus}:{" "}
            <strong>
              {contractValid ? m.statusValid : contract.status}
            </strong>
            {" · "}
            {m.evidenceOverall}:{" "}
            <strong>{evidence?.overall ?? m.evidenceNa}</strong>
          </p>
        </div>

        {!approveAllowed && (
          <p className="mb-4 rounded-lg border border-tertiary/30 bg-tertiary-container px-4 py-3 text-sm text-tertiary">
            {m.approveBlocked}
          </p>
        )}

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {options.map((opt) => {
            const selected = decision === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => setDecision(opt.value)}
                className={`rounded-lg border px-4 py-4 text-left transition ${
                  opt.disabled
                    ? "cursor-not-allowed border-outline-variant/50 bg-surface-container opacity-50"
                    : selected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary/40"
                }`}
              >
                <div className="mb-1 text-base font-bold text-on-surface">
                  {opt.label}
                </div>
                <div className="text-xs text-on-surface-variant">{opt.hint}</div>
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <FieldLabel htmlFor="rationale">{m.judgmentReason}</FieldLabel>
          <textarea
            id="rationale"
            className={`${inputClass} min-h-28`}
            placeholder={m.judgmentReasonPh}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </div>

        <label className="mb-8 flex items-start gap-3 rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
          <input
            type="checkbox"
            className="mt-1"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          <span>{m.ackLabel}</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep(evidence ? "evidence" : "contract")}
            className="h-12 flex-1 rounded-lg border border-primary bg-surface-container-lowest text-sm font-bold text-primary"
          >
            {m.backEvidence}
          </button>
          <button
            type="button"
            onClick={onSubmitJudgment}
            disabled={
              !rationale.trim() ||
              !ack ||
              (decision === "approve" && !approveAllowed)
            }
            className="h-12 flex-1 rounded-lg bg-primary text-sm font-bold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {m.recordJudgment}
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "done" && judgment) {
    return (
      <Shell showHow={false}>
        <section className="flex flex-grow flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary-container text-4xl text-secondary">
            ✓
          </div>
          <h1 className="mb-3 text-3xl font-medium text-on-surface">
            {m.doneTitle}
          </h1>
          <p className="mb-2 max-w-md text-on-surface-variant">
            {m.doneSubtitle}
          </p>
          <p className="mb-2 text-sm text-on-surface">
            {m.decisionLabel}: <strong>{judgment.decision}</strong>
          </p>
          <p className="mb-1 max-w-lg text-sm text-on-surface-variant">
            {judgment.rationale}
          </p>
          <p className="mb-10 text-xs text-outline">{judgment.decidedAt}</p>
          <button
            type="button"
            onClick={() => resetSession("start", buildDemoContract(locale))}
            className="h-12 min-w-48 rounded-lg bg-on-surface px-8 text-sm font-bold text-surface-container-lowest transition hover:opacity-90"
          >
            {m.nextCase}
          </button>
        </section>
      </Shell>
    );
  }

  return null;
}
