const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const filePath = path.join(dataDir, "nodes.json");


function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const initialData = [
      {
        id: "root",
        name: "root",
        type: "folder",
        parentId: null,
      },
    ];
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
}

function readNodes() {
  ensureStore();
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeNodes(nodes) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2));
}

module.exports = {
  readNodes,
  writeNodes,
};
