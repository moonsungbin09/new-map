import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { createSqlClient } from "./db/pool.js";
import { createPlaceRepository } from "./repositories/placeRepository.js";
import { createPlaceService } from "./services/placeService.js";

const DB_RETRY_INTERVAL_MS = 5000;

function createServiceUnavailableError() {
  const error = new Error("데이터베이스 연결 준비 중입니다. 잠시 후 다시 시도해 주세요.");
  error.code = "SERVICE_UNAVAILABLE";
  return error;
}

function createUnavailablePlaceService() {
  return {
    async createPlace() {
      throw createServiceUnavailableError();
    },
    async getPlaces() {
      throw createServiceUnavailableError();
    },
    async getPlaceById() {
      throw createServiceUnavailableError();
    }
  };
}

function createDelegatingPlaceService(initialService) {
  const state = { current: initialService };

  return {
    setCurrent(nextService) {
      state.current = nextService;
    },
    async createPlace(input) {
      return state.current.createPlace(input);
    },
    async getPlaces(options) {
      return state.current.getPlaces(options);
    },
    async getPlaceById(id) {
      return state.current.getPlaceById(id);
    }
  };
}

async function connectWithRetry({ onReady }) {
  let attempt = 0;

  while (true) {
    attempt += 1;
    try {
      const sqlClient = createSqlClient(config.db);
      await sqlClient.ping();
      onReady(sqlClient);
      console.info("Database connected. API is ready.");
      return;
    } catch (error) {
      console.warn(
        `Database connection attempt ${attempt} failed. Retrying in ${DB_RETRY_INTERVAL_MS}ms.`,
        error?.message ?? error
      );
      await new Promise((resolve) => setTimeout(resolve, DB_RETRY_INTERVAL_MS));
    }
  }
}

async function startServer() {
  try {
    const placeService = createDelegatingPlaceService(createUnavailablePlaceService());
    const app = createApp({ placeService });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.resolve(__dirname, "..", "public")));

    await new Promise((resolve, reject) => {
      const server = app.listen(config.port, () => resolve(server));
      server.on("error", reject);
    });

    console.info(`Server listening on port ${config.port}.`);

    void connectWithRetry({
      onReady: (sqlClient) => {
        const placeRepository = createPlaceRepository({ sql: sqlClient });
        placeService.setCurrent(createPlaceService({ placeRepository }));
      }
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
