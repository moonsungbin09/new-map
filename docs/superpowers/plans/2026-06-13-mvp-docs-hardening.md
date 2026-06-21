# MVP Docs Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 비개발자도 바로 개발을 시작할 수 있도록, 현재 문서의 빈틈(데이터/API/Azure/보안/테스트)을 실행 가능한 수준으로 보완한다.

**Architecture:** 기존 `docs/` 문서는 유지하고, 부족한 내용을 새 문서로 분리해 추가한다. 각 문서는 한 가지 목적만 가지게 하여 읽기 쉽고 수정 충돌을 줄인다. 모든 문서는 쉬운 한국어로 작성하고, 예시를 포함해 해석 오해를 줄인다.

**Tech Stack:** Markdown, Git, Android(Kotlin/Compose), Azure(App Service + Azure SQL 기준 문서화)

---

## 파일 구조(먼저 고정)

- Modify: `docs/02-architecture.md` — Azure를 포함한 실제 구성 요약을 추가
- Create: `docs/08-data-model.md` — 장소/사용자/공유 데이터 항목 정의
- Create: `docs/09-api-spec.md` — MVP API 요청/응답/에러 규칙
- Create: `docs/10-screen-flow.md` — 화면 이동 순서와 입력 항목
- Create: `docs/11-security-and-privacy.md` — 로그인, 토큰, 권한, 개인정보 최소 원칙
- Create: `docs/12-test-checklist.md` — 비개발자도 따라할 수 있는 수동 테스트 시나리오
- Create: `docs/13-azure-deployment-outline.md` — Azure 배포 최소 구성과 순서
- Modify: `README.md` — 새 문서 링크 추가

### Task 1: Azure 아키텍처 최소안 확정

**Files:**
- Modify: `docs/02-architecture.md`

- [ ] **Step 1: 현재 아키텍처 문서 열기**

Run: `Get-Content -Path 'docs\02-architecture.md' -Raw`
Expected: 현재 기술 선택 섹션이 출력됨

- [ ] **Step 2: Azure 구성 요약 문단 추가**

추가 내용(문서에 그대로 반영):
- 앱: Android 앱(사용자 입력/화면)
- API: Azure App Service
- DB: Azure SQL Database
- 인증: 이메일 로그인 + 서버 발급 토큰
- 저장 흐름: 앱 → API → DB, 조회 시 DB → API → 앱

- [ ] **Step 3: 문서가 쉬운 표현인지 점검**

Run: `rg "JWT|OAuth2|RBAC|CQRS" docs\02-architecture.md -n`
Expected: 결과 없음(초기 문서는 어려운 용어 최소화)

- [ ] **Step 4: 커밋**

```bash
git add docs/02-architecture.md
git commit -m "docs: clarify azure-based architecture for MVP"
```

### Task 2: 데이터 모델 문서 추가

**Files:**
- Create: `docs/08-data-model.md`

- [ ] **Step 1: 데이터 모델 문서 생성**

문서에 아래 3개 표를 작성:
1. `Place`(장소): id, name, latitude, longitude, level_type(지상/지하/산), description, creator_id, created_at  
2. `User`(사용자): id, email, nickname, created_at  
3. `ShareLink`(공유): id, place_id, token, expires_at

- [ ] **Step 2: 필수/선택 항목 표시**

각 필드에 `필수/선택`을 명시하고, 비개발자용 예시값 1개씩 추가

- [ ] **Step 3: 유효성 규칙 추가**

규칙 예시:
- name: 1~50자
- latitude: -90~90
- longitude: -180~180

- [ ] **Step 4: 커밋**

```bash
git add docs/08-data-model.md
git commit -m "docs: add MVP data model with validation rules"
```

### Task 3: API 명세 문서 추가

**Files:**
- Create: `docs/09-api-spec.md`

- [ ] **Step 1: 공통 규칙 작성**

포함 항목:
- Base URL 자리표시: `https://<azure-api-domain>`
- JSON 사용
- 시간 포맷: ISO-8601
- 공통 에러 형식: `{ "code": "...", "message": "..." }`

- [ ] **Step 2: MVP 엔드포인트 5개 작성**

필수 엔드포인트:
1. `POST /auth/login`
2. `POST /places`
3. `GET /places`
4. `GET /places/{id}`
5. `POST /places/{id}/share`

각 엔드포인트에 요청 예시/응답 예시/실패 예시를 작성

- [ ] **Step 3: 비개발자용 해석 문장 추가**

각 API 아래에 “이 API는 한 줄로 무엇을 하는지” 1문장 추가

- [ ] **Step 4: 커밋**

```bash
git add docs/09-api-spec.md
git commit -m "docs: add MVP API specification"
```

### Task 4: 화면 흐름 문서 추가

