export type Locale = "ko" | "ja";

export const LOCALES: Locale[] = ["ko", "ja"];

export const LOCALE_LABEL: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
};

export const DEFAULT_LOCALE: Locale = "ko";

export type ValidationErrorCode =
  | "titleRequired"
  | "objectiveRequired"
  | "constraintsRequired"
  | "acceptanceRequired";

export type Messages = {
  brand: string;
  howItWorks: string;
  langKo: string;
  langJa: string;
  startTitle: string;
  startSubtitle: string;
  createContract: string;
  openDemo: string;
  flowLabel: string;
  backStart: string;
  stepOf: string;
  contractTitle: string;
  contractSubtitle: string;
  fieldTitle: string;
  fieldTitlePh: string;
  fieldObjective: string;
  fieldObjectivePh: string;
  fieldConstraints: string;
  fieldAcceptance: string;
  validateContract: string;
  goJudgmentBlocked: string;
  loadDemo: string;
  stepContract: string;
  stepEvidence: string;
  stepJudgment: string;
  evidenceEyebrow: string;
  evidenceTitle: string;
  evidenceSubtitle: string;
  overallLabel: string;
  claimLabel: string;
  sourceLabel: string;
  statusVerified: string;
  statusConflict: string;
  statusUnknown: string;
  backContract: string;
  proceedJudgment: string;
  judgmentTitle: string;
  judgmentSubtitle: string;
  reviewSummary: string;
  contractStatus: string;
  evidenceOverall: string;
  evidenceNa: string;
  approveBlocked: string;
  approve: string;
  approveHint: string;
  hold: string;
  holdHint: string;
  reject: string;
  rejectHint: string;
  judgmentReason: string;
  judgmentReasonPh: string;
  ackLabel: string;
  backEvidence: string;
  recordJudgment: string;
  doneTitle: string;
  doneSubtitle: string;
  decisionLabel: string;
  nextCase: string;
  statusValid: string;
  errors: Record<ValidationErrorCode, string>;
  demo: {
    title: string;
    objective: string;
    constraints: string[];
    acceptanceCriteria: string[];
    items: { claim: string; note?: string }[];
  };
};

