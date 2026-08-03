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

**게이트 두 방향**

| 앞단 (Egress) | 뒷단 (Ingress) |
|---------------|----------------|
| LLM에 **보내도 되는지** | LLM/Agent 결과를 **받아들여도 되는지** |
| 후속: Policy | **이번 MVP 구현** |

**말할 말 (40초)**  
“실무에서는 문장 다듬기에 LLM을 씁니다. Trust Gateway는 앞단에서 보내도 되는지, 뒷단에서 받아들여도 되는지를 가르는 문입니다. 이번 제출본은 뒷단 Judgment 슬라이스입니다.”

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
User → Next.js UI → Validator → Evidence / Judgment
                      ↓
         Local rules engine (no LLM)
```

- **Validator = Local rules engine (no LLM)**  
  (`lib/validate.ts` 필수값·Approve 차단 규칙)
- Next.js · TypeScript · Tailwind · Vercel  
- i18n: 한국어 / 日本語 / EN  
- SPEC.md 기반 Vertical Slice

**말할 말 (40초)**  
“검증은 외부 LLM이 아닙니다. Validator는 로컬 규칙 엔진이고, 키 없이도 데모됩니다. 브라우저에서 계약과 근거를 본 뒤 사람이 최종 판단합니다.”

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

거버넌스 우선 (사람 최종 승인 유지)

1. Gateway Policy — **앞단 Egress** + 시스템 권고 (allow/hold/deny)  
2. Audit / Export — 판단 기록 재열람  
3. 그다음 Agent 연동 · 인증

**말할 말 (20초)**  
“다음 단계는 앞단—LLM에 보내도 되는지—Policy를 붙이고, Audit로 기록을 남기겠습니다. 최종 승인은 계속 사람의 몫입니다. 감사합니다.”

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
