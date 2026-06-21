# Simple Frontend-First Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모바일 웹에서 첫 화면 + 장소 목록 + 등록 버튼만 아주 단순하게 정리해 먼저 배포한다.

**Architecture:** 기존 백엔드/API(`GET /api/places`)와 배포 구조는 유지하고, 프론트 파일(`public/index.html`, `public/styles.css`, `public/app.js`)만 최소 수정한다. 목록 로딩 실패 시 한 줄 메시지로 처리하고, 등록은 `/create.html` 이동만 제공한다.

**Tech Stack:** HTML, CSS, Vanilla JS, Node.js(Express static), Vitest, Azure App Service, Azure CLI

---

## File Structure

- Modify: `public/index.html` (첫 화면 정보 구조 단순화)
- Modify: `public/styles.css` (단순 레이아웃/버튼/목록 스타일)
- Modify: `public/app.js` (목록 로딩/실패 메시지 최소화)
- Create: `tests/frontend.simple.test.js` (단순 프론트 구조/문구 스모크 테스트)
- Modify: `README.md` (재배포 확인 절차 3줄 보강)

---

### Task 1: 첫 화면 구조를 단순화하기

**Files:**
- Create: `tests/frontend.simple.test.js`
- Modify: `public/index.html`

- [ ] **Step 1: 실패 테스트 작성**

```js
// tests/frontend.simple.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("simple frontend structure", () => {
  it("index 페이지에 소개 문구/목록/등록 버튼이 있어야 한다", () => {
    const html = readFileSync("public/index.html", "utf8");
    expect(html).toContain("새로운 장소를 쉽게 기록");
    expect(html).toContain('id="place-list"');
    expect(html).toContain('href="/create.html"');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tests/frontend.simple.test.js`  
Expected: FAIL (`"새로운 장소를 쉽게 기록"` 문구 없음)

- [ ] **Step 3: 최소 구현으로 index 갱신**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>new-map</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body data-page="index">
    <main class="container">
      <section class="hero card">
        <h1>new-map</h1>
        <p>새로운 장소를 쉽게 기록하고 확인하는 아주 간단한 화면입니다.</p>
        <a class="button" href="/create.html">새 장소 등록</a>
      </section>

      <section>
        <h2>장소 목록</h2>
        <ul id="place-list" class="list"></ul>
      </section>
    </main>
    <script type="module" src="/app.js"></script>
  </body>
</html>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- tests/frontend.simple.test.js`  
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add tests/frontend.simple.test.js public/index.html
git commit -m "feat: simplify landing page structure"
```

---

### Task 2: 목록/에러 표현을 더 단순하게 정리하기

**Files:**
- Modify: `public/styles.css`
- Modify: `public/app.js`
- Test: `tests/frontend.simple.test.js`

- [ ] **Step 1: 실패 테스트 추가**

```js
// tests/frontend.simple.test.js (같은 파일에 테스트 추가)
it("index 스크립트에서 단순 실패 문구를 사용해야 한다", () => {
  const script = readFileSync("public/app.js", "utf8");
  expect(script).toContain("목록을 불러오지 못했습니다.");
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tests/frontend.simple.test.js`  
Expected: FAIL (문구가 아직 없으면 실패)

- [ ] **Step 3: 최소 구현으로 스타일/스크립트 조정**

```css
/* public/styles.css - 핵심만 유지 */
body { margin: 0; background: #f5f5f7; color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.container { max-width: 640px; margin: 0 auto; padding: 16px; }
.card { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.hero { display: grid; gap: 8px; margin-bottom: 16px; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.list a { display: block; text-decoration: none; color: #1f2937; background: #fff; border-radius: 10px; padding: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.button { display: inline-block; width: fit-content; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; padding: 10px 12px; }
.error { color: #b91c1c; }
```

```js
// public/app.js - index 실패 문구 단순화 부분
if (page === "index") {
  renderIndex().catch(() => {
    const listEl = document.querySelector("#place-list");
    if (listEl) {
      listEl.innerHTML = `<li class="error">목록을 불러오지 못했습니다.</li>`;
    }
  });
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- tests/frontend.simple.test.js`  
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add public/styles.css public/app.js tests/frontend.simple.test.js
git commit -m "feat: simplify list and error presentation"
```

---

### Task 3: 배포 확인 문구 보강 후 Azure 재배포

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README에 프론트 우선 재배포 체크 3줄 추가**

```md
## 프론트 우선 빠른 재배포 체크
1. 홈(`/`)에서 소개 문구, 목록, 등록 버튼이 보이는지 확인
2. 목록 로딩 실패 시 "목록을 불러오지 못했습니다." 한 줄 표시 확인
3. 등록 버튼 클릭 시 `/create.html` 이동 확인
```

- [ ] **Step 2: 전체 테스트 실행**

Run: `npm test`  
Expected: PASS

- [ ] **Step 3: 변경 커밋**

```bash
git add README.md
git commit -m "docs: add simple frontend redeploy checklist"
```

- [ ] **Step 4: Azure Web App 재배포**

```powershell
$azPy = 'C:\Program Files\Microsoft SDKs\Azure\CLI2\python.exe'
$zip = 'C:\Users\user\Desktop\new map\deploy.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
$items = Get-ChildItem -Force 'C:\Users\user\Desktop\new map' | Where-Object { $_.Name -notin @('.git','node_modules','deploy.zip') }
Compress-Archive -Path $items.FullName -DestinationPath $zip -Force
& $azPy -m azure.cli webapp deploy --resource-group newmap-rg-06211053 --name newmapweb06211053 --src-path $zip --type zip --output table
```

Expected: 배포 요청 완료 출력

- [ ] **Step 5: URL 응답 확인 후 임시 파일 정리**

```powershell
try { (Invoke-WebRequest -Uri 'https://newmapweb06211053.azurewebsites.net' -UseBasicParsing -TimeoutSec 30).StatusCode } catch { $_.Exception.Message }
if (Test-Path 'C:\Users\user\Desktop\new map\deploy.zip') { Remove-Item 'C:\Users\user\Desktop\new map\deploy.zip' -Force }
```

Expected: `200`

- [ ] **Step 6: 배포 결과 커밋**

```bash
git add .
git commit -m "chore: deploy simple frontend update to azure"
```

---

## Self-Review

1. **Spec coverage:** 목표(첫 화면+목록+등록 버튼), 단순 에러 문구, Azure 재배포를 Task 1~3으로 모두 매핑했다.  
2. **Placeholder scan:** TODO/TBD/미정/추후 작성 같은 플레이스홀더가 없다.  
3. **Type consistency:** `#place-list`, `/create.html`, 에러 문구 `"목록을 불러오지 못했습니다."`를 설계/테스트/구현 단계에서 일관되게 사용했다.
