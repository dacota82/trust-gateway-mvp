# 디버깅 리포트 — Trust Gateway MVP

| 항목 | 내용 |
|------|------|
| 문서 | `docs/debugging-report.md` |
| 작성일 | 2026-08-03 |
| 프로젝트 | Trust Gateway MVP |
| 환경 | Next.js 16 · React 19 · Vercel Production |
| Live | https://trust-gateway-mvp.vercel.app |

---

## 1. 요약

| ID | 증상 | 심각도 | 상태 |
|----|------|--------|------|
| **BUG-001** | Contract / Judgment 입력창에 타이핑 시 포커스가 끊기거나 입력이 정상적으로 이어지지 않음 | High | **Fixed** |

---

## 2. BUG-001 — 입력 포커스 유실

### 2.1 증상

- **발견 시점:** 5분 Demo 리허설 중 (2026-08-03)
- **재현 화면:** Contract 입력 필드, Judgment Reason textarea
- **사용자 보고:** “화면에서 입력창에 정상적으로 입력이 안된다”

### 2.2 재현 절차

1. https://trust-gateway-mvp.vercel.app 접속  
2. **Open Demo Case** 또는 **Create Contract**  
3. Contract Title / Task Purpose 등에 연속 입력  
4. **기대:** 포커스가 유지되며 문자열이 누적됨  
5. **실제:** 글자 입력마다 포커스가 끊기거나 입력이 끊긴 것처럼 보임  

### 2.3 영향 범위

| 영역 | 영향 |
|------|------|
| M-01 Contract | 검증 전 필드 편집 불가에 가까움 → Demo 차단 |
| M-03 Judgment | 판단 근거 입력 장애 |
| 발표 Live Demo | 시연 신뢰도 저하 |

### 2.4 원인 분석

`TrustGatewayApp` **함수 컴포넌트 내부**에 `Shell`(및 `StepProgress`)을 중첩 정의하고 있었다.

```tsx
export default function TrustGatewayApp() {
  // ...
  function Shell({ children }) { /* nav + main */ }

  return <Shell>...</Shell>;  // 매 렌더마다 Shell 타입이 새로 생성됨
}
```

React는 컴포넌트 타입이 바뀌면 **트리 전체를 언마운트 후 재마운트**한다.

1. `input` `onChange` → `setContract`  
2. 부모 리렌더 → 내부 `function Shell`이 **새 함수 참조**로 재생성  
3. React가 기존 `Shell` 트리 폐기 → 새 `Shell` 마운트  
4. 그 안의 `<input>`도 새로 생겨 **포커스 유실**

CSS·브라우저 IME 문제가 아니라 **컴포넌트 구조 버그**였다.

### 2.5 수정 내용

| 항목 | Before | After |
|------|--------|-------|
| `Shell` | `TrustGatewayApp` 내부 중첩 함수 | 모듈 스코프 컴포넌트 |
| `StepProgress` | 내부 중첩 함수 | 모듈 스코프 + `labels` props |
| props | `m` / `locale` 클로저 의존 | `brand`, `locale`, `onLocaleChange` 등 명시 전달 |

커밋: `a0f7cb7` — *Fix input focus loss by moving Shell outside render.*

### 2.6 검증

| 항목 | 결과 |
|------|------|
| `npm run build` | 통과 |
| Production 재배포 | https://trust-gateway-mvp.vercel.app |
| Contract Title 연속 입력 | 포커스 유지 · 문자열 누적 |
| Judgment Reason 연속 입력 | 동일 |
| 언어 전환 후 입력 | 정상 |

### 2.7 재발 방지

- UI 래퍼·레이아웃 컴포넌트는 **파일 상단(모듈 스코프)** 에 둔다.  
- `export default` 함수 **안에** `function Child()` 를 정의하지 않는다.  
- 입력 이상 제보 시 우선 확인할 패턴: “부모 state 변경 → 자식 컴포넌트 타입이 매 렌더 바뀌는가?”

---

## 3. 스모크 체크리스트 (리허설용)

발표 전 아래를 한 번씩 확인한다.

- [ ] Start → Open Demo Case  
- [ ] Contract 필드 **연속 타이핑** (포커스 유지)  
- [ ] Validate → Evidence 카드 표시  
- [ ] Judgment Reason **연속 타이핑**  
- [ ] Record Judgment → Done  
- [ ] 필드 비우기 → Validate → Approve 차단  
- [ ] 한국어 / 日本語 / EN 전환  

---

## 4. 미해결 / 후속 (해당 없음 · 선택)

현재 접수·수정된 High 이슈는 BUG-001뿐이다.  
후속으로 여유 있을 때:

- README §6 스크린샷 실파일 추가  
- 모바일 폭에서의 키보드·스크롤 UX 점검  

---

## 5. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-08-03 | BUG-001 보고 · 원인 확정 · 수정 · Production 반영 · 본 리포트 작성 |
