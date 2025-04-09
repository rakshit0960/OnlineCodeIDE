import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateFileParams {
  projectId: string;
  path: string;
  content?: string;
  isDirectory?: boolean;
}

export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, path, content, isDirectory }: CreateFileParams) => {
      const res = await fetch(`/api/projects/${projectId}/container/files/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          content,
          isDirectory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create file/folder");
      }

      return res.json();
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate the project files query to refresh the file explorer
      queryClient.invalidateQueries({ queryKey: ["projectFiles", projectId] });
    },
  });
}