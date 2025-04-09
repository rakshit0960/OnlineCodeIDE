import FileTreeItem from "./FileTreeItem";

import { useProjectFiles } from "@/hooks/useProjectFiles";
import { useParams } from "next/navigation";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
export default function FileExplorer() {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const { data: files, isLoading, error } = useProjectFiles(projectId);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["projectFiles", projectId] });
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-64 overflow-y-auto border-r border-gray-700 bg-gray-800">
      <div className="p-3">
        <h2 className="mb-2 flex items-center text-sm font-medium text-gray-400">
          Files
        </h2>
        <div className="mt-2">
          {files?.children.map((file) => (
            <FileTreeItem key={file.id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
