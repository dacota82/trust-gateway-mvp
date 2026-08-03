# DAKOTA Trust Gateway MVP — 기술명세서 목차 초안 (제출용)

문서 ID (안): `P51-009-GOORM-TS-001`  
버전 (안): **v1.2-draft (TOC only)**  
작성일: 2026-08-03  
상위 기준선: Vision & Planning v1.0 / Technical Spec v1.0 / **D18 Spec v1.1**  
작성 원칙: **개발은 작게 · 제출 포장은 폭포수 · 내부 Contract 방법론 비공개**

> 본 파일은 **목차와 각 절 작성 가이드**이다. 본문 확정본은 스택 분기(§0) 결정 후 `03-technical-specification-v1.2.md`로 확장한다.

---

## 0. 구현 분기 결정 (본문 작성 전 필수)

| 옵션 | 스택 | 적합한 경우 |
|------|------|-------------|
| **A. Local Trust Gateway** | Python · FastAPI · YAML/JSON · SQLite · 정적/webpack UI · `127.0.0.1` | `dakota-mvs-000` 선별 이식 |
| **B. Web Trust Gateway** | React · Vite · TypeScript · (선택) Vercel | v1.1 §15 계열 |
| **C. Next.js Trust Gateway** | **Next.js · TypeScript · Vercel** | 구름 수료 코스 권장 스택 |

- [x] **선택: C (Next.js)** — 2026-08-03 확정  
- 제출용 본문 초안: 루트 [`SPEC.md`](../SPEC.md)  
- §11 API · §15 스택 · §17 배포 · §16 DoD는 **C 기준**으로 작성한다.  
- Must Have(Contract–Evidence–Judgment)는 공통.  
- A는 참고 원본만; B는 채택하지 않음.

---

## 목차

### 표지 · 문서 통제
1. 문서명 / 문서 ID / 버전 / 작성일  
2. 기준 문서 (기획 v1.0, 기술 v1.0, D18 기술 v1.1)  
3. 적용 범위 (구름 개인 프로젝트 · Trust Gateway MVP)  
4. 문서 목적 (구현·검증·시연의 단일 기술 기준)  
5. 역할 (Product Owner / Implementer — 내부 호칭 사용 금지)  
6. 범위 원칙 (전체 플랫폼 축소 아님 · Vertical Slice만)

---

### 1. 문서 목적과 기준
- 상위 비전 한 줄  
- 핵심 철학 키워드 (공개용 표현만)  
- 보안 원칙 한 줄  
- MVP 초점: Contract 검증 · Evidence · Human Judgment  
- 본 프로젝트 구현 원칙: “끝까지 한 번 흐르는 Gateway”

**작성 가이드:** v1.1 §1을 요약 이식. “주군/한신/장자방” 등 삭제.

---

### 2. 프로젝트 정의
- 2.1 프로젝트명  
- 2.2 한 줄 정의  
- 2.3 해결할 문제 (3~4개)  
- 2.4 성공 정의 (Work Order 1건이 Contract→Evidence→Judgment까지)

**작성 가이드:** v1.1 §2 유지. 성공 정의를 이식 코드로 측정 가능하게 문장화.

---

### 3. MVP 범위와 경계
- 3.1 Must Have (표: ID / 기능 / 완료 조건)  
  - M-01 Contract 입력·검증  
  - M-02 Evidence Pack 생성·검토  
  - M-03 Human Judgment  
- 3.2 Should / Nice (최소화 — 시간 남으면)  
  - Gateway allow/hold/deny  
  - Export  
  - Fixture Load  
- 3.3 명시적 제외  
  - 다중 LLM 라우팅, RAG/Vector DB, OAuth/RBAC, 결제, 실기밀 업로드, 자동 최종 승인, 전사 Audit 전체

**작성 가이드:** Nice는 과감히 줄여 “작게 개발”과 맞출 것.

---

### 4. 사용자 및 핵심 시나리오
- 역할: Human Owner / Agent Adapter(Mock) / Validator  
- 4.1 Primary Flow (8단계 이내)  
- 4.2 (선택) 실패 시나리오: deny / conflict / fail 시 Judgment 제한

---

### 5. 논리 아키텍처
- 흐름도(텍스트 또는 간단 다이어그램)  
- 상위 DAKOTA 개념 ↔ MVP 구현 매핑 표

**작성 가이드:**  
- 옵션 A: Human UI → Gateway → CEK/Validate → Evidence/Conflict → (Judgment*) → 로컬 산출물  
- 옵션 B: v1.1 §5 유지  
\* Judgment가 아직 없으면 “후속”으로 표기하고 Must와 모순되지 않게 §3 조정.

---

