# SPEC — Trust Gateway MVP

| 항목 | 값 |
|------|-----|
| 문서 | `SPEC.md` (구름 바이브코딩 수료 제출용) |
| 버전 | **v0.2-draft** |
| 작성일 | 2026-08-03 |
| 스택 확정 | **Next.js · TypeScript · Tailwind · Vercel** |
| 상위 기준 | D18 Technical Spec v1.1 (공개용으로 축소) |
| 작성 원칙 | 개발은 작게 · 제출 포장은 명확 · 내부 방법론 비공개 |

### 제품 결정 (2026-08-03 확정)

| # | 항목 | 결정 |
|---|------|------|
| 1 | Demo Fixture 주제 | **주간 요약 초안 검토** |
| 2 | Styling | **Tailwind CSS** (단일) |
| 3 | 검증 실패 시 Approve | **완전 차단** (Reject / Hold만 가능) |

---

## 1. 프로젝트 한 줄

**Trust Gateway MVP** — AI/Agent 작업 결과를 사람이 **Contract → Evidence → Judgment** 순으로 검증·승인하는 최소 게이트웨이 웹앱.

---

## 2. 해결하려는 문제

1. Agent 산출물이 곧바로 “승인된 결과”처럼 쓰이면, 계약·근거·판단이 섞여 책임 소재가 흐려진다.
2. 검증 UI가 대시보드·로그 나열로 커지면, 시연·학습용 MVP에서 **한 건의 Work Order를 끝까지** 보여주기 어렵다.
3. 외부 LLM에 민감 입력을 넣는 순간 보안·프라이버시 경계가 무너진다. (본 MVP는 **외부 AI 기본 미사용**)

---

## 3. 성공 정의 (Definition of Success)

데모 Fixture 1건으로 다음이 **한 화면 흐름**에서 완료된다.

1. Contract 입력·검증 통과  
2. Evidence Pack 생성·검토 가능  
3. Human Judgment(Approve / Reject / Hold) 기록  
4. Vercel Production URL에서 타인이 동일 흐름을 재현 가능  

---

## 4. 사용자

| 역할 | 설명 |
|------|------|
| Human Owner | Contract 확인, Evidence 검토, 최종 Judgment |
| Agent Adapter (Mock) | Fixture로 Evidence/결과를 공급 (실 Agent 연동 제외) |
| Validator (시스템) | Contract 규칙 검사, Evidence/Conflict/Unknown 분류 |

---

## 5. MVP 범위

### 5.1 Must Have (3)

| ID | 기능 | 완료 조건 |
|----|------|-----------|
| **M-01** | Contract 입력·검증 | 필수 필드 검증; 실패 시 오류 표시, **Approve 완전 차단** (Reject/Hold만 가능) |
| **M-02** | Evidence Pack 생성·검토 | pass / conflict / unknown을 구분해 표시 |
| **M-03** | Human Judgment | Approve / Reject / Hold 중 하나 기록; **자동 Approve 금지** |

### 5.2 Nice to Have (최대 2 — 시간 남을 때만)

| ID | 기능 | 비고 |
|----|------|------|
| N-01 | Gateway allow / hold / deny 프리뷰 | Judgment 전 시스템 권고만 |
| N-02 | Fixture Load / JSON Export | 시연·제출 편의 |

### 5.3 명시적 제외

- 다중 LLM 라우팅, RAG / Vector DB  
- OAuth / RBAC, 결제  
- 실기밀·실명 데이터 업로드  
- 자동 최종 승인  
- 전사 Audit / 운영 콘솔 전체  
- `dakota-mvs-000` Python 스택 이식 (참고만, Git 미연결)

---

## 6. Primary Flow (데모 스크립트)

1. 앱 진입 → Demo Fixture 로드 (또는 샘플 Contract 표시)  
2. Contract 필수 항목 확인 → **Validate**  
3. 검증 통과 시 Evidence Pack 생성  
4. Conflict / Unknown이 있으면 동등하게 노출  
5. Human Owner가 **Approve / Reject / Hold** 선택·저장  
6. 결과 요약(상태 + 시각) 확인 → 시연 종료  

실패 경로: Contract 검증 실패 또는 Evidence `fail`이면 **Approve는 완전 차단**. Reject / Hold만 제출 가능.

---

## 7. 화면 (최소화)

| 화면/구역 | Primary Action |
|-----------|----------------|
| Contract | Validate |
| Evidence | Review (읽기 중심) |
| Judgment | Submit decision |
| (선택) Result Summary | Reset / Load Fixture |

원칙: 첫 화면은 **한 건의 게이트웨이 흐름**만. 통계·카드 나열·대시보드화 금지.

---

## 8. 논리 아키텍처

```
User (Browser)
  ↓
Next.js Web App (App Router)
  ↓
UI: Contract → Evidence → Judgment
  ↓
Route Handler / Server Action
  ↓
Local rules engine (JSON Fixture + validation)
  ↓  (외부 LLM 기본 호출 없음)
Result (session 또는 ephemeral store)
```

코스 권장 패턴과 정합. Agent/Tool Registry는 후속.

---

## 9. 데이터 모델 (초안)

