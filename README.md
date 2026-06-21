# new-map

지도에 없는 장소를 직접 만들어가는 앱입니다.

사용자가 직접 새로운 장소를 등록하고 공유할 수 있습니다.

---

## Mobile Web MVP 실행/배포 가이드

### 시작 전에 준비할 것

- Node.js 22 이상이 로컬 PC에 설치되어 있어야 합니다.
- Azure SQL 접속 정보(`DB_SERVER`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ENCRYPT`)를 준비합니다.

### 1) 로컬 실행

1. `.env.example` 파일을 복사해 `.env`를 만듭니다.
2. `.env`에 Azure SQL 연결값(`DB_SERVER`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ENCRYPT`)을 입력합니다.
3. `npm install`
4. `npm start`

### 2) DB 스키마 적용

- Azure SQL Query Editor에서 `src/db/schema.sql` 파일 내용을 실행합니다.

### 3) Azure App Service 배포

1. Node 22 런타임으로 App Service를 생성합니다.
2. 배포 원본을 GitHub 저장소로 연결합니다.
3. Azure SQL 네트워크 접근을 설정합니다. (예: SQL Server 방화벽에서 App Service가 접속할 수 있도록 허용하거나, "Azure 서비스 및 리소스의 서버 액세스 허용"을 켭니다.)
   - 주의: 가능하면 필요한 대상만 허용하세요(예: App Service 아웃바운드 IP, 프라이빗 엔드포인트).
   - `"Azure 서비스 및 리소스의 서버 액세스 허용"` 같은 넓은 허용은 첫 설정/테스트 때만 잠깐 쓰고, 이후에는 꼭 범위를 줄이세요.
4. App Service 환경 변수에 `DB_*`와 `PORT`를 설정합니다.
5. App Service를 재시작한 뒤 `/`와 `/api/places` 엔드포인트를 확인합니다.

### 수동 검증 체크리스트 (모바일 플로우)

- [ ] `/` 페이지가 정상적으로 열린다.
- [ ] `/create.html`에서 장소 생성이 정상 동작한다.
- [ ] 생성 후 상세 페이지로 리다이렉트가 성공한다.

## 문서 구조

- `copilot-instructions.md`
- `docs/00-project-overview.md`
- `docs/01-product-requirements.md`
- `docs/02-architecture.md`
- `docs/03-feature-specs/auth.md`
- `docs/03-feature-specs/home.md`
- `docs/03-feature-specs/settings.md`
- `docs/04-development-guide.md`
- `docs/05-code-conventions.md`
- `docs/06-decision-log/0001-use-compose-and-hilt.md`
- `docs/07-release-notes.md`
- `docs/08-data-model.md`
- `docs/09-api-spec.md`
- `docs/10-screen-flow.md`
- `docs/11-security-and-privacy.md`
- `docs/12-test-checklist.md`
- `docs/13-azure-deployment-outline.md`
- `docs/14-session-notes-2026-06-13.md` (오늘 대화/결정 기록)

## 비개발자 추천 읽기 순서
1. `docs/00-project-overview.md`
2. `docs/01-product-requirements.md`
3. `docs/10-screen-flow.md`
4. `docs/09-api-spec.md`
5. `docs/13-azure-deployment-outline.md`
