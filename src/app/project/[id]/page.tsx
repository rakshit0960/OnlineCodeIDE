"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useProject } from "@/hooks/useProject";
import { useStartContainer } from "@/hooks/useStartContainer";
import CodeEditor from "./_components/CodeEditor";
import FileExplorer from "./_components/FileExplorer";
import LoadingState from "./_components/LoadingState";
import NotFoundState from "./_components/NotFoundState";
import ProjectHeader from "./_components/ProjectHeader";
import Console from "./_components/Console";
import { useProjectFileStore } from "@/store/projectFileStore";
import { useRunCode } from "@/hooks/useRunCode";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { activeFile } = useProjectFileStore();

  const [output, setOutput] = useState<{ stdout: string, stderr: string }>({ stdout: "", stderr: "" });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { mutate: startContainer, isPending: isStartingContainer } = useStartContainer();
  const { mutate: runCodeMutation, isPending: isRunningCode } = useRunCode();

  // Start container when project is loaded
  useEffect(() => {
    if (projectId && !isProjectLoading && !isStartingContainer) {
      startContainer(projectId, {
        onError: (error) => {
          setError(error instanceof Error ? error.message : String(error));
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isProjectLoading]);

  // Handle code execution
  const runCode = () => {
    if (!activeFile || !project) return;

    setOutput({ stdout: "", stderr: "" });

    runCodeMutation(
      { activeFile, projectId, input },
      {
        onSuccess: (data) => {
          setOutput({ stdout: data.stdout, stderr: data.stderr });
        },
        onError: (error) => {
          setOutput({ stdout: "", stderr: `Error: ${error instanceof Error ? error.message : String(error)}` });
        },
      }
    );
  };

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col bg-gray-900 pt-16 justify-center items-center">
        <div className="text-red-500">{error}</div>
        <button
          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isProjectLoading || isStartingContainer) {
    return <LoadingState />;
  }

  if (!project) {
    return <NotFoundState />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 ">
      {/* Header/Toolbar */}
      <ProjectHeader
        project={project}
        isRunning={isRunningCode}
        onRun={runCode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar/File Explorer */}
        <FileExplorer />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>

          {/* Console/Output */}
          <Console
            output={output}
            isRunning={isRunningCode}
            input={input}
            setInput={setInput}
          />
        </div>
      </div>
    </div>
  );
}
