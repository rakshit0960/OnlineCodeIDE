import LanguageIcon from "@/components/LanguageIcon";
import { useSaveFile } from "@/hooks/useSaveFile";
import { useProjectFileStore } from "@/store/projectFileStore";
import { Project } from "@prisma/client";
import { useParams } from "next/navigation";
import { FaPlay, FaSave } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

interface ProjectHeaderProps {
  project: Project;
  isRunning: boolean;
  onRun: () => void;
}

export default function ProjectHeader({
  project,
  isRunning,
  onRun
}: ProjectHeaderProps) {
  const { activeFile } = useProjectFileStore();
  const params = useParams();
    const projectId = params.id as string;
  const { mutate: saveFile, isPending: isSaving } = useSaveFile();

  const handleSave = async () => {
    if (!activeFile) return;
    saveFile({ projectId, filePath: activeFile.path, content: activeFile.content || "" });
  };

  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-700 bg-gray-800 px-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-white">
          {project.name}
        </h1>
        <LanguageIcon className="ml-2" language={project.language} />
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleSave}
          disabled={isSaving || !activeFile}
          className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-600 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <ImSpinner8 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-1.5 h-3.5 w-3.5" />
              Save
            </>
          )}
        </button>

        <button
          onClick={onRun}
          disabled={isRunning || !activeFile}
          className="flex items-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1.5 text-sm text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <ImSpinner8 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <FaPlay className="mr-1.5 h-3.5 w-3.5" />
              Run
            </>
          )}
        </button>
      </div>
    </div>
  );
}