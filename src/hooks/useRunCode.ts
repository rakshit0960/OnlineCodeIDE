import { ProjectFile } from "@/app/project/types";
import { useMutation } from "@tanstack/react-query";

interface RunCodeParams {
  activeFile: ProjectFile;
  projectId: string;
  input: string;
}

export function useRunCode() {
  return useMutation({
    mutationKey: ["runCode"],
    mutationFn: async ({activeFile, projectId, input}: RunCodeParams) => {
      const response = await fetch(`/api/projects/${projectId}/container/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: activeFile.content || "",
          filePath: activeFile.path || "",
          input: input,
        }),
      });

      return response.json();
    },
  });
}
