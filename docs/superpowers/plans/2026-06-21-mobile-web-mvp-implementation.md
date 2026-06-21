# Mobile Web MVP 1차 배포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모바일 브라우저에서 장소 등록/목록/상세가 동작하는 익명 기반 웹 MVP를 Azure App Service + Azure SQL로 오늘 1차 배포한다.

**Architecture:** 단일 Node.js 서비스(Express)가 REST API와 정적 웹 파일을 함께 제공한다. 데이터는 Azure SQL의 `places` 테이블에 저장하고, 프론트엔드는 최소 화면 3개(목록/등록/상세)로 구성한다. 테스트는 API 단위 테스트 + 저장소 단위 테스트 + 간단 스모크 테스트로 구성한다.

**Tech Stack:** Node.js 22, Express, mssql, Vitest, Supertest, HTML/CSS/Vanilla JS, Azure App Service, Azure SQL

---

## 파일 구조

- Create: `package.json`
- Create: `vitest.config.js`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app.js`
- Create: `src/server.js`
- Create: `src/config.js`
- Create: `src/db/pool.js`
- Create: `src/db/schema.sql`
- Create: `src/repositories/placeRepository.js`
- Create: `src/services/placeService.js`
- Create: `src/routes/placesRoutes.js`
- Create: `src/middleware/errorHandler.js`
- Create: `public/index.html`
- Create: `public/create.html`
- Create: `public/detail.html`
- Create: `public/styles.css`
- Create: `public/app.js`
- Create: `tests/places.api.test.js`
- Create: `tests/placeService.test.js`
- Create: `tests/web.smoke.test.js`
- Modify: `README.md`

---

### Task 1: 프로젝트 골격과 테스트 실행기 만들기

**Files:**
- Create: `package.json`, `vitest.config.js`, `.gitignore`, `.env.example`

- [ ] **Step 1: `package.json` 생성**

```json
{
  "name": "new-map-mobile-web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mssql": "^11.0.1"
  },
  "devDependencies": {
    "supertest": "^7.0.0",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: 테스트 설정 파일 생성**

```js
// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"]
  }
});
```

- [ ] **Step 3: 환경변수 예시 파일 생성**

```bash
# .env.example
PORT=3000
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=new_map
DB_USER=sa
DB_PASSWORD=your_password
DB_ENCRYPT=true
```

- [ ] **Step 4: 기본 무시 규칙 작성**

```bash
# .gitignore
node_modules
.env
coverage
```

- [ ] **Step 5: 의존성 설치**

Run: `npm install`  
Expected: `added ... packages` 출력

- [ ] **Step 6: 커밋**

```bash
git add package.json vitest.config.js .env.example .gitignore
git commit -m "chore: bootstrap mobile web mvp project"
```

---

### Task 2: API 실패 테스트 먼저 작성하기 (TDD 시작)

**Files:**
- Create: `tests/places.api.test.js`
- Create: `src/app.js`, `src/routes/placesRoutes.js`, `src/middleware/errorHandler.js`

- [ ] **Step 1: API 실패 테스트 작성**

```js
// tests/places.api.test.js
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { createApp } from "../src/app.js";

describe("places api", () => {
  it("POST /api/places - name 누락 시 400", async () => {
    const app = createApp({
      placeService: { createPlace: vi.fn() }
    });

    const res = await request(app).post("/api/places").send({
      latitude: 37.5,
      longitude: 127.0,
      level_type: "지상"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("장소명");
  });

  it("GET /api/places - 목록 응답", async () => {
    const app = createApp({
      placeService: { getPlaces: vi.fn().mockResolvedValue([{ id: "plc_1", name: "테스트" }]) }
    });

    const res = await request(app).get("/api/places");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
  });
});
```

- [ ] **Step 2: 테스트 실행 후 실패 확인**

Run: `npm test -- tests/places.api.test.js`  
Expected: `Cannot find module '../src/app.js'` 또는 import 오류로 FAIL

- [ ] **Step 3: 최소 앱/라우트 뼈대 구현**

```js
// src/app.js
import express from "express";
import { createPlacesRouter } from "./routes/placesRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp({ placeService }) {
  const app = express();
  app.use(express.json());
  app.use("/api/places", createPlacesRouter({ placeService }));
  app.use(errorHandler);
  return app;
}
```

```js
// src/routes/placesRoutes.js
import { Router } from "express";

export function createPlacesRouter({ placeService }) {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name || !String(name).trim()) {
        return res.status(400).json({ message: "장소명은 필수입니다." });
      }
      const created = await placeService.createPlace(req.body);
      return res.status(201).json(created);
    } catch (e) {
      return next(e);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const items = await placeService.getPlaces();
      return res.status(200).json({ items });
    } catch (e) {
      return next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const item = await placeService.getPlaceById(req.params.id);
      if (!item) return res.status(404).json({ message: "장소를 찾을 수 없습니다." });
      return res.status(200).json(item);
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
```

```js
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  return res.status(500).json({ message: "잠시 후 다시 시도해 주세요." });
}
```

- [ ] **Step 4: 테스트 재실행**

Run: `npm test -- tests/places.api.test.js`  
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add tests/places.api.test.js src/app.js src/routes/placesRoutes.js src/middleware/errorHandler.js
git commit -m "test: add places api validation and list tests"
```

---

### Task 3: 서비스/저장소 로직 TDD로 구현하기

**Files:**
- Create: `tests/placeService.test.js`
- Create: `src/services/placeService.js`
- Create: `src/repositories/placeRepository.js`

- [ ] **Step 1: 서비스 테스트 작성**

```js
// tests/placeService.test.js
import { describe, it, expect, vi } from "vitest";
import { createPlaceService } from "../src/services/placeService.js";

describe("place service", () => {
  it("좌표 범위 벗어나면 에러", async () => {
    const repo = { insertPlace: vi.fn() };
    const service = createPlaceService({ placeRepository: repo });

    await expect(
      service.createPlace({ name: "테스트", latitude: 120, longitude: 127, level_type: "지상" })
    ).rejects.toThrow("위도");
  });

  it("정상 입력이면 저장 호출", async () => {
    const repo = {
      insertPlace: vi.fn().mockResolvedValue({ id: "plc_1" })
    };
    const service = createPlaceService({ placeRepository: repo });

    const out = await service.createPlace({
      name: "테스트",
      latitude: 37.5,
      longitude: 127.0,
      level_type: "지상",
      description: "설명"
    });

    expect(repo.insertPlace).toHaveBeenCalledOnce();
    expect(out.id).toBe("plc_1");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tests/placeService.test.js`  
Expected: `Cannot find module '../src/services/placeService.js'`로 FAIL

- [ ] **Step 3: 최소 서비스/저장소 구현**

```js
// src/services/placeService.js
function validatePlace(input) {
  if (!input.name || !String(input.name).trim()) throw new Error("장소명은 필수입니다.");
  if (input.latitude < -90 || input.latitude > 90) throw new Error("위도 범위를 확인해 주세요.");
  if (input.longitude < -180 || input.longitude > 180) throw new Error("경도 범위를 확인해 주세요.");
  if (!["지상", "지하", "산"].includes(input.level_type)) throw new Error("공간 유형이 올바르지 않습니다.");
}

export function createPlaceService({ placeRepository }) {
  return {
    async createPlace(input) {
      validatePlace(input);
      return placeRepository.insertPlace(input);
    },
    async getPlaces() {
      return placeRepository.listPlaces();
    },
    async getPlaceById(id) {
      return placeRepository.getPlace(id);
    }
  };
}
```

```js
// src/repositories/placeRepository.js
export function createPlaceRepository({ sql }) {
  return {
    async insertPlace(input) {
      return sql.insertPlace(input);
    },
    async listPlaces() {
      return sql.listPlaces();
    },
    async getPlace(id) {
      return sql.getPlace(id);
    }
  };
}
```

- [ ] **Step 4: 테스트 재실행**

Run: `npm test -- tests/placeService.test.js`  
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add tests/placeService.test.js src/services/placeService.js src/repositories/placeRepository.js
git commit -m "feat: add place service validation and repository"
```

---

### Task 4: Azure SQL 연결과 서버 실행선 만들기

**Files:**
- Create: `src/config.js`, `src/db/pool.js`, `src/db/schema.sql`, `src/server.js`
- Modify: `src/app.js`

- [ ] **Step 1: DB 스키마 작성**

```sql
-- src/db/schema.sql
IF OBJECT_ID('dbo.places', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.places (
    id VARCHAR(40) NOT NULL PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    level_type NVARCHAR(20) NOT NULL,
    description NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END
```

- [ ] **Step 2: 설정/DB 풀 코드 작성**

```js
// src/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: { encrypt: process.env.DB_ENCRYPT !== "false" }
  }
};
```

```js
// src/db/pool.js
import sql from "mssql";

export async function createSqlClient(dbConfig) {
  const pool = await sql.connect(dbConfig);
  return {
    async insertPlace(input) {
      const id = `plc_${Date.now()}`;
      await pool.request()
        .input("id", sql.VarChar(40), id)
        .input("name", sql.NVarChar(100), input.name)
        .input("latitude", sql.Float, input.latitude)
        .input("longitude", sql.Float, input.longitude)
        .input("level_type", sql.NVarChar(20), input.level_type)
        .input("description", sql.NVarChar(500), input.description ?? null)
        .query(`
          INSERT INTO dbo.places (id, name, latitude, longitude, level_type, description)
          VALUES (@id, @name, @latitude, @longitude, @level_type, @description)
        `);
      return { id };
    },
    async listPlaces() {
      const result = await pool.request().query(`
        SELECT id, name, level_type, created_at
        FROM dbo.places
        ORDER BY created_at DESC
      `);
      return result.recordset;
    },
    async getPlace(id) {
      const result = await pool.request()
        .input("id", sql.VarChar(40), id)
        .query(`
          SELECT id, name, latitude, longitude, level_type, description, created_at
          FROM dbo.places
          WHERE id = @id
        `);
      return result.recordset[0] ?? null;
    }
  };
}
```

- [ ] **Step 3: 서버 진입점 작성**

```js
// src/server.js
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { createSqlClient } from "./db/pool.js";
import { createPlaceRepository } from "./repositories/placeRepository.js";
import { createPlaceService } from "./services/placeService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  const sqlClient = await createSqlClient(config.db);
  const placeRepository = createPlaceRepository({ sql: sqlClient });
  const placeService = createPlaceService({ placeRepository });

  const app = createApp({ placeService });
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.listen(config.port, () => {
    console.log(`Server listening on ${config.port}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 4: 서비스 예외를 400으로 변환**

```js
// src/routes/placesRoutes.js (POST 핸들러 내부 catch 직전)
    } catch (e) {
      if (["장소명은 필수입니다.", "위도 범위를 확인해 주세요.", "경도 범위를 확인해 주세요.", "공간 유형이 올바르지 않습니다."].includes(e.message)) {
        return res.status(400).json({ message: e.message });
      }
      return next(e);
    }
```

- [ ] **Step 5: API 테스트 전체 실행**

Run: `npm test -- tests/places.api.test.js tests/placeService.test.js`  
Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add src/config.js src/db/pool.js src/db/schema.sql src/server.js src/routes/placesRoutes.js
git commit -m "feat: wire app with azure sql and server startup"
```

---

### Task 5: 모바일 웹 UI 구현 및 스모크 테스트

**Files:**
- Create: `public/index.html`, `public/create.html`, `public/detail.html`, `public/styles.css`, `public/app.js`
- Create: `tests/web.smoke.test.js`

- [ ] **Step 1: 웹 스모크 테스트 작성**

```js
// tests/web.smoke.test.js
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { createApp } from "../src/app.js";

describe("web smoke", () => {
  it("GET /api/places 상태코드 200", async () => {
    const app = createApp({
      placeService: {
        getPlaces: vi.fn().mockResolvedValue([]),
        getPlaceById: vi.fn(),
        createPlace: vi.fn()
      }
    });
    const res = await request(app).get("/api/places");
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: 홈/등록/상세 HTML 작성**

```html
<!-- public/index.html -->
<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>new-map</title></head>
<body>
  <main class="container">
    <h1>장소 목록</h1>
    <a class="btn" href="/create.html">새 장소 추가</a>
    <ul id="place-list"></ul>
  </main>
  <script type="module" src="/app.js"></script>
</body>
</html>
```

```html
<!-- public/create.html -->
<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>장소 등록</title></head>
<body>
  <main class="container">
    <h1>장소 등록</h1>
    <form id="create-form">
      <input name="name" placeholder="장소명" required>
      <input name="latitude" placeholder="위도" type="number" step="any" required>
      <input name="longitude" placeholder="경도" type="number" step="any" required>
      <select name="level_type" required>
        <option value="지상">지상</option><option value="지하">지하</option><option value="산">산</option>
      </select>
      <textarea name="description" placeholder="설명"></textarea>
      <button class="btn" type="submit">저장</button>
    </form>
    <p id="error-text"></p>
  </main>
  <script type="module" src="/app.js"></script>
</body>
</html>
```

```html
<!-- public/detail.html -->
<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>상세</title></head>
<body>
  <main class="container">
    <h1>장소 상세</h1>
    <pre id="detail"></pre>
  </main>
  <script type="module" src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 3: 프론트 스크립트/스타일 작성**

```js
// public/app.js
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "요청 실패");
  return data;
}

if (location.pathname === "/" || location.pathname.endsWith("index.html")) {
  const listEl = document.querySelector("#place-list");
  const out = await fetchJson("/api/places");
  out.items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/detail.html?id=${item.id}">${item.name}</a>`;
    listEl.appendChild(li);
  });
}

if (location.pathname.endsWith("create.html")) {
  const form = document.querySelector("#create-form");
  const errorText = document.querySelector("#error-text");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorText.textContent = "";
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name")),
      latitude: Number(fd.get("latitude")),
      longitude: Number(fd.get("longitude")),
      level_type: String(fd.get("level_type")),
      description: String(fd.get("description") || "")
    };
    try {
      const created = await fetchJson("/api/places", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      location.href = `/detail.html?id=${created.id}`;
    } catch (err) {
      errorText.textContent = err.message;
    }
  });
}

if (location.pathname.endsWith("detail.html")) {
  const id = new URLSearchParams(location.search).get("id");
  if (id) {
    const out = await fetchJson(`/api/places/${id}`);
    document.querySelector("#detail").textContent = JSON.stringify(out, null, 2);
  }
}
```

```css
/* public/styles.css */
body { margin: 0; font-family: sans-serif; background: #f7f7f7; }
.container { max-width: 720px; margin: 0 auto; padding: 16px; }
input, select, textarea, button { width: 100%; margin-top: 8px; padding: 10px; box-sizing: border-box; }
.btn { display: inline-block; text-decoration: none; background: #2563eb; color: white; border: 0; border-radius: 8px; text-align: center; }
#error-text { color: #b91c1c; min-height: 24px; }
```

- [ ] **Step 4: 테스트 실행**

Run: `npm test`  
Expected: 모든 테스트 PASS

- [ ] **Step 5: 커밋**

```bash
git add public tests/web.smoke.test.js
git commit -m "feat: add mobile web pages for places flow"
```

---

### Task 6: Azure 배포 설정과 운영 문서 정리

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 배포 실행 커맨드 문서화**

```md
## 모바일 웹 MVP 실행

### 1) 로컬 실행
1. `.env.example`를 복사해 `.env` 생성
2. Azure SQL 연결정보 입력
3. `npm install`
4. `npm start`

### 2) DB 스키마 적용
`src/db/schema.sql`을 Azure SQL Query Editor에서 실행

### 3) Azure App Service 배포
1. App Service 생성 (Node 22)
2. 배포 소스 연결 (GitHub)
3. App Service 환경변수 설정 (`DB_*`, `PORT`)
4. 재시작 후 `/`와 `/api/places` 확인
```

- [ ] **Step 2: 수동 검증 체크**

Run:  
1. 모바일 브라우저에서 `/` 접속  
2. `/create.html`에서 등록  
3. 등록 후 상세 이동 확인  
Expected: 등록/조회 흐름 동작

- [ ] **Step 3: 커밋**

```bash
git add README.md
git commit -m "docs: add mobile web mvp run and azure deploy guide"
```

---

## Self-Review 메모

- Spec coverage: 목표(등록/목록/상세), 익명 정책, 입력 검증, 에러 안내, Azure 배포 모두 Task 2~6에 매핑됨.
- Placeholder scan: TODO/TBD/미정 없음.
- Type consistency: `createPlace/getPlaces/getPlaceById` 시그니처를 API/서비스/테스트에서 동일하게 사용함.