```ts
type ContractStatus = "draft" | "valid" | "invalid";
type EvidenceStatus = "pass" | "conditional" | "fail";
type JudgmentDecision = "approve" | "reject" | "hold";

interface Contract {
  id: string;
  title: string;
  objective: string;
  constraints: string[];
  acceptanceCriteria: string[];
  status: ContractStatus;
}

interface EvidenceItem {
  id: string;
  claim: string;
  source: string;
  status: "ok" | "conflict" | "unknown";
  note?: string;
}

interface EvidencePack {
  workOrderId: string;
  items: EvidenceItem[];
  overall: EvidenceStatus;
}

interface HumanJudgment {
  workOrderId: string;
  decision: JudgmentDecision;
  rationale: string;
  decidedAt: string; // ISO
}
```

저장: MVP는 **클라이언트 세션(또는 메모리)** 우선. DB는 제외.

---

## 10. 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-001 | Contract 필수 필드 검증 | Must |
| FR-002 | 검증 오류 메시지 표시 | Must |
| FR-003 | Evidence Pack 렌더링 | Must |
| FR-004 | Conflict / Unknown 구분 표시 | Must |
| FR-005 | Judgment 3종 기록 | Must |
| FR-006 | 자동 Approve 경로 없음 | Must |
| FR-006b | Contract invalid 또는 Evidence `fail` 시 Approve UI·제출 **완전 차단** | Must |
| FR-007 | Demo Fixture 1건 제공 — 주제: **주간 요약 초안 검토** | Must |
| FR-008 | API Key 코드 미포함 | Must |
| FR-009 | Gateway 권고(allow/hold/deny) | Nice |
| FR-010 | Export JSON | Nice |

---

## 11. 보안·프라이버시

| ID | 규칙 |
|----|------|
| SEC-01 | 외부 AI/LLM **기본 미호출** (키 불필요 설계 우선) |
| SEC-02 | 실기밀·개인정보 입력 금지 안내 |
| SEC-03 | 환경변수에 비밀이 생기면 `.env*`는 Git 제외 |
| SEC-04 | 최종 Approve는 인간만 |
| SEC-05 | 로그·Export에 민감정보 넣지 않음 |

---

## 12. 기술 스택

| 영역 | 선택 |
|------|------|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| 검증/데모 데이터 | JSON Fixture |
| Hosting | **Vercel** Production |
| 패키지 매니저 | pnpm 또는 npm (setup 시 1개로 고정) |
| 참고 원본 | `dakota-mvs-000` — **참고만, Git 서브모듈/복사 금지** |

### 디렉토리 (예정)

```
/
  SPEC.md
  README.md
  docs/                 # 내부 리뷰·목차 (제출 보조)
  app/                  # Next.js App Router
  components/
  lib/                  # validate, evidence, judgment
  fixtures/
  public/
```

---

## 13. 수용 기준 (Acceptance Criteria)

| ID | 시나리오 | 기대 결과 |
|----|----------|-----------|
| AC-01 | Fixture Contract Validate | `valid` 또는 명확한 오류 |
| AC-02 | Evidence 화면 | 항목 ≥1, overall 상태 표시 |
| AC-03 | Judgment Submit | decision + rationale + timestamp 표시 |
| AC-04 | 검증 실패 또는 Evidence `fail` 후 Approve | **완전 차단** (버튼 비활성 또는 제출 거부) |
| AC-05 | Production URL | 로그인 없이 데모 흐름 가능 |
| AC-06 | Repo | README + SPEC + 소스, 비밀키 없음 |

---

## 14. Definition of Done

- [ ] Must Have 3개 동작  
- [ ] Fixture로 Primary Flow 5분 Live Demo 가능  
- [ ] `SPEC.md` + README(포트폴리오형)  
- [ ] GitHub Repository  
- [ ] Vercel Production URL  
- [ ] 발표자료 5~7장  
- [ ] API Key / 실기밀 없음  

---

## 15. 빌드·배포 (예정 명령)

```bash
# local
npm install   # 또는 pnpm install
npm run dev

# production
npm run build
# Vercel: GitHub 연동 + Production Deploy
```

환경: Node.js LTS. OS 무관(Windows/macOS/Linux).

---

## 16. 후속 (본 MVP 밖)

- 실 Agent Adapter 연동  
- Gateway Policy 엔진 고도화  
- Audit / Export 운영 기능  
- 인증·권한  

---

## 17. 변경 이력

| 버전 | 일자 | 내용 |
|------|------|------|
| v0.1-draft | 2026-08-03 | 스택 **Next.js** 확정, Must 3·코스 5종 산출물 정합 SPEC 초안 |
| v0.2-draft | 2026-08-03 | Fixture=주간 요약 · Tailwind · Approve 완전 차단 확정 |

---

## 부록 A. Demo Fixture (확정 주제)

- **Work Order:** 주간 요약 초안 검토  
- Contract: 목적 1문장, 제약 2개, 수용기준 2개  
- Evidence: ok 1 · unknown 1 (conflict는 선택 데모용)  
- 시연 기본 경로: 검증 통과 → Evidence 검토 → **Approve**  
- 시연 실패 경로: 필드를 비워 Validate → Approve 불가 확인 → Reject 또는 Hold  

(본문 파일: 구현 시 `fixtures/demo-work-order.json`)
