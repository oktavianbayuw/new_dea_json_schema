const JsonRepository = require("../repositories/jsonRepository");
const Ajv = require("ajv");

class JsonController {
  constructor() {
    this.jsonRepository = new JsonRepository();
    this.ajv = new Ajv();
  }

  convertToJsonSchema(jsonData) {
    try {
      const jsonSchema = this.generateJsonSchema(JSON.parse(jsonData));

      this.jsonRepository.saveJsonSchema(jsonSchema);

      return { jsonSchema };
    } catch (error) {
      console.error("Error converting JSON to JSON Schema:", error.message);
      throw error;
    }
  }

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

  async validateJson(jsonData, urlPath) {
    try {
      const jsonSchemas = this.jsonRepository.getAllJsonSchemas();
      const results = jsonSchemas.map((schema) => {
        const isValid = this.ajv.validate(schema, JSON.parse(jsonData));
        return { schema, isValid };
      });

      //   console.log(results);

      let status = 0;
      for (let result of results) {
        const url = `/${urlPath}`;
        status = result.isValid ? 1 : 0;
        const existingJsonSchema = await this.jsonRepository.saveResult(
          url,
          JSON.stringify(result.schema),
          status
        );

        if (existingJsonSchema) {
          return {
            schema: JSON.parse(existingJsonSchema),
            isValid: result.isValid,
          };
        }
      }

      //   console.log(results);
      return results;
    } catch (error) {
      console.error("Error validating JSON:", error.message);
      throw error;
    }
  }
}

module.exports = JsonController;
