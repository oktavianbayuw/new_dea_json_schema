// jsonController.js
const JsonRepository = require("../repositories/jsonRepository");
const Ajv = require("ajv"); // Import library validasi Ajv

class JsonController {
  constructor() {
    this.jsonRepository = new JsonRepository();
    this.ajv = new Ajv(); // Inisialisasi Ajv
  }

  convertToJsonSchema(jsonData) {
    try {
      // Implementasi konversi JSON ke JSON Schema disini
      const jsonSchema = this.generateJsonSchema(JSON.parse(jsonData));

      // Simpan JSON Schema menggunakan metode di JsonRepository
      this.jsonRepository.saveJsonSchema(jsonSchema);

      return { jsonSchema };
    } catch (error) {
      console.error("Error converting JSON to JSON Schema:", error.message);
      throw error;
    }
  }

  // Metode untuk menghasilkan JSON Schema dari data JSON
  generateJsonSchema(data) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid JSON data.");
    }

    return {
      type: "object",
      properties: this.generateProperties(data),
    };
  }

  generateProperties(data) {
    const properties = {};

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const type = typeof value;

        // Rekursif untuk objek yang bersarang
        if (type === "object" && value !== null) {
          properties[key] = {
            type: "object",
            properties: this.generateProperties(value),
          };
        } else {
          properties[key] = { type };
        }
      }
    }
    return properties;
  }

  validateJson(jsonData) {
    try {
      // Dapatkan JSON Schema yang tersimpan
      const jsonSchemas = this.jsonRepository.getAllJsonSchemas();

      // Validasi JSON terhadap semua JSON Schemas yang tersimpan
      const results = jsonSchemas.map((schema) => {
        const isValid = this.ajv.validate(schema, JSON.parse(jsonData));
        return { schema, isValid };
      });

      return results;
    } catch (error) {
      console.error("Error validating JSON:", error.message);
      throw error;
    }
  }
}

module.exports = JsonController;
