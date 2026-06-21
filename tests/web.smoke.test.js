import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";

describe("web smoke", () => {
  it("GET /api/places should return 200 with mocked placeService", async () => {
    const app = createApp({
      placeService: {
        getPlaces: vi.fn().mockResolvedValue([{ id: "plc_1", name: "테스트 장소" }])
      }
    });

    const response = await request(app).get("/api/places");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ items: expect.any(Array) });
    expect(response.body.items).toEqual([{ id: "plc_1", name: "테스트 장소" }]);
  });
});
