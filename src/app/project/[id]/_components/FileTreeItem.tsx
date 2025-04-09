import { ProjectFile } from "@/app/project/types";
import LanguageIcon from "@/components/LanguageIcon";
import { useFileContent } from "@/hooks/useFileContent";
import { useSaveFile } from "@/hooks/useSaveFile";
import { useProjectFileStore } from "@/store/projectFileStore";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoMdFolder, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { ImSpinner8 } from "react-icons/im";
import { twMerge } from "tailwind-merge";

interface FileTreeItemProps {
  file: ProjectFile;
  level: number;
}

export default function FileTreeItem({ file, level }: FileTreeItemProps) {
  const isFolder = file.isFolder;
  const { activeFile, setActiveFile } = useProjectFileStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();
  const projectId = params.id as string;
  const { data: fileContent, isLoading: isFileContentLoading } = useFileContent(
    {
      projectId,
      filePath: file.path,
      isFolder,
    }
  );
  const { mutate: saveFile } = useSaveFile();

  const handleFileClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFolder) {
      setIsExpanded(!isExpanded);
      return;
    }

    // Create file with content object regardless of path
    const fileWithContent = {
      ...file,
      content: fileContent,
    };

    /*
    // If there's an active file, save it first
    if (activeFile) {
      setIsSaving(true);
      saveFile(
        {
          projectId,
          filePath: activeFile.path,
          content: activeFile.content || "",
        },
        {
          onSuccess: () => {
            setActiveFile(fileWithContent);
            setIsSaving(false);
          },
          onError: () => {
            setIsSaving(false);
          },
        }
      );
    } else {
      // Just set the new file as active
      setActiveFile(fileWithContent);
    }
  */

    if (activeFile) {
      saveFile({
        projectId,
        filePath: activeFile.path,
        content: activeFile.content || "",
      });
    }
    setActiveFile(fileWithContent);
  };

  const indentStyle = {
    paddingLeft: `${level * 16}px`,
  };

  return (
    <div
      onClick={handleFileClick}
      className={twMerge(
        "group relative py-0.5",
        !isFolder && "cursor-pointer"
      )}
      style={indentStyle}
    >
      <div
        className={twMerge(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-md",
          "hover:bg-gray-700/50 transition-colors duration-150",
          "text-sm font-medium",
          isFolder ? "text-blue-400" : "text-gray-300",
          activeFile?.path === file.path && "bg-blue-500/10"
        )}
      >
        {isFolder ? (
          <div className="flex items-center gap-1.5">
            {isExpanded ? (
              <IoIosArrowDown className="text-gray-400" size={14} />
            ) : (
              <IoIosArrowForward className="text-gray-400" size={14} />
            )}
            <IoMdFolder className="text-blue-400" size={16} />
          </div>
        ) : isFileContentLoading || isSaving ? (
          <ImSpinner8 className="text-blue-500 animate-spin" size={14} />
        ) : (
          <LanguageIcon
            language={file.language || ""}
            className="text-gray-400"
          />
        )}
        <span className="truncate">{file.name}</span>
      </div>

      {isFolder && isExpanded && file.children?.length > 0 && (
        <div className="mt-0.5">
          {file.children.map((child) => (
            <FileTreeItem key={child.id} file={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
