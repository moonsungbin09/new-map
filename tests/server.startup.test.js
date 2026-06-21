import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("server startup", () => {
  it("does not reference sqlClient directly in startServer", async () => {
    const serverPath = path.resolve(process.cwd(), "src", "server.js");
    const source = await readFile(serverPath, "utf8");
    const startServerMatch = source.match(
      /async function startServer\(\)\s*\{([\s\S]*?)\n\}/
    );

    expect(startServerMatch).toBeTruthy();
    expect(startServerMatch[1]).not.toMatch(/\bsqlClient\.ping\s*\(/);
  });
});
