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
