const { v4: uuid } = require("uuid");

const findNodeById = (id, nodes) =>
  nodes.find((n) => n.id === id);

const isValidName = (name) =>
  !!name?.trim() && !name.startsWith(".");

const isDuplicateName = (name, parentId, nodes, excludeId = null) =>
  nodes.some(
    (n) =>
      n.parentId === parentId &&
      n.id !== excludeId &&
      n.name.toLowerCase() === name.toLowerCase()
  );

function collectChildIds(id, nodes) {
  let result = [id];
  nodes.forEach((n) => {
    if (n.parentId === id) {
      result = result.concat(collectChildIds(n.id, nodes));
    }
  });
  return result;
}

function createNode({ name, type, parentId }) {
  return {
    id: uuid(),
    name,
    type,
    parentId,
  };
}

module.exports = {
  findNodeById,
  isValidName,
  isDuplicateName,
  collectChildIds,
  createNode,
};
