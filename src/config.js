import dotenv from "dotenv";

dotenv.config();

function parseBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  const normalizedValue = String(value).trim().toLowerCase();
  if (normalizedValue === "true") {
    return true;
  }
  if (normalizedValue === "false") {
    return false;
  }

  throw new Error(
    `Invalid boolean value for DB_ENCRYPT: "${value}". Use "true" or "false".`
  );
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
