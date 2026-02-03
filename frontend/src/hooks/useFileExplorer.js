import { useEffect, useState } from "react";
import {
  getTree,
  createFolder,
  createFile,
  renameNode,
  deleteNode,
} from "../api/fileApi";
import { toast } from "react-toastify";

export function useFileExplorer() {
  const [nodes, setNodes] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [treeVersion, setTreeVersion] = useState(0);

  useEffect(() => {
    loadTree();
  }, []);

  async function loadTree() {
    try {
      setNodes(await getTree());
    } catch {
      toast.error("Failed to load file tree");
    }
  }

  async function refresh() {
    setActiveFileId(null);
    await loadTree();
    setTreeVersion((v) => v + 1);
    toast.info("Explorer refreshed");
  }

  function collapseAll() {
    const collapsed = Object.fromEntries(
      nodes.filter(n => n.type === "folder").map(n => [n.id, true])
    );
    localStorage.setItem("fileExplorer:collapsed", JSON.stringify(collapsed));
    setTreeVersion((v) => v + 1);
    toast.info("Folders collapsed");
  }

  async function create(type, parentId, name) {
    const tempId = `temp-${Date.now()}`;
    const prev = [...nodes];

    setNodes([...nodes, { id: tempId, name, type, parentId }]);

    try {
      const real =
        type === "folder"
          ? await createFolder(name, parentId)
          : await createFile(name, parentId);

      setNodes(c => c.map(n => (n.id === tempId ? real : n)));
    } catch {
      setNodes(prev);
      throw new Error(`${type} creation failed`);
    }
  }

  async function rename(id, oldName, newName) {
    if (oldName === newName) return;

    const prev = [...nodes];
    setNodes(c => c.map(n => n.id === id ? { ...n, name: newName } : n));

    try {
      await renameNode(id, newName);
    } catch {
      setNodes(prev);
      throw new Error("Rename failed");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this item?")) return;

    const prev = [...nodes];

    const collect = (pid) =>
      [pid, ...nodes.filter(n => n.parentId === pid).flatMap(n => collect(n.id))];

    const ids = collect(id);

    setNodes(nodes.filter(n => !ids.includes(n.id)));
    if (ids.includes(activeFileId)) setActiveFileId(null);

    try {
      await deleteNode(id);
      toast.success("Deleted successfully");
    } catch {
      setNodes(prev);
      toast.error("Delete failed");
    }
  }

  return {
    nodes,
    activeFileId,
    treeVersion,
    setActiveFileId,
    refresh,
    collapseAll,
    create,
    rename,
    remove,
  };
}
