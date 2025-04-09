import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SaveFileParams {
  projectId: string;
  filePath: string;
  content: string;
}

export function useSaveFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveFile"],
    mutationFn: async ({ projectId, filePath, content }: SaveFileParams) => {
      return await fetch(`/api/projects/${projectId}/container/files${filePath}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fileContent", variables.projectId, variables.filePath] });
    },
  });
}
