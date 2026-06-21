import mssql from "mssql";
import { randomUUID } from "node:crypto";

export function createSqlClient(dbConfig) {
  const pool = new mssql.ConnectionPool(dbConfig);
  const poolConnect = pool.connect();

  async function createRequest() {
    const connectedPool = await poolConnect;
    return connectedPool.request();
  }

  return {
    async insertPlace(input) {
      const id = `plc_${randomUUID()}`;
      const request = await createRequest();

      await request
        .input("id", mssql.NVarChar(64), id)
        .input("name", mssql.NVarChar(255), input.name)
        .input("latitude", mssql.Float, Number(input.latitude))
        .input("longitude", mssql.Float, Number(input.longitude))
        .input("level_type", mssql.NVarChar(20), input.level_type)
        .input("description", mssql.NVarChar(mssql.MAX), input.description ?? null)
        .query(`
          INSERT INTO dbo.places (id, name, latitude, longitude, level_type, description)
          VALUES (@id, @name, @latitude, @longitude, @level_type, @description)
        `);

      return { id };
    },

    async listPlaces() {
      const request = await createRequest();
      const result = await request.query(`
        SELECT id, name, level_type, created_at
        FROM dbo.places
        ORDER BY created_at DESC
      `);
      return result.recordset;
    },

    async getPlace(id) {
      const request = await createRequest();
      const result = await request.input("id", mssql.NVarChar(64), id).query(`
        SELECT id, name, latitude, longitude, level_type, description, created_at
        FROM dbo.places
        WHERE id = @id
      `);
      return result.recordset[0] ?? null;
    },

    async ping() {
      const request = await createRequest();
      await request.query("SELECT 1");
    }
  };
}
