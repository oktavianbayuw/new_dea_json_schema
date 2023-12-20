class JsonRepository {
  constructor() {
    this.jsonSchemas = [];
  }

  saveJsonSchema(jsonSchema) {
    this.jsonSchemas.push(jsonSchema);
    console.log("JSON Schema saved:", jsonSchema);
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
}

module.exports = JsonRepository;
