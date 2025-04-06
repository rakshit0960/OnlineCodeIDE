"use client";

import { Language } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import LanguageIcon from "../../../components/LanguageIcon";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: {
    name: string;
    description: string;
    language: Language;
  }) => void;
}

export default function CreateProjectDialog({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [language, setLanguage] = useState<Language>("PYTHON");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog open/close based on isOpen prop
  useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen) {
      dialogRef.current.showModal();
      document.body.classList.add("overflow-hidden");
    } else {
      dialogRef.current.close();
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Reset form when dialog is closed
  const handleClose = () => {
    setProjectName("");
    setProjectDescription("");
    setLanguage("PYTHON");
    setIsSubmitting(false);
    onClose();
  };

  // Handle project creation
  const handleSubmit = () => {
    if (!projectName.trim()) return;

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      onCreateProject({
        name: projectName,
        description: projectDescription,
        language,
      });

      handleClose();
    }, 300);
  };


  return (
    <dialog
      ref={dialogRef}
      className="min-w-[550px] p-0 rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden"
      onClose={handleClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-850">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-lg shadow-lg">
            <IoMdAdd className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Create New Project
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="cursor-pointer text-gray-400 hover:text-white transition-colors rounded-full p-1.5 hover:bg-gray-700/50 backdrop-blur-sm"
          aria-label="Close dialog"
        >
          <IoClose className="h-6 w-6" />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8">
        <div className="space-y-3">
          <label
            htmlFor="projectName"
            className="text-sm font-medium text-gray-300 flex items-center"
          >
            Project Name <span className="text-blue-500 ml-1">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-700 bg-gray-850 px-4 py-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-gray-600"
            placeholder="Enter project name"
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">e.g. MyAwesomeProject</p>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="projectDescription"
            className="text-sm font-medium text-gray-300 flex items-center"
          >
            Description{" "}
            <span className="text-gray-500 text-xs ml-2">(optional)</span>
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-700 bg-gray-850 px-4 py-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-gray-600"
            placeholder="Describe your project's purpose and goals..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="projectLanguage"
            className="text-sm font-medium text-gray-300 flex items-center"
          >
            Language <span className="text-blue-500 ml-1">*</span>
          </label>
          <div className="relative group">
            <select
              id="projectLanguage"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full appearance-none rounded-xl border-2 border-gray-700 bg-gray-800 px-4 pl-10 py-3.5 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-gray-600/80 pr-12 cursor-pointer"
            >
              <option
                value="PYTHON"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-2"
              >
                Python
              </option>
              <option
                value="C"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-2"
              >
                C
              </option>
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>

          {/* Language selection indicator */}
          <div className="flex items-center p-3 mt-2 text-gray-300 bg-gray-700/30 rounded-xl border border-gray-700/50">
            <LanguageIcon language={language} />
            <span className="text-sm font-medium ml-3">
              {language === "PYTHON" ? "Python" : "C"} selected
            </span>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="flex items-center justify-end gap-6 p-6 border-t border-gray-700 bg-gray-850 backdrop-blur-sm">
        <button
          onClick={handleClose}
          className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/30 border border-gray-700 hover:border-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!projectName.trim() || isSubmitting}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 duration-200"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <IoMdAdd className="h-4 w-4" />
          )}
          Create Project
        </button>
      </div>
    </dialog>
  );
}
