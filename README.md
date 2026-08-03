# Trust Gateway MVP

구름 바이브코딩 수료 개인프로젝트.

**한 줄:** AI/Agent 산출물을 Contract → Evidence → Judgment로 사람이 검증하는 최소 게이트웨이 웹앱.

## 확정 사항

| 항목 | 결정 |
|------|------|
| 스택 | **Next.js · TypeScript · Tailwind · Vercel** |
| SPEC | [`SPEC.md`](SPEC.md) (v0.2-draft) |
| Must | M-01 Contract · M-02 Evidence · M-03 Judgment |
| Fixture | 주간 요약 초안 검토 |
| Judgment | 검증 실패 시 **Approve 완전 차단** |

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

```bash
npm run build
npm start
```

## Repository

- GitHub: https://github.com/dacota82/trust-gateway-mvp
- Vercel Production: https://trust-gateway-mvp.vercel.app

## 문서

| 파일 | 설명 |
|------|------|
| [SPEC.md](SPEC.md) | **제출용 기술명세** |
| [docs/00-upstream-docs-review.md](docs/00-upstream-docs-review.md) | 기획·기술명세 v1.0/v1.1 리뷰 |
| [docs/02-technical-specification-TOC.md](docs/02-technical-specification-TOC.md) | 상세 목차 (내부 확장용) |

## 진행 원칙

- 개발은 작게 (Must Vertical Slice)
- 제출 5종: SPEC → Web App → GitHub → Vercel → 발표자료
- 내부 Contract 방법론·실험 번호는 비공개
- `dakota-mvs-000`은 Git으로 연결하지 않고 **참고만**

## 다음 단계

1. ~~제품 결정 3건~~ · ~~Next.js Setup~~ · ~~GitHub~~ · ~~Vercel~~
2. README 포트폴리오 보강 · 발표자료
3. 5분 Live Demo 리허설
