# MVP 현황 스냅샷 (2026-08-03)

작성 목적: 제출 5종·DoD 대비 현황화. PPTX(`Trust-Gateway-MVP.pptx`) 리뷰와 병행.

---

## 1. 한 줄 현황

**제출 가능한 MVP 본체는 완성.**  
남은 것은 발표 PPT 최종 점검·리허설·(선택) 스크린샷 첨부 정도.

| 산출물 | 상태 | URL / 경로 |
|--------|------|------------|
| ① SPEC | ✅ v0.3-draft | `SPEC.md` |
| ② Web App | ✅ Must 3 + UI + i18n | Live 동작 |
| ③ GitHub | ✅ | https://github.com/dacota82/trust-gateway-mvp |
| ④ Vercel | ✅ Production | https://trust-gateway-mvp.vercel.app |
| ⑤ 발표자료 | ✅ Gamma → PPTX | `Downloads\Trust-Gateway-MVP.pptx` |

---

## 2. 제품·구현 현황

### 확정 결정
- 스택: Next.js · TypeScript · Tailwind · Vercel  
- Fixture: 주간 요약 초안 검토  
- Approve: 검증 실패 시 **완전 차단**  
- 게이트 비전: 앞단(Egress)+뒷단(Ingress) · **MVP=뒷단**  
- i18n: ko / ja / en (기본 ko)  
- Validator: Local rules (`lib/validate.ts`), **no LLM**

### Must Have
| ID | 기능 | 상태 |
|----|------|------|
| M-01 Contract | 입력·검증 | ✅ |
| M-02 Evidence | VERIFIED/CONFLICT/UNKNOWN | ✅ |
| M-03 Judgment | Approve/Reject/Hold | ✅ |

### 부가 구현
- Stitch revised UI 톤 ✅  
- 브랜드 클릭 → Home ✅  
- BUG-001 입력 포커스 수정 ✅ (`docs/debugging-report.md`)

### 명시적 비구현 (정상)
- 앞단 Egress UI / 실 LLM 호출  
- 실 Agent Adapter · DB · OAuth  
- AI Confidence / 암호·원장 카피  

---

## 3. 문서 현황

| 문서 | 역할 |
|------|------|
| `README.md` | 포트폴리오형 |
| `SPEC.md` | 제출 명세 v0.3 |
| `docs/presentation-draft.md` | 7장 초안 + 말할 말 |
| `docs/gamma-prompt.md` | Gamma 프롬프트 |
| `docs/debugging-report.md` | BUG-001 |
| `docs/00-…` / `02-…` | 내부 리뷰·목차 |

---

## 4. PPTX 리뷰 요약

파일: `c:\Users\sfguy\Downloads\Trust-Gateway-MVP.pptx` (7장)

**잘된 점**
- 7장 구성·Live/GitHub URL·Must 3·Validator(no LLM)·앞/뒷단·거버넌스 로드맵이 문서와 정합
- Demo 장에 URL 중심 · “브라우저 시연이 본체” 안내 있음
- Slide 06에 디버깅 학습(포커스/Shell)까지 반영

**수정 권장 (발표 전)**
1. Slide 04 화살표/문구 깨짐 여부 확인 (`→`가 `?`로 보인 구간) — PPT에서 폰트·기호 점검  
2. Slide 05에 Live URL을 **발표 중 클릭 가능 하이퍼링크**로  
3. (선택) Evidence 화면 스크린샷 1장만 Slide 03 또는 05에  
4. 말할 말(스피커 노트)은 `presentation-draft.md`를 보면서 리허설  

**코스 체크리스트 대비 PPT**
- 문제 → 기능 → Architecture → Demo → Learning → Next ✅  
- 5분 Live Demo 중심 구조 ✅  

---

## 5. DoD / 코스 체크리스트

| 항목 | 상태 |
|------|------|
| 이름·한 줄 설명 | ✅ |
| 문제 정의 | ✅ |
| SPEC.md | ✅ |
| 핵심 기능 3+ | ✅ |
| API Key 미노출 | ✅ (키 없음) |
| GitHub + README | ✅ |
| Vercel Production | ✅ |
| 타인 URL 사용 가능 | ✅ (사용자 확인) |
| 발표자료 | ✅ PPTX |
| 5분 Live Demo | ⬜ 리허설 권장 |

---

## 6. 지금 하면 좋은 일 (우선순)

1. PPTX Slide 04 기호/한글 깨짐 육안 확인 후 저장  
2. 5분 리허설 1회 (성공 경로 + Approve 차단)  
3. (선택) 스크린샷을 `docs/screenshots/`에 넣고 README §6 갱신  
4. Demo Day 당일: 시크릿 창에서 Live URL 한 번 더 확인  

---

## 7. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-08-03 | 최초 현황 스냅샷 · PPTX 7장 리뷰 |