### 6. 핵심 컴포넌트
- 표: 컴포넌트 / 책임 / 입력 / 출력  
- 옵션 A 예시: Contract·Constraints YAML, Gateway(+permissions), CEK evaluate, Handoff bus, UI, runs store  
- 옵션 B 예시: v1.1 §6 (ContractEditor … ExportService)

---

### 7. 기능 요구사항
- FR 표: ID / 요구사항 / 상세 / 우선순위 (Must/Should)  
- v1.1 FR-001~012를 베이스로, **미구현은 Should 또는 제외로 강등**

---

### 8. 데이터 모델
- Contract / WorkOrder / GatewayDecision / EvidencePack / Conflict / Unknown / HumanJudgment  
- 옵션 A: YAML/JSON 필드명으로 재기술  
- 옵션 B: v1.1 TypeScript interface 유지

---

### 9. 상태 및 의사결정 모델
- Contract / Gateway / Evidence / Judgment 상태 전이  
- 자동화 경계: **최종 Approve는 인간만**

---

### 10. UI/UX 명세
- 화면 목록과 Primary Action  
- 최소화·여백 원칙 (대시보드화 금지)  
- Conflict/Unknown 동등 노출  
- 민감정보 입력 금지 경고

**작성 가이드:** 옵션 A는 기존 1페이지 validate UI를 “시연 화면”으로 매핑하고, Judgment UI 유무를 솔직히 기입.

---

### 11. API 및 서비스 명세
- 옵션 A: `GET /health`, `POST /v1/cek/validate`, `POST /v1/gateway/run`, `GET|POST /v1/handoff…`, `GET /v1/runs`  
- 옵션 B: v1.1 `/api/gateway/evaluate` 등  
- 공통: localhost only / 인증 없음(명시) / 외부 AI 기본 미호출

---

### 12. 보안·프라이버시
- SEC-01~06 요약 (외부 전송 금지, 키 보호, Fixture만, 자동승인 금지, Export 주의, 로그 최소화)  
- 제출본: API 키·실명 호칭·내부 메소드명 금지

---

### 13. Validation과 Evidence 규칙
- Contract 검증 규칙  
- Evidence / Conflict / Unknown 규칙  
- Judgment 허용 매트릭스 (pass/conditional/fail)

---

### 14. 비기능 요구사항
- 성능 · 신뢰성 · 사용성 · 추적성 · 유지보수성  
- 배포성: 옵션 A = 로컬 기동 재현 / 옵션 B = build + (선택) 호스팅

---

### 15. 기술 스택 및 디렉토리
- 확정 스택 표  
- 디렉토리 트리 (제출 레포 실제 구조와 일치시킬 것)  
- `dakota-mvs-000`과의 관계: **참고 원본, Git 미연결**

---

### 16. 테스트·수용 기준
- AC-01~ 표 (시나리오 / 기대 결과)  
- Definition of Done  
  - Must 동작  
  - Fixture로 Primary Flow 시연  
  - 테스트(또는 수동 체크리스트) 통과  
  - README + 본 SPEC 포함  
  - 옵션 A: local smoke / 옵션 B: build (+ 선택 production smoke)  
  - 비밀정보 없음

---

### 17. 빌드·실행·운영 (폭포수 “배포” 절)
- 설치 · 실행 명령  
- 환경 (OS, Python/Node 버전)  
- Smoke Test 절차  
- Checkpoint 커밋 규칙  
- (옵션 B만) 호스팅 URL

**작성 가이드:** “배포” 대신 **실행·재현**으로 제목을 바꿔도 과제 취지에 맞으면 사용.

---

### 18. 제외 범위와 후속 로드맵
- D18 MVP / 후속 Gateway·Security·Routing·CEK 확장 / Pilot  
- 상위 비전 불변 · 단계별 별도 검증

---

### 19. 변경관리
- 버전 표: As-Was / As-Is / 제안자 / 일자  
- v1.0 → v1.1 → **v1.2(제출용: 스택 실체 반영, 역할명 정화, Must 축소)**

---

### 부록
- A. Demo Fixture (비식별)  
- B. 용어집 (Contract, Evidence, Conflict, Unknown, Judgment, Gateway)  
- C. (선택) 시연 스크립트 체크리스트  
- D. (선택) 기존 연구 레포와의 차이 — **방법론 비공개, 기능 매핑만**

---

## 다음 작업 (이 폴더에서의 진행 순서)

1. ~~§0 분기 결정~~ → **C(Next.js) 확정**  
2. ~~SPEC 초안~~ → 루트 `SPEC.md` v0.1-draft  
3. SPEC 리뷰 후 v0.2 확정 (Must/AC 문구)  
4. Next.js Setup + GitHub  
5. Must 3만 구현 → Vercel → README/발표자료
