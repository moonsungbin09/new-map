import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { createApp } from "../src/app.js";
import { createPlaceService } from "../src/services/placeService.js";

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
    const getPlaces = vi.fn().mockResolvedValue([{ id: "plc_1", name: "테스트" }]);
    const app = createApp({
      placeService: { getPlaces }
    });

    const res = await request(app).get("/api/places");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(getPlaces).toHaveBeenCalledWith({ limit: 20 });
  });

  it("GET /api/places - limit 파라미터 검증 실패 시 400", async () => {
    const getPlaces = vi.fn();
    const app = createApp({
      placeService: { getPlaces }
    });

    const res = await request(app).get("/api/places?limit=abc");

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("limit");
    expect(getPlaces).not.toHaveBeenCalled();
  });

  it("GET /api/places - limit 상한(100) 적용", async () => {
    const getPlaces = vi.fn().mockResolvedValue([]);
    const app = createApp({
      placeService: { getPlaces }
    });

    const res = await request(app).get("/api/places?limit=1000");

    expect(res.status).toBe(200);
    expect(getPlaces).toHaveBeenCalledWith({ limit: 100 });
  });

  it("GET /api/places - 서비스 일시 불가 시 503", async () => {
    const getPlaces = vi.fn().mockRejectedValue(
      Object.assign(new Error("DB 연결 준비 중입니다."), { code: "SERVICE_UNAVAILABLE" })
    );
    const app = createApp({
      placeService: { getPlaces }
    });

    const res = await request(app).get("/api/places");

    expect(res.status).toBe(503);
    expect(res.body.message).toContain("일시");
  });

  it("POST /api/places - malformed json 시 400", async () => {
    const app = createApp({
      placeService: { createPlace: vi.fn() }
    });

    const res = await request(app)
      .post("/api/places")
      .set("Content-Type", "application/json")
      .send('{"name":');

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("JSON");
  });

  it("POST /api/places - 위도 검증 실패 시 400", async () => {
    const placeService = createPlaceService({
      placeRepository: {
        insertPlace: vi.fn(),
        listPlaces: vi.fn(),
        getPlace: vi.fn()
      }
    });
    const app = createApp({ placeService });

    const res = await request(app).post("/api/places").send({
      name: "테스트",
      latitude: 100,
      longitude: 127.0,
      level_type: "지상"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("위도");
  });
});
