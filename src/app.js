const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", routes);

// Menyesuaikan rute untuk menampilkan halaman HTML pada akar (/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
