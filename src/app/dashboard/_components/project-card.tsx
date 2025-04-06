import { Project } from "@prisma/client";
import LanguageIcon from "../../../components/LanguageIcon";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      key={project.id}
      className="flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center mb-2 gap-2">
        <LanguageIcon language={project.language} />
        <h2 className="text-xl font-semibold text-gray-100">{project.name}</h2>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        {project.description || "No description provided"}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <Link
          href={`/project/${project.id}`}
          className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
