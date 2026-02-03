import { useEffect, useState } from "react";
import FileTree from "./components/FileTree";
import {
  getTree,
  createFolder,
  createFile,
  renameNode,
  deleteNode,
} from "./api/fileApi";
import {
  FolderPlus,
  FilePlus,
  RefreshCcw,
  FoldVertical,
} from "lucide-react";

import { Modal, Input, ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [nodes, setNodes] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [treeVersion, setTreeVersion] = useState(0);

  // ---------- MODAL STATE ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [modalAction, setModalAction] = useState(null);
  // modalAction = { type: "folder" | "file" | "rename", parentId?, nodeId?, oldName? }

  useEffect(() => {
    loadTree();
  }, []);

  async function loadTree() {
    try {
      const data = await getTree();
      setNodes(data);
    } catch {
      toast.error("Failed to load file tree");
    }
  }

  // ---------- EXPLORER ACTIONS ----------
  async function handleRefresh() {
    setActiveFileId(null);
    await loadTree();
    setTreeVersion((v) => v + 1);
    toast.info("Explorer refreshed");
  }

  function handleCollapseAll() {
    const collapsedMap = nodes.reduce((acc, n) => {
      if (n.type === "folder") acc[n.id] = true;
      return acc;
    }, {});
    localStorage.setItem(
      "fileExplorer:collapsed",
      JSON.stringify(collapsedMap)
    );
    setTreeVersion((v) => v + 1);
    toast.info("Folders collapsed");
  }

  // ---------- MODAL OPEN HELPERS ----------
  function openCreateFolder(parentId) {
    setModalValue("");
    setModalAction({ type: "folder", parentId });
    setModalOpen(true);
  }

  function openCreateFile(parentId) {
    setModalValue("");
    setModalAction({ type: "file", parentId });
    setModalOpen(true);
  }

  function openRename(id, oldName) {
    setModalValue(oldName);
    setModalAction({ type: "rename", nodeId: id, oldName });
    setModalOpen(true);
  }

  // ---------- MODAL SUBMIT ----------
  async function handleModalOk() {
    if (!modalValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setModalOpen(false);

    try {
      if (modalAction.type === "folder") {
        await optimisticCreateFolder(
          modalAction.parentId,
          modalValue
        );
        toast.success("Folder created");
      }

      if (modalAction.type === "file") {
        await optimisticCreateFile(
          modalAction.parentId,
          modalValue
        );
        toast.success("File created");
      }

      if (modalAction.type === "rename") {
        await optimisticRename(
          modalAction.nodeId,
          modalAction.oldName,
          modalValue
        );
        toast.success("Renamed successfully");
      }
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    } finally {
      setModalValue("");
      setModalAction(null);
    }
  }

  // ---------- OPTIMISTIC HANDLERS ----------
  async function optimisticCreateFolder(parentId, name) {
    const prev = [...nodes];
    const tempId = "temp-" + Date.now();

    setNodes([...nodes, { id: tempId, name, type: "folder", parentId }]);

    try {
      const realNode = await createFolder(name, parentId);
      setNodes((c) => c.map((n) => (n.id === tempId ? realNode : n)));
    } catch {
      setNodes(prev);
      throw new Error("Folder name already exists or invalid");
    }
  }

  async function optimisticCreateFile(parentId, name) {
    const prev = [...nodes];
    const tempId = "temp-" + Date.now();

    setNodes([...nodes, { id: tempId, name, type: "file", parentId }]);

    try {
      const realNode = await createFile(name, parentId);
      setNodes((c) => c.map((n) => (n.id === tempId ? realNode : n)));
    } catch {
      setNodes(prev);
      throw new Error("File name already exists or invalid");
    }
  }

  async function optimisticRename(id, oldName, newName) {
    if (oldName === newName) return;

    const prev = [...nodes];

    setNodes((c) =>
      c.map((n) => (n.id === id ? { ...n, name: newName } : n))
    );

    try {
      await renameNode(id, newName);
    } catch {
      setNodes(prev);
      throw new Error("Rename failed");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;

    const prev = [...nodes];

    function collect(nodeId) {
      let res = [nodeId];
      nodes.forEach((n) => {
        if (n.parentId === nodeId) res = res.concat(collect(n.id));
      });
      return res;
    }

    const idsToDelete = collect(id);

    setNodes(nodes.filter((n) => !idsToDelete.includes(n.id)));
    if (idsToDelete.includes(activeFileId)) setActiveFileId(null);

    try {
      await deleteNode(id);
      toast.success("Deleted successfully");
    } catch {
      setNodes(prev);
      toast.error("Delete failed");
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#ec4899",      // pink
          colorBgBase: "#121018",
          colorBgContainer: "#1b1824",
          colorText: "#f9a8d4",
          colorBorder: "#831843",
        },
        components: {
          Modal: {
            headerBg: "#1b1824",
            contentBg: "#1b1824",
            footerBg: "#1b1824",
          },
          Input: {
            colorBgContainer: "#121018",
            colorText: "#f9a8d4",
            colorBorder: "#831843",
          },
        },
      }}
    >
      <div className="min-h-screen flex bg-[#121018] text-pink-100">
        {/* TOASTS */}
        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={2000}
          hideProgressBar
        />

        {/* MODAL */}
        <Modal
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={() => setModalOpen(false)}
          okText="Save"
          okButtonProps={{
            className: "bg-pink-500 hover:bg-pink-600 border-none",
          }}
          cancelButtonProps={{
            className: "text-pink-300",
          }}
          title={
            modalAction?.type === "rename"
              ? "Rename"
              : modalAction?.type === "folder"
              ? "New Folder"
              : "New File"
          }
        >
          <Input
            autoFocus
            placeholder="Enter name"
            value={modalValue}
            onChange={(e) => setModalValue(e.target.value)}
            onPressEnter={handleModalOk}
          />
        </Modal>

        {/* SIDEBAR */}
        <div className="w-72 bg-[#1b1824] border-r border-pink-900/40 p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-pink-400 uppercase">
              Explorer
            </h2>

            <div className="flex gap-1">
              <FolderPlus onClick={() => openCreateFolder("root")} />
              <FilePlus onClick={() => openCreateFile("root")} />
              <FoldVertical onClick={handleCollapseAll} />
              <RefreshCcw onClick={handleRefresh} />
            </div>
          </div>

          <FileTree
            key={treeVersion}
            nodes={nodes}
            parentId={null}
            activeFileId={activeFileId}
            onSelectFile={setActiveFileId}
            onCreateFolder={openCreateFolder}
            onCreateFile={openCreateFile}
            onRename={openRename}
            onDelete={handleDelete}
          />
        </div>

        {/* EDITOR */}
        <div className="flex-1 flex items-center justify-center text-pink-300/60">
          {activeFileId ? "File opened" : "No file selected"}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
