const express = require("express");
const JsonController = require("../controllers/jsonController");

const router = express.Router();
const jsonController = new JsonController();

router.post("/convert", (req, res) => {
  const { jsonString } = req.body;

  const jsonSchema = jsonController.convertToJsonSchema(jsonString);

  res.json({ jsonSchema });
});

module.exports = router;
