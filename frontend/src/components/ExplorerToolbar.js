import { FolderPlus, FilePlus, RefreshCcw, FoldVertical } from "lucide-react";

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

      <div className="flex gap-1">
        <FolderPlus onClick={onNewFolder} />
        <FilePlus onClick={onNewFile} />
        <FoldVertical onClick={onCollapse} />
        <RefreshCcw onClick={onRefresh} />
      </div>
    </div>
  );
}
