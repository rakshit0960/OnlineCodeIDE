"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useProject } from "@/hooks/useProject";
import CodeEditor from "./_components/CodeEditor";
import FileExplorer from "./_components/FileExplorer";
import LoadingState from "./_components/LoadingState";
import NotFoundState from "./_components/NotFoundState";
import ProjectHeader from "./_components/ProjectHeader";
import Console from "./_components/Console";
import { useProjectFileStore } from "@/store/projectFileStore";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { activeFile } = useProjectFileStore();

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startingContainer, setStartingContainer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  // Load project files and set loading state
  useEffect(() => {
    async function startContainer() {
      try {
        setStartingContainer(true);
        const res = await fetch(`/api/projects/${projectId}/container/start`);
        if (!res.ok) {
          throw new Error("Failed to start container");
        }
        const data = await res.json();
        console.log(data);
        setIsLoading(false);
        setStartingContainer(false);
      } catch (error) {
        console.error("Container start error:", error);
        setError(error instanceof Error ? error.message : String(error));
        setIsLoading(false);
        setStartingContainer(false);
      }
    }
    if (projectId && !isProjectLoading) {
      startContainer();
    }
  }, [projectId, isProjectLoading]);

  // Handle code execution
  const runCode = async () => {
    if (!activeFile || !project) return;

    setIsRunning(true);
    setOutput("");

    try {
      const response = await fetch(`/api/projects/${projectId}/container/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: activeFile.content || "",
          filePath: activeFile.path,
          input: input,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute code");
      }

      // Combine stdout and stderr for display
      let combinedOutput = "";
      if (data.stdout) {
        combinedOutput += data.stdout;
      }
      if (data.stderr) {
        combinedOutput += "\n" + data.stderr;
      }

      setOutput(combinedOutput);
      console.log(data);
      console.log(combinedOutput);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col bg-gray-900 pt-16 justify-center items-center">
        <div className="text-red-500">{error}</div>
        <button className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (isProjectLoading || isLoading) {
    return <LoadingState />;
  }

  if (startingContainer) {
    return (
      <div className="flex h-screen w-full flex-col bg-gray-900 pt-16 justify-center items-center">
        <div className="text-white text-2xl font-bold mb-2">Starting Container...</div>
      </div>
    );
  }

  if (!project) {
    return <NotFoundState />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 ">
      {/* Header/Toolbar */}
      <ProjectHeader
        project={project}
        isRunning={isRunning}
        onRun={runCode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar/File Explorer */}
        <FileExplorer />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
            />
          </div>

          {/* Console/Output */}
          <Console output={output} isRunning={isRunning} input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
