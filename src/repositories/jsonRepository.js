const mysql = require("mysql2/promise");
class JsonRepository {
  constructor() {
    this.jsonSchemas = [];
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "json_schema_checker",
    });
  }

  saveJsonSchema(jsonSchema) {
    this.jsonSchemas.push(jsonSchema);
    // console.log("JSON Schema saved:", jsonSchema);
  }

  getAllJsonSchemas() {
    return this.jsonSchemas;
  }

  getJsonSchemaByUrlPath(urlPath) {
    const jsonSchema = this.jsonSchemas.find(
      (schema) => schema.urlPath === urlPath
    );
    return jsonSchema || null;
  }

  async saveResult(urlPath, jsonSchema, status) {
    const connection = await this.pool.getConnection();
    try {
      const [existingRow] = await connection.query(
        "SELECT json_schema FROM results WHERE url_path = ?",
        [urlPath]
      );

      if (existingRow.length > 0) {
        console.log(existingRow.length[0]);
        return existingRow[0].json_schema;
      }

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      await connection.query(
        "INSERT INTO results (url_path, json_schema, status, dt_insert, dt_modified) VALUES (?, ?, ?, ?, ?)",
        [urlPath, jsonSchema, status, now, now]
      );

      return null; // No existing JSON Schema to display
    } finally {
      connection.release();
    }
  }
}

module.exports = JsonRepository;
