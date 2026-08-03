import type { Contract, EvidencePack } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateContract(contract: Contract): ValidationResult {
  const errors: string[] = [];

  if (!contract.title.trim()) errors.push("제목(title)이 필요합니다.");
  if (!contract.objective.trim()) errors.push("목적(objective)이 필요합니다.");
  if (contract.constraints.filter((c) => c.trim()).length < 1) {
    errors.push("제약(constraints)을 1개 이상 입력하세요.");
  }
  if (contract.acceptanceCriteria.filter((c) => c.trim()).length < 1) {
    errors.push("수용 기준(acceptanceCriteria)을 1개 이상 입력하세요.");
  }

  return { ok: errors.length === 0, errors };
}

/** Approve는 Contract valid + Evidence overall !== fail 일 때만 허용 */
export function canApprove(
  contractValid: boolean,
  evidence: EvidencePack | null,
): boolean {
  if (!contractValid) return false;
  if (!evidence) return false;
  if (evidence.overall === "fail") return false;
  return true;
}
