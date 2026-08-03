# Gamma용 프롬프트 — Trust Gateway MVP

아래 블록을 Gamma에 **그대로 붙여넣기** 하세요.  
(`docs/presentation-draft.md` 내용을 Gamma 입력용으로 정리한 것입니다.)

---

## 붙여넣기용 프롬프트

```
안녕 감마

첨부(아래) 슬라이드 초안 텍스트를 바탕으로, 바이브코딩 엔지니어 동료들이 주로 참석하는 발표회용 발표자료를 구성해줘.

제약·톤
- 시인성과 가독성 최우선
- 장당 텍스트는 최소 (한 장 = 제목 + 핵심 3줄 이내 + 필요 시 표 1개)
- 장식·도표·아이콘 남발 금지. 여백을 넉넉히
- 톤: 전문적·차분·신뢰 (과도한 마케팅 문구 금지)
- 언어: 한국어 (고유명사·흐름명은 영문 유지: Contract, Evidence, Judgment, Trust Gateway)
- 분량: 정확히 7장
- 발표 시간: 5~7분 (Live Demo 장이 중심)

프로젝트 한 줄
Trust Gateway MVP — 민감·책임 있는 내용을 LLM에 넘기거나(앞단), LLM/Agent 결과를 확정하기 전(뒷단)에 Contract → Evidence → Judgment로 거치는 게이트웨이.
이번 제출본 구현 = 뒷단(Ingress) 슬라이스. Validator = Local rules engine (no LLM).

링크 (Demo 장에 크게)
- Live: https://trust-gateway-mvp.vercel.app
- GitHub: https://github.com/dacota82/trust-gateway-mvp

---

[Slide 01 — Title]
제목: Trust Gateway MVP
부제: Contract → Evidence → Judgment
한 줄: AI/Agent 산출물을 사람이 검증하는 최소 게이트웨이
하단 작게: Live · GitHub URL

[Slide 02 — 해결하려는 문제]
1. Agent 산출물 ≠ 사람 승인 → 책임 흐려짐 (뒷단)
2. 대시보드형 UI는 이틀 MVP·5분 시연에 부적합
3. 외부 LLM 호출 시 보안·프라이버시 위험 (앞단)

표 — 게이트 두 방향
| 앞단 (Egress) | 뒷단 (Ingress) |
| LLM에 보내도 되는지 | 결과를 받아들여도 되는지 |
| 후속: Policy | 이번 MVP 구현 |

한 줄 메시지: 실무의 LLM 문장 다듬기는 일반적. Trust Gateway는 보내기 전·확정 전을 가르는 문.

[Slide 03 — 핵심 기능 Must 3]
| Must | 한 줄 |
| Contract | 목적·제약·수용 기준 검증 |
| Evidence | VERIFIED / CONFLICT / UNKNOWN |
| Judgment | Approve / Reject / Hold · 자동 승인 없음 |

강조 박스: 검증 실패 시 Approve 완전 차단

[Slide 04 — Architecture / Tech Stack]
다이어그램(텍스트로 단순 표현):
User → Next.js UI → Validator → Evidence / Judgment
Validator = Local rules engine (no LLM)  ← lib/validate.ts

불릿:
- Next.js · TypeScript · Tailwind · Vercel
- i18n: 한국어 / 日本語 / EN
- SPEC 기반 Vertical Slice

[Slide 05 — Live Demo]
제목을 크게: Live Demo
본문 최소:
1. Open Demo Case
2. Validate → Evidence
3. Judgment → Record
4. (여유) 필드 비우기 → Approve 차단

중앙에 URL 크게: https://trust-gateway-mvp.vercel.app
※ 이 장은 슬라이드보다 브라우저 시연이 본체임을 안내하는 한 줄 포함

[Slide 06 — 개발에서 배운 점]
- 작게: Must 3만 · Nice는 컷
- 스택: 코스 요구(Vercel)에 맞춰 Next.js
- UI: Stitch를 SPEC에 맞게 축소 이식
- 카피: AI Confidence·원장/암호 과대 문구 제거
- 다국어: ko / ja / en
- 디버깅: 입력 포커스 버그 → Shell 중첩 컴포넌트 리마운트 원인 수정

한 줄: 가장 큰 결정은 “무엇을 안 할지”

[Slide 07 — 향후 발전]
거버넌스 우선 (사람 최종 승인 유지)
1. Gateway Policy — 앞단 Egress + allow/hold/deny 권고
2. Audit / Export — 판단 기록 재열람
3. 그다음 Agent 연동 · 인증

마무리 한 줄: 최종 승인은 계속 사람의 몫

---

레이아웃 요청
- 밝은 배경, 높은 대비 본문
- Primary 액센트는 절제된 블루 계열 한 가지
- 표는 단순 보더, 카드 과다 배치 금지
- 각 장 하단에 작은 페이지 번호 (1/7 … 7/7)
```

---

## Gamma에서 쓰는 짧은 팁

1. New presentation → 위 프롬프트 붙여넣기  
2. 생성 후 Slide 05만 URL·여백을 더 키우기  
3. 스크린샷이 있으면 Slide 03 또는 05에 1~2장만 추가 (과다 금지)  
4. Export: PDF 또는 PPTX (제출·리허설용)

원본 초안: [`presentation-draft.md`](presentation-draft.md)
