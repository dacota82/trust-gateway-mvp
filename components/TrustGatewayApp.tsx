"use client";

import { useMemo, useState, type ReactNode } from "react";
import demo from "@/fixtures/demo-work-order.json";
import { canApprove, validateContract } from "@/lib/validate";
import type {
  Contract,
  EvidenceItemStatus,
  EvidencePack,
  HumanJudgment,
  JudgmentDecision,
} from "@/lib/types";

type Step = "start" | "contract" | "evidence" | "judgment" | "done";

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

function cloneDemoContract(): Contract {
  return structuredClone(demo.contract) as Contract;
}

function cloneDemoEvidence(): EvidencePack {
  return structuredClone(demo.evidence) as EvidencePack;
}

const STATUS_UI: Record<
  EvidenceItemStatus,
  { label: string; badge: string; iconBg: string; icon: string }
> = {
  ok: {
    label: "VERIFIED",
    badge: "bg-secondary-container text-secondary",
    iconBg: "bg-secondary-container text-secondary",
    icon: "✓",
  },
  conflict: {
    label: "CONFLICT",
    badge: "bg-error-container text-error",
    iconBg: "bg-error-container text-error",
    icon: "!",
  },
  unknown: {
    label: "UNKNOWN",
    badge: "bg-tertiary-container text-tertiary",
    iconBg: "bg-tertiary-container text-tertiary",
    icon: "?",
  },
};

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
        <div className="mx-auto flex h-16 max-w-[760px] items-center justify-between px-4 md:px-8">
          <div className="text-lg font-bold tracking-tight text-on-surface uppercase">
            Trust Gateway
          </div>
          {showHow !== false && (
            <a
              href="#flow"
              className="text-base text-on-surface-variant transition-colors hover:text-primary"
            >
              How it works
            </a>
          )}
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
    { n: 1 as const, label: "Contract" },
    { n: 2 as const, label: "Evidence" },
    { n: 3 as const, label: "Judgment" },
  ];
  return (
    <div className="mb-10 flex items-center justify-center gap-2 text-sm">
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

export default function TrustGatewayApp() {
  const [step, setStep] = useState<Step>("start");
  const [contract, setContract] = useState<Contract>(cloneDemoContract);
  const [errors, setErrors] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<EvidencePack | null>(null);
  const [decision, setDecision] = useState<JudgmentDecision>("hold");
  const [rationale, setRationale] = useState("");
  const [ack, setAck] = useState(false);
  const [judgment, setJudgment] = useState<HumanJudgment | null>(null);

  const contractValid = contract.status === "valid";
  const approveAllowed = useMemo(
    () => canApprove(contractValid, evidence),
    [contractValid, evidence],
  );

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
    resetSession("contract", cloneDemoContract());
  }

  function createContract() {
    resetSession("contract", emptyContract());
  }

  function onValidate() {
    const result = validateContract(contract);
    if (!result.ok) {
      setContract({ ...contract, status: "invalid" });
      setErrors(result.errors);
      setEvidence(null);
      return;
    }
    setContract({ ...contract, status: "valid" });
    setErrors([]);
    setEvidence(cloneDemoEvidence());
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

  if (step === "start") {
    return (
      <Shell>
        <section className="flex flex-grow flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 h-1 w-16 rounded-full bg-primary opacity-80" />
          <h1 className="mb-3 max-w-xl text-3xl font-medium tracking-tight text-on-surface md:text-5xl md:leading-[56px]">
            What should AI be allowed to do?
          </h1>
          <p className="mb-10 max-w-md text-lg leading-7 text-on-surface-variant">
            Define the task, boundaries, and required evidence before reviewing
            the result.
          </p>
          <div className="mb-12 flex w-full max-w-md flex-col gap-4">
            <button
              type="button"
              onClick={createContract}
              className="h-12 w-full rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110 active:scale-[0.98]"
            >
              Create Contract
            </button>
            <button
              type="button"
              onClick={openDemo}
              className="h-12 w-full rounded-lg bg-surface-container-high text-sm font-bold text-on-surface-variant transition hover:brightness-95 active:scale-[0.98]"
            >
              Open Demo Case
            </button>
          </div>
          <p
            id="flow"
            className="text-sm font-medium tracking-[0.2em] text-outline uppercase"
          >
            Contract → Evidence → Judgment
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
            ← Start
          </button>
          <span className="flex items-center gap-2">
            Step 1 of 3
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-high">
              <span className="block h-full w-1/3 bg-primary-container" />
            </span>
          </span>
        </div>
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-on-surface">
          Define the Contract
        </h1>
        <p className="mb-8 text-center text-on-surface-variant">
          검증 프로토콜을 시작하려면 목적·제약·수용 기준을 정의하세요.
        </p>

        <div className="space-y-5">
          <div>
            <FieldLabel htmlFor="title">Contract Title</FieldLabel>
            <input
              id="title"
              className={inputClass}
              placeholder="e.g. 주간 요약 초안 검토"
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
            <FieldLabel htmlFor="objective">Task Purpose</FieldLabel>
            <textarea
              id="objective"
              className={`${inputClass} min-h-24`}
              placeholder="Describe the primary objective..."
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
            <FieldLabel htmlFor="c0">Constraints (Allowed / Boundaries)</FieldLabel>
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
            <FieldLabel htmlFor="a0">Approval Criteria</FieldLabel>
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
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onValidate}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110 active:scale-[0.98]"
          >
            Validate Contract →
          </button>
          {contract.status === "invalid" && (
            <button
              type="button"
              onClick={goJudgmentAfterInvalid}
              className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-sm font-bold text-on-surface-variant"
            >
              Reject / Hold만 Judgment로
            </button>
          )}
          <button
            type="button"
            onClick={openDemo}
            className="h-12 w-full rounded-lg bg-surface-container-high text-sm font-bold text-on-surface-variant"
          >
            Load Demo Fixture
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
          Evidence Review
        </p>
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-on-surface">
          Review the Evidence
        </h1>
        <p className="mb-2 text-on-surface-variant">
          Check what is verified, unsupported, conflicting, or still unknown.
        </p>
        <p className="mb-8 text-sm text-outline">
          overall: <strong className="text-on-surface">{evidence.overall}</strong>
        </p>

        <ul className="mb-10 space-y-3">
          {evidence.items.map((item) => {
            const ui = STATUS_UI[item.status];
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
                        Claim: {item.claim}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${ui.badge}`}
                      >
                        {ui.label}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      Source: {item.source}
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
            Back to Contract
          </button>
          <button
            type="button"
            onClick={() => {
              setDecision(approveAllowed ? "approve" : "hold");
              setStep("judgment");
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container text-sm font-bold text-on-primary transition hover:brightness-110"
          >
            Proceed to Judgment →
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
        label: "Approve",
        hint: "수용 기준을 충족했다고 판단",
        disabled: !approveAllowed,
      },
      {
        value: "hold",
        label: "Hold",
        hint: "보류 · 추가 확인 필요 (Change Request 대신)",
      },
      {
        value: "reject",
        label: "Reject",
        hint: "거절 · 재작업 필요",
      },
    ];

    return (
      <Shell>
        <StepProgress current={3} />
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-on-surface">
          Make the Final Judgment
        </h1>
        <p className="mb-8 text-center text-on-surface-variant">
          Evidence를 검토한 뒤, 최종 결정은 사람이 내립니다.
        </p>

        <div className="mb-6 rounded-lg bg-surface-container px-4 py-4">
          <p className="mb-2 text-xs font-medium tracking-wider text-on-surface-variant uppercase">
            Review Summary
          </p>
          <p className="text-sm text-on-surface">
            Contract:{" "}
            <strong>{contractValid ? "valid" : contract.status}</strong>
            {" · "}
            Evidence overall:{" "}
            <strong>{evidence?.overall ?? "n/a (blocked path)"}</strong>
          </p>
        </div>

        {!approveAllowed && (
          <p className="mb-4 rounded-lg border border-tertiary/30 bg-tertiary-container px-4 py-3 text-sm text-tertiary">
            Contract 미통과 또는 Evidence fail 상태에서는 Approve가 완전
            차단됩니다. Hold 또는 Reject만 가능합니다.
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
          <FieldLabel htmlFor="rationale">Judgment Reason</FieldLabel>
          <textarea
            id="rationale"
            className={`${inputClass} min-h-28`}
            placeholder="Provide a brief explanation for your final decision..."
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
          <span>
            I understand that the final decision and responsibility remain with
            the human reviewer.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              setStep(evidence ? "evidence" : "contract")
            }
            className="h-12 flex-1 rounded-lg border border-primary bg-surface-container-lowest text-sm font-bold text-primary"
          >
            Back to Evidence
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
            Record Judgment
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
            Judgment Recorded
          </h1>
          <p className="mb-2 max-w-md text-on-surface-variant">
            최종 결정이 Trust Gateway 세션에 기록되었습니다.
          </p>
          <p className="mb-2 text-sm text-on-surface">
            Decision: <strong>{judgment.decision}</strong>
          </p>
          <p className="mb-1 max-w-lg text-sm text-on-surface-variant">
            {judgment.rationale}
          </p>
          <p className="mb-10 text-xs text-outline">{judgment.decidedAt}</p>
          <button
            type="button"
            onClick={() => resetSession("start", cloneDemoContract())}
            className="h-12 min-w-48 rounded-lg bg-on-surface px-8 text-sm font-bold text-surface-container-lowest transition hover:opacity-90"
          >
            Next Case
          </button>
        </section>
      </Shell>
    );
  }

  return null;
}
