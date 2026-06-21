import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("simple landing page", () => {
  it("contains required hero and place list elements", async () => {
    const indexPath = path.resolve(process.cwd(), "public", "index.html");
    const html = await readFile(indexPath, "utf8");

    expect(html).toContain("새로운 장소를 쉽게 기록");
    expect(html).toContain('id="place-list"');
    expect(html).toContain('href="/create.html"');
  });

  it("uses simplified list error message", async () => {
    const appPath = path.resolve(process.cwd(), "public", "app.js");
    const appJs = await readFile(appPath, "utf8");

    expect(appJs).toContain("목록을 불러오지 못했습니다.");
  });
});
