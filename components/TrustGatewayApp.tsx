"use client";

import { useMemo, useState } from "react";
import demo from "@/fixtures/demo-work-order.json";
import { canApprove, validateContract } from "@/lib/validate";
import type {
  Contract,
  EvidencePack,
  HumanJudgment,
  JudgmentDecision,
} from "@/lib/types";

type Step = "contract" | "evidence" | "judgment" | "done";

function cloneDemoContract(): Contract {
  return structuredClone(demo.contract) as Contract;
}

function cloneDemoEvidence(): EvidencePack {
  return structuredClone(demo.evidence) as EvidencePack;
}

export default function TrustGatewayApp() {
  const [step, setStep] = useState<Step>("contract");
  const [contract, setContract] = useState<Contract>(cloneDemoContract);
  const [errors, setErrors] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<EvidencePack | null>(null);
  const [decision, setDecision] = useState<JudgmentDecision>("hold");
  const [rationale, setRationale] = useState("");
  const [judgment, setJudgment] = useState<HumanJudgment | null>(null);

  const contractValid = contract.status === "valid";
  const approveAllowed = useMemo(
    () => canApprove(contractValid, evidence),
    [contractValid, evidence],
  );

  function loadFixture() {
    setContract(cloneDemoContract());
    setEvidence(null);
    setErrors([]);
    setDecision("hold");
    setRationale("");
    setJudgment(null);
    setStep("contract");
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
    setStep("judgment");
  }

  function onSubmitJudgment() {
    if (decision === "approve" && !approveAllowed) return;
    if (!rationale.trim()) return;

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

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm tracking-wide text-zinc-500">Trust Gateway MVP</p>
        <h1 className="text-2xl font-semibold text-zinc-900">
          주간 요약 초안 검토
        </h1>
        <p className="text-sm text-zinc-600">
          Contract → Evidence → Judgment. 외부 AI 미사용 · 최종 승인은 사람만.
        </p>
        <button
          type="button"
          onClick={loadFixture}
          className="text-sm text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
        >
          Demo Fixture 다시 로드
        </button>
      </header>

      <nav className="flex gap-2 text-xs font-medium text-zinc-500">
        {(["contract", "evidence", "judgment", "done"] as Step[]).map((s) => (
          <span
            key={s}
            className={
              step === s
                ? "rounded bg-zinc-900 px-2 py-1 text-white"
                : "rounded bg-zinc-100 px-2 py-1"
            }
          >
            {s}
          </span>
        ))}
      </nav>

      {step === "contract" && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-zinc-900">1. Contract</h2>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-600">제목</span>
            <input
              className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              value={contract.title}
              onChange={(e) =>
                setContract({
                  ...contract,
                  title: e.target.value,
                  status: "draft",
                })
              }
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-600">목적</span>
            <textarea
              className="min-h-20 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              value={contract.objective}
              onChange={(e) =>
                setContract({
                  ...contract,
                  objective: e.target.value,
                  status: "draft",
                })
              }
            />
          </label>
          <div className="space-y-2 text-sm">
            <span className="text-zinc-600">제약</span>
            {contract.constraints.map((c, i) => (
              <input
                key={`c-${i}`}
                className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                value={c}
                onChange={(e) => updateList("constraints", i, e.target.value)}
              />
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <span className="text-zinc-600">수용 기준</span>
            {contract.acceptanceCriteria.map((c, i) => (
              <input
                key={`a-${i}`}
                className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
                value={c}
                onChange={(e) =>
                  updateList("acceptanceCriteria", i, e.target.value)
                }
              />
            ))}
          </div>
          {errors.length > 0 && (
            <ul className="space-y-1 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onValidate}
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Validate
            </button>
            {contract.status === "invalid" && (
              <button
                type="button"
                onClick={goJudgmentAfterInvalid}
                className="rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
              >
                Reject/Hold만 Judgment로
              </button>
            )}
          </div>
        </section>
      )}

      {step === "evidence" && evidence && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-zinc-900">2. Evidence</h2>
          <p className="text-sm text-zinc-600">
            overall: <strong>{evidence.overall}</strong>
          </p>
          <ul className="space-y-3">
            {evidence.items.map((item) => (
              <li
                key={item.id}
                className="rounded border border-zinc-200 bg-white px-3 py-3 text-sm"
              >
                <div className="mb-1 font-medium uppercase tracking-wide text-zinc-500">
                  {item.status}
                </div>
                <p className="text-zinc-900">{item.claim}</p>
                <p className="mt-1 text-zinc-500">{item.source}</p>
                {item.note && (
                  <p className="mt-1 text-zinc-600">{item.note}</p>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setStep("judgment")}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Judgment로 이동
          </button>
        </section>
      )}

      {step === "judgment" && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-zinc-900">3. Judgment</h2>
          {!approveAllowed && (
            <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Contract 미통과 또는 Evidence fail 상태에서는 Approve가 완전
              차단됩니다. Reject 또는 Hold만 가능합니다.
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-sm">
            {(
              [
                ["approve", "Approve"],
                ["reject", "Reject"],
                ["hold", "Hold"],
              ] as const
            ).map(([value, label]) => {
              const disabled = value === "approve" && !approveAllowed;
              return (
                <label
                  key={value}
                  className={`flex items-center gap-2 rounded border px-3 py-2 ${
                    disabled
                      ? "cursor-not-allowed border-zinc-200 text-zinc-400"
                      : "border-zinc-300 text-zinc-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value={value}
                    checked={decision === value}
                    disabled={disabled}
                    onChange={() => setDecision(value)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-600">판단 근거</span>
            <textarea
              className="min-h-24 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="왜 이 결정을 내리는지 한두 문장"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep("evidence")}
              className="rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
            >
              뒤로
            </button>
            <button
              type="button"
              onClick={onSubmitJudgment}
              disabled={!rationale.trim() || (decision === "approve" && !approveAllowed)}
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              Submit decision
            </button>
          </div>
        </section>
      )}

      {step === "done" && judgment && (
        <section className="space-y-3 rounded border border-zinc-200 bg-white px-4 py-4">
          <h2 className="text-lg font-medium text-zinc-900">Result</h2>
          <p className="text-sm text-zinc-700">
            Work Order: <code>{judgment.workOrderId}</code>
          </p>
          <p className="text-sm text-zinc-700">
            Decision: <strong>{judgment.decision}</strong>
          </p>
          <p className="text-sm text-zinc-700">{judgment.rationale}</p>
          <p className="text-xs text-zinc-500">{judgment.decidedAt}</p>
          <button
            type="button"
            onClick={loadFixture}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            새 시연 시작
          </button>
        </section>
      )}
    </div>
  );
}
