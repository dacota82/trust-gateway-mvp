# 상위 문서 리뷰 (기획서 v1.0 · 기술명세서 v1.0 · v1.1)

작성일: 2026-08-03  
대상 폴더: `goorm-20260805-Trust Gateway MVP`  
목적: 제출용 기술명세서 목차 작성 **전** 기준선 정리

---

## 1. 한 줄 평가

| 문서 | 역할 | 성숙도 |
|------|------|--------|
| Vision & Planning v1.0 | 비전·철학·로드맵 스케치 | **얇음** (목차급) |
| Technical Spec v1.0 | 플랫폼 개념 요약 | **얇음** (목차급) |
| Technical Spec v1.1 (D18) | 실제 구현 계약 | **실질 기준선** |

제출용 기술명세서는 **v1.1을 모체로**, v1.0 둘은 **상위 비전 인용용**으로 두는 것이 맞다.

---

## 2. 잘된 점 (v1.1)

1. **Vertical Slice**가 분명함: Contract → Evidence → Human Judgment.
2. Must / Nice / 제외가 표로 분리되어 폭포수 제출에 적합.
3. Primary Flow · AC(수용 기준) · DoD가 있어 검증 가능.
4. 보안 원칙(외부 AI 기본 미사용, 민감정보 금지, 자동 Approve 금지)이 일관됨.
5. 상위 DAKOTA와 D18 범위를 분리해 “전체를 축소한 척”하지 않음.

---

## 3. 위험·불일치 (반드시 결정 필요)

### 3.1 구현 실체와 스택 충돌

| v1.1 가정 | `dakota-mvs-000` 실체 |
|-----------|----------------------|
| React 18 / Vite / TS / Tailwind | Python + FastAPI + 정적/webpack UI |
| Client-only 또는 Vercel | localhost `127.0.0.1` |
| ContractEditor 등 3단계 Wizard | CEK YAML + Gateway + Handoff + Validate UI |
| `/api/gateway/evaluate` 등 | `/v1/cek/validate`, `/v1/gateway/run`, `/v1/handoff` |
| LocalStorage 세션 | SQLite `runs` + YAML 산출물 |
| Production Smoke (Vercel) | 로컬 검증 중심 |

**결론:** 제출 폴더에서 `dakota-mvs-000`을 이식하면, 기술명세서 **§15 스택·§11 API·§17 배포**를 **재작성**해야 한다.  
반대로 v1.1 스택을 그대로 따르면 **새 React MVP**를 처음부터 만들어야 한다.

→ 목차 초안은 **“스택 분기 결정”을 문서 앞쪽에 두는 구조**로 작성함.

### 3.2 공개·제출에 부적합한 표현

v1.1에 내부 협업 용어가 남아 있음:

- 승인권자: “주군”
- 구현 파트너: “Cursor(한신)”
- 변경관리: “장자방 제안”

제출본에서는 **역할명만** 남기는 것을 권장 (예: Product Owner / Implementer / Reviewer).

### 3.3 v1.0 두 문서의 한계

- 비전·철학·CEK 키워드 나열 수준.
- MVP 단계(MVP-0~4)와 v1.1 D18 슬라이스가 용어는 맞지만 **상세가 없음**.
- 변경관리 표만 있고 본문이 거의 없음.

제출 시: “상위 기준선으로 v1.0 인용, **규범은 v1.1(+제출용 v1.2)**”라고 명시.

### 3.4 범위 팽창 유혹

v1.1 Nice-to-Have(Export, Policy)와 Should(FR-010~012), Vercel DoD까지 모두 넣으면  
“작게 개발”과 충돌한다.

제출용 권장 컷:

- **Must만 약속** (Contract 검증 · Evidence · Judgment)
- Gateway Policy / Export / 배포 URL은 **선택 또는 후속**으로 강등 가능
- 실제 이식 코드가 Python localhost면, DoD의 Vercel 항목을 **로컬 Smoke로 대체**

---

## 4. 기획서(v1.0) ↔ 기술명세(v1.1) 정합

| 기획 키워드 | v1.1 반영 |
|-------------|-----------|
| Human First | 유지 |
| Zero / Nature / Contract / Evidence / Human Judgment | CEK·Judgment로 구체화 |
| Gateway → … → Human | 논리 아키텍처로 축소 매핑 |
| MVP-0 CEK … MVP-4 UI | D18은 CEK+Gateway 최소 + UI 슬라이스 |
| 실험 기반 로드맵 | 제출 문서에서는 “단계적 검증”으로만, 내부 실험번호는 비공개 |

정합도는 **방향은 일치**, **깊이는 v1.1만 구현 가능 수준**.

---

## 5. 제출 폴더 작업 가이드 (권장 순서)

1. ~~스택 분기 결정~~ → **C) Next.js · TypeScript · Vercel** (2026-08-03)  
2. 제출용 본문: 루트 **`SPEC.md`** (상세 목차는 `02-…-TOC.md`)  
3. Must/제외/AC 확정 후 Next.js로 Must만 구현  
4. Git은 **새 레포**, `dakota-mvs-000`은 참고만

---

## 6. 리뷰 결론

- **채택:** v1.1의 Vertical Slice · Must Have · AC · 보안 원칙.
- **수정 후 채택:** 스택/API/배포/역할명 (제출·실구현에 맞게).
- **참고만:** Vision/Spec v1.0.
- **숨김:** 내부 Contract 방법론·실험 번호·호칭.
