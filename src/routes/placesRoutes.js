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
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const items = await placeService.getPlaces();
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
