"use client"

import { Language, Project } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useState } from "react";
import CreateProjectDialog from "./_components/CreateProjectDialog";
import ProjectCard from "./_components/project-card";

export default function ProjPagesTemp() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query to fetch projects
  const { data: projectsData, isLoading: isProjectsLoading, error: projectsError } = useQuery({
    queryFn: () => {
      return fetch("/api/projects").then((res) => res.json());
    },
    queryKey: ["projects"]
  });

  // Mutation to create a new project
  const createProjectMutation = useMutation({
    mutationFn: (newProject: { name: string; description: string; language: Language }) => {
      return fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Handle project creation
  const handleCreateProject = (project: { name: string; description: string; language: Language }) => {
    createProjectMutation.mutate(project);
  };

  // Extract projects from the response
  const projects = projectsData?.projects || [];

  if (isProjectsLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800/80 rounded-xl shadow-xl border border-gray-700">
          <ImSpinner8 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <span className="text-xl font-semibold text-gray-100">Loading your projects...</span>
          <p className="text-sm text-gray-400 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800/80 rounded-xl shadow-xl border border-gray-700">
          <span className="text-xl font-semibold text-gray-100">Error loading projects</span>
          <p className="text-sm text-gray-400 mt-2">Something went wrong while fetching your projects</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 px-6 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Your Projects
          </h1>

          <div className="flex items-center space-x-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-64 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Create project button */}
            <button
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaPlus className="mr-2" />
              New Project
            </button>
          </div>
        </header>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
              <p className="mb-4 text-xl font-medium text-gray-300">No projects found</p>
              <p className="mb-6 text-gray-500">Create your first project to get started</p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="cursor-pointer flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Project creation dialog */}
      <CreateProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
