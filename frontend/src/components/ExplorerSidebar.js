import ExplorerToolbar from "./ExplorerToolbar";
import FileTree from "./FileTree";

export default function ExplorerSidebar(props) {
  return (
    <div className="w-72 bg-[#1b1824] border-r border-pink-900/40 p-3">
      <ExplorerToolbar
        onNewFolder={() => props.onCreateFolder("root")}
        onNewFile={() => props.onCreateFile("root")}
        onCollapse={props.onCollapse}
        onRefresh={props.onRefresh}
      />

      <FileTree {...props} />
    </div>
  );
}
