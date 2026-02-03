const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { readNodes, writeNodes } = require("./store/nodeStore");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- HELPERS ----------
function findNodeById(id, nodes) {
  return nodes.find((n) => n.id === id);
}

function isDuplicateName(name, parentId, nodes, excludeId = null) {
  return nodes.some(
    (n) =>
      n.parentId === parentId &&
      n.id !== excludeId &&
      n.name.toLowerCase() === name.toLowerCase()
  );
}

function isValidName(name) {
  if (!name || !name.trim()) return false;
  if (name.startsWith(".")) return false; // blocks ".js", ".py"
  return true;
}

function collectChildIds(id, nodes) {
  let result = [id];
  nodes.forEach((n) => {
    if (n.parentId === id) {
      result = result.concat(collectChildIds(n.id, nodes));
    }
  });
  return result;
}

// ---------- HEALTH ----------
app.get("/health", (_, res) => {
  res.send("ok");
});

// ---------- GET TREE ----------
app.get("/tree", (_, res) => {
  res.json(readNodes());
});

// ---------- CREATE FOLDER ----------
app.post("/folder", (req, res) => {
  const { name, parentId } = req.body;
  const nodes = readNodes();

  if (!name || !parentId) {
    return res.status(400).json({ error: "name and parentId are required" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ error: "Invalid folder name" });
  }

  const parent = findNodeById(parentId, nodes);
  if (!parent || parent.type !== "folder") {
    return res.status(400).json({ error: "Invalid parent folder" });
  }

  if (isDuplicateName(name, parentId, nodes)) {
    return res
      .status(400)
      .json({ error: "Name already exists in this folder" });
  }

  const folder = {
    id: uuid(),
    name,
    type: "folder",
    parentId,
  };

  writeNodes([...nodes, folder]);
  res.status(201).json(folder);
});

// ---------- CREATE FILE ----------
app.post("/file", (req, res) => {
  const { name, parentId } = req.body;
  const nodes = readNodes();

  if (!name || !parentId) {
    return res.status(400).json({ error: "name and parentId are required" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  const parent = findNodeById(parentId, nodes);
  if (!parent || parent.type !== "folder") {
    return res.status(400).json({ error: "Invalid parent folder" });
  }

  if (isDuplicateName(name, parentId, nodes)) {
    return res
      .status(400)
      .json({ error: "Name already exists in this folder" });
  }

  const file = {
    id: uuid(),
    name,
    type: "file",
    parentId,
  };

  writeNodes([...nodes, file]);
  res.status(201).json(file);
});

// ---------- RENAME ----------
app.put("/rename", (req, res) => {
  const { id, newName } = req.body;
  const nodes = readNodes();

  if (!id || !newName) {
    return res.status(400).json({ error: "id and newName are required" });
  }

  if (id === "root") {
    return res.status(400).json({ error: "Root folder cannot be renamed" });
  }

  if (!isValidName(newName)) {
    return res.status(400).json({ error: "Invalid name" });
  }

  const node = findNodeById(id, nodes);
  if (!node) {
    return res.status(404).json({ error: "Node not found" });
  }

  if (isDuplicateName(newName, node.parentId, nodes, id)) {
    return res
      .status(400)
      .json({ error: "Name already exists in this folder" });
  }

  node.name = newName;
  writeNodes(nodes);
  res.json(node);
});

// ---------- DELETE ----------
app.delete("/node", (req, res) => {
  const { id } = req.body;
  const nodes = readNodes();

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  if (id === "root") {
    return res.status(400).json({ error: "Cannot delete root folder" });
  }

  const node = findNodeById(id, nodes);
  if (!node) {
    return res.status(404).json({ error: "Node not found" });
  }

  const idsToDelete = collectChildIds(id, nodes);
  const updatedNodes = nodes.filter(
    (n) => !idsToDelete.includes(n.id)
  );

  writeNodes(updatedNodes);
  res.json({ deletedIds: idsToDelete });
});

// ---------- START ----------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
