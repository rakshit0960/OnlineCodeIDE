"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useProject } from "@/hooks/useProject";
import { useProjectFileStore } from "@/store/projectFileStore";
import { exampleFiles } from "../types";
import CodeEditor from "./_components/CodeEditor";
import Console from "./_components/Terminal";
import FileExplorer from "./_components/FileExplorer";
import LoadingState from "./_components/LoadingState";
import NotFoundState from "./_components/NotFoundState";
import ProjectHeader from "./_components/ProjectHeader";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startingContainer, setStartingContainer] = useState(false);
  const [codeContent, setCodeContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setFiles, activeFile } = useProjectFileStore();
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  // Load project files and set loading state
  useEffect(() => {
    // return NextResponse.json({ container: newContainerData }, { status: 200 });
    async function startContainer() {
      try {
        setStartingContainer(true);
        const res = await fetch(`/api/projects/${projectId}/container/start`);
        if (!res.ok) {
          throw new Error("Failed to start container");
        }
        const data = await res.json();
        setFiles(exampleFiles);
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
  }, [projectId, setFiles, isProjectLoading]);

  // Handle code execution
  const runCode = () => {
    if (!activeFile) return;

    setIsRunning(true);
    setOutput("");

    // Simulate code execution with a delay
    setTimeout(() => {
      try {
        // In a real application, you would send the code to a backend service
        // For now, we'll just simulate output

        setOutput(
          "Running JavaScript...\n\n> Hello, World!\n> Hello, Developer!\n\nExecution completed successfully."
        );
      } catch (error) {
        setOutput(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  // Handle code content changes
  const handleCodeChange = (value: string | undefined) => {
    setCodeContent(value || "");

    // In a real app, you might want to debounce this and save changes to the project
  };

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col bg-gray-900 pt-16 justify-center items-center">
        <div className="text-red-500">{error}</div>
        <button className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Save project changes
  const saveProject = () => {
    // In a real app, this would send the updated project data to the server
    alert("Project saved successfully!");
  };

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

  // // Container is running and the user can terminate it or start a new one
  // if (alreadyRunningContainer !== null) {
  //   return (
  //     <div className="absolute inset-0 flex h-screen w-full flex-col bg-gray-900 pt-16 justify-center items-center">
  //       <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
  //         <div className="mb-6">
  //           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
  //             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
  //             </svg>
  //           </div>
  //           <h1 className="text-white text-2xl font-bold mb-2">Container is Running</h1>
  //           <p className="text-gray-300 text-sm mb-6">
  //             Your development environment is already active. You can terminate the container to start a new one or return to your project.
  //           </p>
  //         </div>
  //         <div className="flex flex-col space-y-3">
  //           <button
  //             className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
  //             onClick={() => {
  //               console.log("terminate container");
  //               // Here you would call an API to terminate the container
  //             }}
  //           >
  //             Terminate Container
  //           </button>
  //           <button
  //             className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
  //             onClick={() => window.history.back()}
  //           >
  //             Go Back
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 ">
      {/* Header/Toolbar */}
      <ProjectHeader
        project={project}
        isRunning={isRunning}
        onSave={saveProject}
        onRun={runCode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar/File Explorer */}
        <FileExplorer />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor content={codeContent} onChange={handleCodeChange} />
          </div>

          {/* Console/Output */}
          <Console output={output} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
