import { ProjectFile } from "@/app/project/types";
import { create } from "zustand";

type ProjectFileStoreState = {
  activeFile: ProjectFile | null;
}

type ProjectFileStoreActions = {
  setActiveFile: (file: ProjectFile) => void;
}

type ProjectFileStore = ProjectFileStoreState & ProjectFileStoreActions;

export const useProjectFileStore = create<ProjectFileStore>((set) => ({
  activeFile: null,
  setActiveFile: (file) => set({ activeFile: file }),
}));