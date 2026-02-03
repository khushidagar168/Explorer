import { Tooltip } from "antd";
import {
  FolderPlus,
  FilePlus,
  RefreshCcw,
  FoldVertical,
} from "lucide-react";

function IconButton({ title, onClick, children }) {
  return (
    <Tooltip title={title} placement="bottom">
      <span
        onClick={onClick}
        className="
          inline-flex items-center justify-center
          p-1
          cursor-pointer
          text-pink-400
          hover:text-pink-300
          transition-colors
        "
      >
        {children}
      </span>
    </Tooltip>
  );
}

export default function ExplorerToolbar({
  onNewFolder,
  onNewFile,
  onCollapse,
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold text-pink-400 uppercase">
        Explorer
      </h2>

      <div className="flex gap-2">
        <IconButton title="New Folder" onClick={onNewFolder}>
          <FolderPlus size={18} />
        </IconButton>

        <IconButton title="New File" onClick={onNewFile}>
          <FilePlus size={18} />
        </IconButton>

        <IconButton title="Collapse All Folders" onClick={onCollapse}>
          <FoldVertical size={18} />
        </IconButton>

        <IconButton title="Refresh Explorer" onClick={onRefresh}>
          <RefreshCcw size={18} />
        </IconButton>
      </div>
    </div>
  );
}
