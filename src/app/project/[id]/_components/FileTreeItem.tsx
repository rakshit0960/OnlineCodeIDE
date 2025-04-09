import { ProjectFile } from "@/app/project/types";
import { twMerge } from "tailwind-merge";
import { FaFolder } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import LanguageIcon from "@/components/LanguageIcon";
import { useProjectFileStore } from "@/store/projectFileStore";
import { useParams } from "next/navigation";
import { useState } from "react";

interface FileTreeItemProps {
  file: ProjectFile;
}

export default function FileTreeItem({ file }: FileTreeItemProps) {
  const isFolder = file.isFolder;
  const { setActiveFile } = useProjectFileStore();
  const params = useParams();
  const projectId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);

  const handleFileClick = async () => {
    if (isFolder) return;

    setIsLoading(true);
    try {
      // Fetch file content from the API
      const response = await fetch(`/api/projects/${projectId}/container/files${file.path}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      const data = await response.json();

      // Update the file object with content
      const fileWithContent = {
        ...file,
        content: data.content
      };

      setActiveFile(fileWithContent);
    } catch (error) {
      console.error('Error fetching file content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleFileClick}
      className={twMerge("py-0.5 px-0.5 rounded-md", !isFolder && "cursor-pointer")}
    >
      <div
        className={twMerge(
          "hover:bg-gray-700 transition-colors duration-150 rounded-md p-1.5",
          "flex items-center gap-1.5 text-sm font-medium cursor-pointer",
          isFolder ? "text-blue-400" : "text-gray-300"
        )}
      >
        {isFolder ? (
          <FaFolder className="text-yellow-500" size={13} />
        ) : isLoading ? (
          <ImSpinner8 className="text-blue-500 animate-spin" size={13} />
        ) : (
          <LanguageIcon language={file.language || ""} className="text-gray-400" />
        )}
        <span className="truncate">{file.name}</span>
      </div>
      {isFolder && file.children?.length > 0 && (
        <div className="ml-2 mt-0.5 pl-1.5 border-l border-gray-700">
          {file.children.map((child) => (
            <FileTreeItem
              key={child.id}
              file={child}
            />
          ))}
        </div>
      )}
    </div>
  );
}