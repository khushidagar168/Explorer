const BASE_URL = "http://localhost:4000";

export async function getTree() {
  const res = await fetch(`${BASE_URL}/tree`);
  return res.json();
}

export async function createFolder(name, parentId) {
  const res = await fetch(`${BASE_URL}/folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });

  if (!res.ok) throw new Error("Create folder failed");
  return res.json();
}

export async function createFile(name, parentId) {
  const res = await fetch(`${BASE_URL}/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });

  if (!res.ok) throw new Error("Create file failed");
  return res.json();
}

export async function renameNode(id, newName) {
  const res = await fetch(`${BASE_URL}/rename`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, newName }),
  });

  if (!res.ok) throw new Error("Rename failed");
  return res.json();
}

export async function deleteNode(id) {
  const res = await fetch(`${BASE_URL}/node`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