**Files:**
- Create: `docs/10-screen-flow.md`

- [ ] **Step 1: 화면 목록 작성**

필수 화면:
- 로그인
- 홈(지도+목록)
- 장소 등록
- 장소 상세
- 설정

- [ ] **Step 2: 이동 흐름 작성**

예시 흐름:
- 로그인 성공 → 홈
- 홈에서 “새 장소 추가” → 장소 등록
- 장소 등록 성공 → 장소 상세 → 홈

- [ ] **Step 3: 화면별 입력 항목 작성**

장소 등록 화면 입력:
- 장소 이름
- 좌표(현재 위치 자동 채우기 + 수동 보정)
- 공간 유형(지상/지하/산)
- 설명(선택)

- [ ] **Step 4: 커밋**

```bash
git add docs/10-screen-flow.md
git commit -m "docs: add screen flow and input definitions"
```

### Task 5: 보안/개인정보 문서 추가

**Files:**
- Create: `docs/11-security-and-privacy.md`

- [ ] **Step 1: 인증/토큰 기본 규칙 작성**

포함 항목:
- 로그인 성공 시 토큰 발급
- 토큰 만료 시간
- 로그아웃 시 토큰 폐기 처리

- [ ] **Step 2: 권한 규칙 작성**

포함 항목:
- 위치 권한은 지도 진입 시 요청
- 권한 거부 시 안내 문구와 대체 동작(수동 좌표 입력)

- [ ] **Step 3: 개인정보 최소 수집 원칙 작성**

포함 항목:
- 이메일 외 불필요 개인정보 수집 금지
- 삭제 요청 시 처리 흐름(요청→확인→삭제)

- [ ] **Step 4: 커밋**

```bash
git add docs/11-security-and-privacy.md
git commit -m "docs: add security and privacy baseline"
```

### Task 6: 테스트 체크리스트 문서 추가

**Files:**
- Create: `docs/12-test-checklist.md`

- [ ] **Step 1: 수동 테스트 시나리오 10개 작성**

필수 시나리오 예:
- 로그인 성공/실패
- 장소 등록 성공/필수값 누락 실패
- 목록 조회
- 공유 링크 생성

- [ ] **Step 2: 각 시나리오를 3줄 포맷으로 통일**

포맷:
- 준비
- 실행
- 기대 결과

- [ ] **Step 3: 릴리즈 기준 체크박스 추가**

릴리즈 전 “10개 중 10개 통과” 같은 명확 기준 작성

- [ ] **Step 4: 커밋**

```bash
git add docs/12-test-checklist.md
git commit -m "docs: add manual test checklist for non-developers"
```

### Task 7: Azure 배포 개요 문서 추가

**Files:**
- Create: `docs/13-azure-deployment-outline.md`

- [ ] **Step 1: Azure 자원 목록 작성**

MVP 기준:
- Resource Group
- App Service (API)
- Azure SQL Database
- Application Insights(선택)

- [ ] **Step 2: 배포 순서 7단계 작성**

예시:
1. 리소스 그룹 생성
2. SQL 생성
3. API 배포
4. 환경변수 설정
5. DB 연결 확인
6. 앱에서 API URL 연결
7. 기본 동작 점검

- [ ] **Step 3: 실패 시 가장 흔한 원인 5개 작성**

예시:
- DB 연결 문자열 오타
- CORS 미설정
- API URL 오입력

- [ ] **Step 4: 커밋**

```bash
git add docs/13-azure-deployment-outline.md
git commit -m "docs: add azure deployment outline for MVP"
```

### Task 8: 문서 인덱스 정리(README)

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 문서 목록에 08~13 문서 추가**

Run: `Get-Content -Path 'README.md' -Raw`
Expected: 기존 문서 목록 확인

- [ ] **Step 2: 초보자 읽기 순서 추가**

추가 문구:
1. `00-project-overview.md`
2. `01-product-requirements.md`
3. `10-screen-flow.md`
4. `09-api-spec.md`
5. `13-azure-deployment-outline.md`

- [ ] **Step 3: 커밋**

```bash
git add README.md
git commit -m "docs: update README with learning-first document order"
```

### Task 9: 최종 일관성 점검

**Files:**
- Modify: `docs/*.md` (필요 시)

- [ ] **Step 1: 플레이스홀더/누락 검색**

Run: `rg "\[질문 후 작성\]|TBD|TODO" docs -n`
Expected: 결과 없음

- [ ] **Step 2: 용어 일관성 검색**

Run: `rg "장소|Place|공유 링크|ShareLink|토큰" docs -n`
Expected: 용어가 충돌 없이 일관되게 사용됨

- [ ] **Step 3: 최종 커밋**

```bash
git add docs README.md
git commit -m "docs: finalize MVP-ready documentation set"
```

