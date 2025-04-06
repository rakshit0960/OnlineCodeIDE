import LanguageIcon from "@/components/LanguageIcon";
import { Project } from "@prisma/client";
import { FaPlay, FaSave } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useProjectFileStore } from "@/store/projectFileStore";


interface ProjectHeaderProps {
  project: Project;
  isRunning: boolean;
  onSave: () => void;
  onRun: () => void;
}

export default function ProjectHeader({
  project,
  isRunning,
  onSave,
  onRun
}: ProjectHeaderProps) {
  const { activeFile } = useProjectFileStore();

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
          onClick={onSave}
          className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-600"
        >
          <FaSave className="mr-1.5 h-3.5 w-3.5" />
          Save
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