# Trust Gateway MVP — 발표자료 초안 (7장)

**용도:** 구름 바이브코딩 Demo Day · 1인 5~7분  
**구성:** Problem → Idea → Solution → Architecture → Demo → Learning → Next  
**Live URL:** https://trust-gateway-mvp.vercel.app  

> Canva / Google Slides / PowerPoint에 아래 장을 그대로 옮겨 쓰세요.  
> 각 장 **말할 말**은  Speakers notes 입니다.

---

## Slide 01 — Title

**Trust Gateway MVP**  
Contract → Evidence → Judgment

한 줄: AI/Agent 산출물을 사람이 검증하는 최소 게이트웨이

- GitHub: `dacota82/trust-gateway-mvp`
- Live: trust-gateway-mvp.vercel.app

**말할 말 (20초)**  
“안녕하세요. Trust Gateway MVP입니다. Agent 결과를 바로 승인하지 않고, 계약·근거·사람 판단 세 단계로 나누는 웹앱입니다.”

---

## Slide 02 — 해결하려는 문제

1. Agent 산출물 ≠ 사람 승인인데 섞이면 **책임이 흐려짐**
2. 대시보드형 UI는 **이틀 MVP·5분 시연**에 부적합
3. 외부 LLM 호출 시 **보안·프라이버시** 위험

**말할 말 (40초)**  
“실무에서 AI 초안이 곧바로 ‘확정’처럼 쓰이는 문제를 봤습니다. 그래서 범위를 한 건의 Work Order로 줄이고, 외부 AI는 기본으로 쓰지 않았습니다.”

---

## Slide 03 — 핵심 기능 (Must 3)

| Must | 한 줄 |
|------|--------|
| Contract | 목적·제약·수용 기준 검증 |
| Evidence | VERIFIED / CONFLICT / UNKNOWN |
| Judgment | Approve / Reject / Hold · 자동 승인 없음 |

**규칙 강조:** 검증 실패 시 **Approve 완전 차단**

**말할 말 (50초)**  
“기능은 세 개만 약속했습니다. 검증이 실패하면 Approve 버튼 자체를 막아, 사람이 책임지고 Hold나 Reject만 하게 했습니다.”

---

## Slide 04 — Architecture / Tech Stack

```
User → Next.js UI → Validate / Fixture → Judgment record
         (외부 LLM 없음)
```

- Next.js · TypeScript · Tailwind · Vercel  
- i18n: 한국어 / 日本語 / EN  
- SPEC.md 기반 Vertical Slice

**말할 말 (40초)**  
“구조는 단순합니다. 브라우저에서 계약과 근거를 보고, 로컬 규칙으로 검증한 뒤 판단을 기록합니다. 배포는 Vercel입니다.”

---

## Slide 05 — Live Demo

브라우저에서 URL을 연다.

1. Open Demo Case  
2. Validate → Evidence  
3. Judgment → Record  
4. (여유 시) 필드 비우기 → Approve 차단

**말할 말 (90~120초)**  
“지금 라이브로 보여드리겠습니다.”  
*(데모 중에는 슬라이드를 멈추고 URL만 공유)*

---

## Slide 06 — 개발 과정에서 배운 점

- **작게:** Must 3만 · Nice는 과감히 컷  
- **스택 확정:** 코스 요구(Vercel)에 맞춰 Next.js  
- **UI:** Stitch 디자인을 SPEC에 맞게 축소 이식  
- **카피 정리:** AI Confidence·원장/암호 문구는 제거  
- **다국어:** ko / ja / en

**말할 말 (40초)**  
“가장 큰 결정은 ‘무엇을 안 할지’였습니다. 배포 가능한 한 줄 흐름을 먼저 만들고, 그다음 UI와 언어를 얹었습니다.”

---

## Slide 07 — 향후 발전

- 실 Agent Adapter 연동  
- Gateway Policy 고도화  
- Audit / Export · 인증  

**말할 말 (20초)**  
“다음으로는 실제 Agent 연동과 감사 기록을 붙이되, 사람 최종 승인 원칙은 유지하겠습니다. 감사합니다.”

---

## 타임박스 (총 ~6분)

| Slide | 내용 |
|------|------|
| 01–04 설명 | ~2분 30초 |
| 05 Live Demo | ~2분 |
| 06–07 | ~1분 |
| 여유/질의 | 나머지 |

> Demo 중 입력 이슈가 있으면 [`debugging-report.md`](debugging-report.md) BUG-001(수정 완료)을 참고.

## 체크리스트 (발표 전)

- [ ] Vercel URL이 시크릿/다른 기기에서 열리는지  
- [ ] Demo Case 기본 경로 1회 성공  
- [ ] Approve 차단 경로 1회  
- [ ] 언어 전환 1회  
- [ ] 슬라이드 7장 최종본(Canva 등) 저장  
