import type { Contract, EvidencePack } from "./types";
import type { ValidationErrorCode } from "./i18n";

export interface ValidationResult {
  ok: boolean;
  errorCodes: ValidationErrorCode[];
}

export function validateContract(contract: Contract): ValidationResult {
  const errorCodes: ValidationErrorCode[] = [];

  if (!contract.title.trim()) errorCodes.push("titleRequired");
  if (!contract.objective.trim()) errorCodes.push("objectiveRequired");
  if (contract.constraints.filter((c) => c.trim()).length < 1) {
    errorCodes.push("constraintsRequired");
  }
  if (contract.acceptanceCriteria.filter((c) => c.trim()).length < 1) {
    errorCodes.push("acceptanceRequired");
  }

  return { ok: errorCodes.length === 0, errorCodes };
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
