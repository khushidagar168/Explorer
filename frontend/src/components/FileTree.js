import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileJson,
  FileTerminal,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";

const STORAGE_KEY = "fileExplorer:collapsed";

/* ---------- PERSISTENCE HELPERS ---------- */

const getCollapsedMap = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

const saveCollapsedMap = (map) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));

/* ---------- FILE ICON LOGIC ---------- */

function getFileIcon(name) {
  const n = name.toLowerCase();

  if (n.endsWith(".py"))
    return <FileCode className="w-4 h-4 text-yellow-400" />;

  if (n.endsWith(".js") || n.endsWith(".jsx"))
    return <FileCode className="w-4 h-4 text-yellow-300" />;

  if (n.endsWith(".json"))
    return <FileJson className="w-4 h-4 text-orange-400" />;

  if (n === ".gitignore")
    return <FileTerminal className="w-4 h-4 text-gray-400" />;

  return <FileText className="w-4 h-4 text-pink-400" />;
}

/* ---------- FILE TREE ---------- */

function FileTree({
  nodes,
  parentId,
  activeFileId,
  onSelectFile,
  onCreateFolder,
  onCreateFile,
  onRename,
  onDelete,
}) {
  const children = nodes.filter((n) => n.parentId === parentId);

  return (
    <ul className="pl-4">
      {children.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          nodes={nodes}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onCreateFolder={onCreateFolder}
          onCreateFile={onCreateFile}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

/* ---------- TREE NODE ---------- */

function TreeNode({
  node,
  nodes,
  activeFileId,
  onSelectFile,
  onCreateFolder,
  onCreateFile,
  onRename,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(() => {
    return getCollapsedMap()[node.id] !== true;
  });

  const isActive = node.type === "file" && node.id === activeFileId;

  /* persist expand/collapse state */
  useEffect(() => {
    const map = getCollapsedMap();
    map[node.id] = !expanded;
    saveCollapsedMap(map);
  }, [expanded, node.id]);

  const handleClick = () => {
    if (node.type === "file") {
      onSelectFile(node.id);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <li>
      <div
        onClick={handleClick}
        className={`group flex items-center gap-1 px-2 py-1 rounded cursor-pointer
          ${
            isActive
              ? "bg-pink-900/40 border-l-4 border-pink-500"
              : "hover:bg-pink-900/20"
          }`}
      >
        {/* Chevron */}
        {node.type === "folder" ? (
          <span className="w-4">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-pink-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-pink-400" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        {node.type === "folder" ? (
          expanded ? (
            <FolderOpen className="w-4 h-4 text-pink-400" />
          ) : (
            <Folder className="w-4 h-4 text-pink-400" />
          )
        ) : (
          getFileIcon(node.name)
        )}

        {/* Name */}
        <span className="flex-1 text-sm text-pink-100">
          {node.name}
        </span>

        {/* Actions */}
        <div className="hidden group-hover:flex gap-1">
          <Pencil
            onClick={(e) => {
              e.stopPropagation();
              onRename(node.id, node.name);
            }}
            className="w-4 h-4 text-pink-400"
          />

          <Trash2
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="w-4 h-4 text-pink-400"
          />

          {node.type === "folder" && (
            <>
              <Plus
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder(node.id);
                }}
                className="w-4 h-4 text-pink-400"
              />
              <FileText
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFile(node.id);
                }}
                className="w-4 h-4 text-pink-400"
              />
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {node.type === "folder" && expanded && (
        <FileTree
          nodes={nodes}
          parentId={node.id}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onCreateFolder={onCreateFolder}
          onCreateFile={onCreateFile}
          onRename={onRename}
          onDelete={onDelete}
        />
      )}
    </li>
  );
}

export default FileTree;
