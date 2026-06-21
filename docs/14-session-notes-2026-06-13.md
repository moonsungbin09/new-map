# 세션 기록 (2026-06-13)

이 문서는 오늘 대화에서 정한 내용을 나중에 이어서 작업할 수 있게 정리한 기록입니다.

## 1) 오늘 한 일 요약
- `copilot-instructions.md` 생성
- 안드로이드 MVP 문서 구조 설계
- `docs/00`~`07` 기본 문서 템플릿 생성
- 문서 인코딩 문제(한글 깨짐) 해결: Markdown 파일을 UTF-8(BOM)으로 정리
- 질문 기반으로 핵심 요구사항 확정
- 부족했던 실행 문서 보완: `docs/08`~`13` 추가

## 2) 확정된 제품 방향
- 앱 성격: **단일 앱(MVP) 빠른 출시 중심**
- 주 사용자: **새로운 장소를 기록/공유하고 싶은 일반 사용자**
- 핵심 문제: **기존 지도에 없는 장소를 표시하기 어려움**
- 배포 대상: **Azure**

## 3) MVP 범위(확정)
### 포함
- 지도에서 새 장소 등록
- 등록한 장소 목록 보기
- 장소 공유

### 제외
- 실시간 내비게이션
- 복잡한 소셜 기능(팔로우/댓글)
- 고급 추천 알고리즘

## 4) 기술/구조 결정
- Android: Kotlin
- UI: Jetpack Compose
- 로컬 저장: Room
- 서버 연동: REST API
- Azure 기준 구성: App Service(API) + Azure SQL Database

## 5) 추가된 핵심 문서
- `docs/08-data-model.md`
- `docs/09-api-spec.md`
- `docs/10-screen-flow.md`
- `docs/11-security-and-privacy.md`
- `docs/12-test-checklist.md`
- `docs/13-azure-deployment-outline.md`

## 6) 다음에 바로 시작할 작업(추천)
1. `docs/10-screen-flow.md` 기준으로 화면 와이어 순서 확정
2. `docs/09-api-spec.md` 기준으로 백엔드 API 뼈대 만들기
3. `docs/12-test-checklist.md`의 10개 시나리오를 개발 완료 기준으로 사용

## 7) 참고
- 구현 계획 문서: `docs/superpowers/plans/2026-06-13-mvp-docs-hardening.md`
