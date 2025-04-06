import { ProjectFile } from "@/app/project/types";
import { create } from "zustand";

type ProjectFileStoreState = {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
}

type ProjectFileStoreActions = {
  setFiles: (files: ProjectFile[]) => void;
  setActiveFile: (file: ProjectFile) => void;
}

type ProjectFileStore = ProjectFileStoreState & ProjectFileStoreActions;

export const useProjectFileStore = create<ProjectFileStore>((set) => ({
  files: [],
  activeFile: null,
  setFiles: (files) => set({ files }),
  setActiveFile: (file) => set({ activeFile: file }),
}));