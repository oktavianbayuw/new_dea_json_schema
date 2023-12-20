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
}

module.exports = JsonRepository;
