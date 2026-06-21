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
