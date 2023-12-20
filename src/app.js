const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes");
const JsonController = require("./controllers/jsonController");

const app = express();
const port = 3000;

app.use(bodyParser.json());
const jsonController = new JsonController();
app.use("/api", routes);

// Menyesuaikan rute untuk menampilkan halaman HTML pada akar (/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/getJsonSchema", (req, res) => {
  const { urlPath } = req.query;

  // Panggil metode dari JsonController untuk mendapatkan JSON Schema
  const jsonSchema = jsonController.getJsonSchemaByUrlPath(urlPath);

  if (jsonSchema) {
    res.json(jsonSchema);
  } else {
    res
      .status(404)
      .json({ error: "JSON Schema not found for the specified URL Path." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
