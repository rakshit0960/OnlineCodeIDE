import { ProjectFile } from "@/app/project/types";
import { twMerge } from "tailwind-merge";
import { FaFolder } from "react-icons/fa";
import LanguageIcon from "@/components/LanguageIcon";
import { useProjectFileStore } from "@/store/projectFileStore";


interface FileTreeItemProps {
  file: ProjectFile;
}

export default function FileTreeItem({ file }: FileTreeItemProps) {
  const isFolder = file.isFolder;
  const { setActiveFile } = useProjectFileStore();

  return (
    <div
      onClick={() => (!isFolder && setActiveFile(file))} // if it's a folder, don't do anything
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