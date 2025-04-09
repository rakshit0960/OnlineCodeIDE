import { useProjectFiles } from "@/hooks/useProjectFiles";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import CreateFileDialog from "./CreateFileDialog";
import ErrorState from "./ErrorState";
import FileTreeItem from "./FileTreeItem";
import LoadingState from "./LoadingState";

export default function FileExplorer() {
  const params = useParams();
  const projectId = params.id as string;
  const { data: files, isLoading, error } = useProjectFiles(projectId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-64 h-full flex flex-col border-r border-gray-700 bg-gray-800">
      {/* Header */}

      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-medium text-gray-400">Files</h2>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700/50 transition-colors"
            title="Create new file or folder"
          >
            <IoIosAdd size={22} />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto pb-3">
        <div className="px-3">
          {files?.children.map((file) => (
            <FileTreeItem
              key={file.id}
              file={file}
              level={0}
            />
          ))}
        </div>
      </div>

      <CreateFileDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
