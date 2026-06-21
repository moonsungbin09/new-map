import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { createSqlClient } from "./db/pool.js";
import { createPlaceRepository } from "./repositories/placeRepository.js";
import { createPlaceService } from "./services/placeService.js";

async function startServer() {
  try {
    const sqlClient = createSqlClient(config.db);
    const placeRepository = createPlaceRepository({ sql: sqlClient });
    const placeService = createPlaceService({ placeRepository });
    const app = createApp({ placeService });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.resolve(__dirname, "..", "public")));

    await placeService.getPlaces();

    await new Promise((resolve, reject) => {
      const server = app.listen(config.port, () => resolve(server));
      server.on("error", reject);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
