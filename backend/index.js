const express = require("express");
const cors = require("cors");
const treeRoutes = require("./routes/treeRoutes");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- HEALTH ----------
app.get("/health", (_, res) => {
  res.send("ok");
});

// ---------- ROUTES ----------
app.use(treeRoutes);

// ---------- START ----------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
