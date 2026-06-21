import { Router } from "express";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parseListLimit(limitQuery) {
  if (limitQuery === undefined) {
    return DEFAULT_LIMIT;
  }

  const parsedLimit = Number.parseInt(String(limitQuery), 10);
  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    const error = new Error("limit은 1 이상의 정수여야 합니다.");
    error.status = 400;
    error.statusCode = 400;
    throw error;
  }

  return Math.min(parsedLimit, MAX_LIMIT);
}

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
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const limit = parseListLimit(req.query.limit);
      const items = await placeService.getPlaces({ limit });
      return res.status(200).json({ items });
    } catch (error) {
      return next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const item = await placeService.getPlaceById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "장소를 찾을 수 없습니다." });
      }

      return res.status(200).json(item);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