export const messages: Record<Locale, Messages> = {
  ko: {
    brand: "Trust Gateway",
    howItWorks: "작동 방식",
    langKo: "한국어",
    langJa: "日本語",
    startTitle: "AI에게 무엇을 허용할 것인가?",
    startSubtitle:
      "결과를 검토하기 전에 과제, 경계, 필요한 근거를 먼저 정의합니다.",
    createContract: "계약 만들기",
    openDemo: "데모 케이스 열기",
    flowLabel: "Contract → Evidence → Judgment",
    backStart: "← 시작",
    stepOf: "3단계 중 {n}단계",
    contractTitle: "계약 정의",
    contractSubtitle: "검증을 시작하려면 목적·제약·수용 기준을 정의하세요.",
    fieldTitle: "계약 제목",
    fieldTitlePh: "예: 주간 요약 초안 검토",
    fieldObjective: "과제 목적",
    fieldObjectivePh: "주요 목표를 설명하세요...",
    fieldConstraints: "제약 (허용 / 경계)",
    fieldAcceptance: "승인 기준",
    validateContract: "계약 검증 →",
    goJudgmentBlocked: "Reject / Hold만 판단으로",
    loadDemo: "데모 Fixture 불러오기",
    stepContract: "Contract",
    stepEvidence: "Evidence",
    stepJudgment: "Judgment",
    evidenceEyebrow: "Evidence Review",
    evidenceTitle: "근거 검토",
    evidenceSubtitle:
      "검증됨·미지원·충돌·미확인 항목을 확인합니다.",
    overallLabel: "overall",
    claimLabel: "주장",
    sourceLabel: "출처",
    statusVerified: "VERIFIED",
    statusConflict: "CONFLICT",
    statusUnknown: "UNKNOWN",
    backContract: "계약으로",
    proceedJudgment: "판단으로 진행 →",
    judgmentTitle: "최종 판단",
    judgmentSubtitle: "근거를 검토한 뒤, 최종 결정은 사람이 내립니다.",
    reviewSummary: "검토 요약",
    contractStatus: "Contract",
    evidenceOverall: "Evidence overall",
    evidenceNa: "n/a (차단 경로)",
    approveBlocked:
      "Contract 미통과 또는 Evidence fail 상태에서는 Approve가 완전 차단됩니다. Hold 또는 Reject만 가능합니다.",
    approve: "Approve",
    approveHint: "수용 기준을 충족했다고 판단",
    hold: "Hold",
    holdHint: "보류 · 추가 확인 필요",
    reject: "Reject",
    rejectHint: "거절 · 재작업 필요",
    judgmentReason: "판단 근거",
    judgmentReasonPh: "최종 결정 이유를 간단히 적어 주세요...",
    ackLabel:
      "최종 결정과 책임은 사람 검토자에게 있음을 이해합니다.",
    backEvidence: "근거로",
    recordJudgment: "판단 기록",
    doneTitle: "판단이 기록되었습니다",
    doneSubtitle: "최종 결정이 Trust Gateway 세션에 기록되었습니다.",
    decisionLabel: "결정",
    nextCase: "다음 케이스",
    statusValid: "valid",
    errors: {
      titleRequired: "제목(title)이 필요합니다.",
      objectiveRequired: "목적(objective)이 필요합니다.",
      constraintsRequired: "제약(constraints)을 1개 이상 입력하세요.",
      acceptanceRequired: "수용 기준(acceptanceCriteria)을 1개 이상 입력하세요.",
    },
    demo: {
      title: "주간 요약 초안 검토",
      objective:
        "팀 주간 활동 요약을 비식별 Fixture 기준으로 검토하고, 사람이 최종 판단을 내린다.",
      constraints: [
        "실명·실기밀·개인정보를 포함하지 않는다.",
        "외부 LLM을 호출하지 않는다.",
      ],
      acceptanceCriteria: [
        "Contract 검증이 통과한다.",
        "Evidence Pack을 확인한 뒤 Human Judgment가 기록된다.",
      ],
      items: [
        {
          claim: "주간 요약 초안에 핵심 진행 항목 3개가 포함되어 있다.",
        },
        {
          claim: "지난주와 이번 주 KPI 수치가 서로 다른 출처에서 불일치한다.",
          note: "Conflict는 Unknown과 동등하게 노출한다.",
        },
        {
          claim: "다음 주 우선순위 근거 문서가 아직 연결되지 않았다.",
          note: "Unknown은 Conflict와 동등하게 노출한다.",
        },
      ],
    },
  },
  ja: {
    brand: "Trust Gateway",
    howItWorks: "仕組み",
    langKo: "한국어",
    langJa: "日本語",
    startTitle: "AIに何を許すべきか？",
    startSubtitle:
      "結果を確認する前に、タスク・境界・必要な根拠を定義します。",
    createContract: "契約を作成",
    openDemo: "デモケースを開く",
    flowLabel: "Contract → Evidence → Judgment",
    backStart: "← 開始",
    stepOf: "ステップ {n} / 3",
    contractTitle: "契約の定義",
    contractSubtitle: "検証を始めるには、目的・制約・受入基準を定義してください。",
    fieldTitle: "契約タイトル",
    fieldTitlePh: "例: 週次サマリー草案のレビュー",
    fieldObjective: "タスクの目的",
    fieldObjectivePh: "主な目的を記述してください...",
    fieldConstraints: "制約（許可 / 境界）",
    fieldAcceptance: "承認基準",
    validateContract: "契約を検証 →",
    goJudgmentBlocked: "Reject / Hold のみ判断へ",
    loadDemo: "デモ Fixture を読み込む",
    stepContract: "Contract",
    stepEvidence: "Evidence",
    stepJudgment: "Judgment",
    evidenceEyebrow: "Evidence Review",
    evidenceTitle: "根拠の確認",
    evidenceSubtitle:
      "検証済み・未支持・衝突・未確認の項目を確認します。",
    overallLabel: "overall",
    claimLabel: "主張",
    sourceLabel: "出典",
    statusVerified: "VERIFIED",
    statusConflict: "CONFLICT",
    statusUnknown: "UNKNOWN",
    backContract: "契約へ戻る",
    proceedJudgment: "判断へ進む →",
    judgmentTitle: "最終判断",
    judgmentSubtitle: "根拠を確認したあと、最終決定は人が行います。",
    reviewSummary: "レビュー要約",
    contractStatus: "Contract",
    evidenceOverall: "Evidence overall",
    evidenceNa: "n/a（遮断パス）",
    approveBlocked:
      "Contract未通過または Evidence fail の場合、Approve は完全に遮断されます。Hold または Reject のみ可能です。",
    approve: "Approve",
    approveHint: "受入基準を満たしたと判断",
    hold: "Hold",
    holdHint: "保留 · 追加確認が必要",
    reject: "Reject",
    rejectHint: "却下 · 再作業が必要",
    judgmentReason: "判断理由",
    judgmentReasonPh: "最終決定の理由を簡潔に記入してください...",
    ackLabel:
      "最終決定と責任は人のレビュアーにあることを理解しています。",
    backEvidence: "根拠へ戻る",
    recordJudgment: "判断を記録",
    doneTitle: "判断が記録されました",
    doneSubtitle: "最終決定が Trust Gateway セッションに記録されました。",
    decisionLabel: "決定",
    nextCase: "次のケース",
    statusValid: "valid",
    errors: {
      titleRequired: "タイトル（title）が必要です。",
      objectiveRequired: "目的（objective）が必要です。",
      constraintsRequired: "制約（constraints）を1つ以上入力してください。",
      acceptanceRequired:
        "受入基準（acceptanceCriteria）を1つ以上入力してください。",
    },
    demo: {
      title: "週次サマリー草案のレビュー",
      objective:
        "チームの週次活動サマリーを非識別 Fixture 基準で確認し、人が最終判断を下す。",
      constraints: [
        "実名・機密・個人情報を含めない。",
        "外部 LLM を呼び出さない。",
      ],
      acceptanceCriteria: [
        "Contract 検証に通過する。",
        "Evidence Pack を確認したうえで Human Judgment が記録される。",
      ],
      items: [
        {
          claim: "週次サマリー草案に主要進捗項目が3つ含まれている。",
        },
        {
          claim: "先週と今週の KPI 数値が異なる出典で不一致である。",
          note: "Conflict は Unknown と同等に表示する。",
        },
        {
          claim: "来週の優先順位の根拠文書がまだ接続されていない。",
          note: "Unknown は Conflict と同等に表示する。",
        },
      ],
    },
  },
};

export function t(
  locale: Locale,
  key: Exclude<keyof Messages, "errors" | "demo">,
): string;
export function t(locale: Locale, key: "errors", code: ValidationErrorCode): string;
export function t(
  locale: Locale,
  key: Exclude<keyof Messages, "errors" | "demo"> | "errors",
  code?: ValidationErrorCode,
): string {
  const bag = messages[locale];
  if (key === "errors" && code) return bag.errors[code];
  const value = bag[key as Exclude<keyof Messages, "errors" | "demo">];
  return typeof value === "string" ? value : "";
}

export function formatStep(locale: Locale, n: number): string {
  return messages[locale].stepOf.replace("{n}", String(n));
}
