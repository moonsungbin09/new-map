import dotenv from "dotenv";

dotenv.config();

function parseBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }
  return String(value).toLowerCase() === "true";
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    server: process.env.DB_SERVER ?? "localhost",
    port: Number(process.env.DB_PORT ?? 1433),
    database: process.env.DB_NAME ?? "new_map",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    options: {
      encrypt: parseBoolean(process.env.DB_ENCRYPT, true)
    }
  }
};
