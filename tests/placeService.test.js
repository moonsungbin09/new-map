import { describe, expect, it, vi } from "vitest";
import { createPlaceService } from "../src/services/placeService.js";

describe("placeService", () => {
  it("invalid latitude (>90 or <-90) should reject with message containing 위도", async () => {
    const placeService = createPlaceService({
      placeRepository: { insertPlace: vi.fn() }
    });

    await expect(
      placeService.createPlace({
        name: "테스트",
        latitude: 91,
        longitude: 127,
        level_type: "지상"
      })
    ).rejects.toThrow(/위도/);
  });

  it('valid input should call repo.insertPlace once and return id "plc_1"', async () => {
    const insertPlace = vi.fn().mockResolvedValue({ id: "plc_1" });
    const placeService = createPlaceService({
      placeRepository: { insertPlace }
    });

    const result = await placeService.createPlace({
      name: "테스트",
      latitude: 37.5,
      longitude: 127,
      level_type: "지상"
    });

    expect(insertPlace).toHaveBeenCalledTimes(1);
    expect(result.id).toBe("plc_1");
  });
});
