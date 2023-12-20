const express = require("express");
const JsonController = require("../controllers/jsonController");

const router = express.Router();
const jsonController = new JsonController();

// Rute untuk mengonversi JSON ke JSON Schema
router.post("/convert", (req, res) => {
  const { jsonString } = req.body;
  const jsonSchema = jsonController.convertToJsonSchema(jsonString);
  res.json({ jsonSchema });
});

// Rute untuk melakukan validasi JSON terhadap JSON Schema
router.post("/validate", (req, res) => {
  const { jsonString, urlPath } = req.body;
  const validationResult = jsonController.validateJson(jsonString, urlPath);
  res.json(validationResult);
});

module.exports = router;
