import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

import ExplorerSidebar from "./components/ExplorerSidebar";
import NameModal from "./components/NameModal";
import { useFileExplorer } from "./hooks/useFileExplorer";

function App() {
  const explorer = useFileExplorer();

  const [modal, setModal] = useState(null);
  const [value, setValue] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true)
  const handleCollapse = () => {
    if (isCollapsed) {
      explorer.expandAll()
    } else {
      explorer.collapseAll()
    }
    setIsCollapsed(!isCollapsed)
  }
  const open = (action) => {
    setValue(action.oldName || "");
    setModal(action);
  };

  const submit = async () => {
    if (!value.trim()) return toast.error("Name cannot be empty");

    try {
      if (modal.type === "rename")
        await explorer.rename(modal.nodeId, modal.oldName, value);
      else
        await explorer.create(modal.type, modal.parentId, value);

      toast.success("Success");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setModal(null);
      setValue("");
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="min-h-screen flex bg-[#121018] text-pink-100">
        <ToastContainer position="bottom-right" theme="dark" autoClose={2000} />

        <NameModal
          open={!!modal}
          title={modal?.type === "rename" ? "Rename" : modal?.type === "folder" ? "New Folder" : "New File"}
          value={value}
          onChange={setValue}
          onOk={submit}
          onCancel={() => setModal(null)}
        />

        <ExplorerSidebar
          {...explorer}
          parentId={null}
          onCreateFolder={(id) => open({ type: "folder", parentId: id })}
          onCreateFile={(id) => open({ type: "file", parentId: id })}
          onSelectFile={(id) =>
            explorer.setActiveFileId(explorer.activeFileId === id ? null : id)
          }
          onRename={(id, oldName) => open({ type: "rename", nodeId: id, oldName })}
          onDelete={explorer.remove}
          onCollapse={handleCollapse}
          onRefresh={explorer.refresh}
        />

        <div className="flex-1 flex items-center justify-center text-pink-300/60">
          {explorer.activeFileId ? "File opened" : "No file selected"}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
