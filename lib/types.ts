export type ContractStatus = "draft" | "valid" | "invalid";
export type EvidenceStatus = "pass" | "conditional" | "fail";
export type JudgmentDecision = "approve" | "reject" | "hold";
export type EvidenceItemStatus = "ok" | "conflict" | "unknown";

export interface Contract {
  id: string;
  title: string;
  objective: string;
  constraints: string[];
  acceptanceCriteria: string[];
  status: ContractStatus;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  source: string;
  status: EvidenceItemStatus;
  note?: string;
}

export interface EvidencePack {
  workOrderId: string;
  items: EvidenceItem[];
  overall: EvidenceStatus;
}

export interface HumanJudgment {
  workOrderId: string;
  decision: JudgmentDecision;
  rationale: string;
  decidedAt: string;
}

export interface DemoWorkOrder {
  workOrderId: string;
  contract: Contract;
  evidence: EvidencePack;
}
