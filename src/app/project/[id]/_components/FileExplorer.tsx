import { useProjectFileStore } from "@/store/projectFileStore";
import FileTreeItem from "./FileTreeItem";


export default function FileExplorer() {
  const { files } = useProjectFileStore();

  return (
    <div className="w-64 overflow-y-auto border-r border-gray-700 bg-gray-800">
      <div className="p-3">
        <h2 className="mb-2 flex items-center text-sm font-medium text-gray-400">
          Files
        </h2>
        <div className="mt-2">
          {files.map((file) => (
            <FileTreeItem
              key={file.id}
              file={file}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
