# Trust Gateway MVP

AI/Agent 산출물을 **Contract → Evidence → Judgment** 순으로 사람이 검증하는 최소 게이트웨이 웹앱.

**Live Demo:** https://trust-gateway-mvp.vercel.app  
**GitHub:** https://github.com/dacota82/trust-gateway-mvp  
**SPEC:** [SPEC.md](SPEC.md)

---

## 1. 프로젝트 소개

구름 바이브코딩 수료 개인프로젝트입니다.  
Trust Gateway는 **앞단(Egress)·뒷단(Ingress)** 모두 겨냥합니다.

| 방향 | 질문 | 이번 MVP |
|------|------|----------|
| 앞단 | 외부 LLM에 **보내도 되는가?** | 비전·후속 Policy |
| 뒷단 | 나온 결과를 **사람이 수용해도 되는가?** | **Contract → Evidence → Judgment 구현** |

Agent 결과를 “바로 승인된 것”처럼 쓰지 않고, 계약·근거·사람 판단으로 책임을 분리합니다.

- 외부 LLM **기본 미호출** (키 없이도 데모 가능) · Validator = Local rules engine
- 데모 Fixture: **주간 요약 초안 검토**
- UI 언어: **한국어 / 日本語 / EN**

---

## 2. 해결하려는 문제

1. Agent 산출물과 사람 승인이 섞이면 **책임 소재**가 흐려진다. (뒷단)
2. 기능이 많은 대시보드형 UI는 이틀 MVP·5분 시연에 맞지 않는다.
3. 민감 입력을 외부 AI에 넣는 순간 **보안 경계**가 무너진다. (앞단)  
   실무의 “LLM으로 문장 다듬기”는 일반적이나, **보내기 전·확정 전**에 사람 책임의 문이 필요하다.

---

## 3. 주요 기능 (Must Have 3)

| ID | 기능 | 설명 |
|----|------|------|
| M-01 | Contract 입력·검증 | 제목·목적·제약·수용 기준 검증 |
| M-02 | Evidence Pack 검토 | VERIFIED / CONFLICT / UNKNOWN 동등 노출 |
| M-03 | Human Judgment | Approve / Reject / Hold 기록 · **자동 Approve 없음** |

**규칙:** Contract 미통과 또는 Evidence `fail`이면 **Approve 완전 차단** (Reject/Hold만 가능).

Nice (선택): Demo Fixture 로드, 다국어 전환.

---

## 4. Architecture

```
User (Browser)
  ↓
Next.js App Router + Tailwind UI
  ↓
Contract → Evidence → Judgment (client flow)
  ↓
Local validation rules + JSON Fixture
  ↓  (외부 LLM 기본 호출 없음)
Session result (Judgment record)
```

한 화면에서 **한 건의 Work Order**만 끝까지 흐르게니다.

---

## 5. Tech Stack

| 영역 | 선택 |
|------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | ko / ja / en (client locale) |
| Hosting | Vercel Production |
| Spec | SPEC.md |

---

## 6. Screenshots

Live URL에서 아래 화면을 캡처해 발표·README에 붙이면 됩니다.

1. Start — Create Contract / Open Demo Case  
2. Contract — Validate  
3. Evidence — VERIFIED / CONFLICT / UNKNOWN  
4. Judgment — Approve 차단 또는 Record  
5. Done — Judgment Recorded  

(저장 위치 예: `docs/screenshots/`)

---

## 7. Getting Started

```bash
npm install
npm run dev
```

브라우저: http://localhost:3000

```bash
npm run build
npm start
```

---

## 8. Deployment

| 항목 | URL |
|------|-----|
| Production | https://trust-gateway-mvp.vercel.app |
| Repository | https://github.com/dacota82/trust-gateway-mvp |

환경 변수(API Key) 불필요. `.env`에 비밀키를 두지 않습니다.

---

## 9. 향후 발전 방향

방향은 **거버넌스 강화**를 우선합니다. 최종 Approve는 계속 사람만 합니다.

| 단계 | 항목 | 왜 다음인가 |
|------|------|-------------|
| **1** | Gateway Policy (allow / hold / deny) | **앞단(Egress)** 포함: LLM에 보내도 되는지 시스템 권고. Judgment 전 권고와도 연결 |
| **2** | Audit / Export | 판단·근거 요약을 다시 열어볼 수 있게 |
| **3** | 실 Agent Adapter | Fixture Mock을 실제 Agent 입력으로 교체 |
| **후속** | 인증·권한 | 누가 판단했는지 구분 |

**불변 원칙:** 자동 최종 승인 없음 · Conflict/Unknown 동등 노출 · 민감정보·외부 LLM 기본 미사용.

---

## 문서

| 파일 | 설명 |
|------|------|
| [SPEC.md](SPEC.md) | 제출용 기술명세 |
| [docs/presentation-draft.md](docs/presentation-draft.md) | 발표자료 초안 (7장) |
| [docs/gamma-prompt.md](docs/gamma-prompt.md) | **Gamma 붙여넣기 프롬프트** |
| [docs/debugging-report.md](docs/debugging-report.md) | 디버깅 리포트 (BUG-001 입력 포커스) |
| [docs/00-upstream-docs-review.md](docs/00-upstream-docs-review.md) | 상위 문서 리뷰 |
| [docs/02-technical-specification-TOC.md](docs/02-technical-specification-TOC.md) | 상세 목차 |

## Demo 스크립트 (5분)

1. EN/한국어/日本語 전환 확인  
2. **Open Demo Case** → Validate Contract  
3. Evidence 카드 확인 → Proceed to Judgment  
4. Approve 선택 · 근거 작성 · Record  
5. (선택) 필드를 비워 Validate → Approve 차단 시연  

## 진행 원칙

- 개발은 작게 (Must Vertical Slice)
- 제출 5종: SPEC → Web App → GitHub → Vercel → 발표자료
- 내부 Contract 방법론·실험 번호 비공개
