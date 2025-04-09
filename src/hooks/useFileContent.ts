import { useQuery } from "@tanstack/react-query";

interface FileContentParams {
  projectId: string;
  filePath: string;
  isFolder?: boolean;
}

export function useFileContent({ projectId, filePath, isFolder }: FileContentParams) {

  return useQuery({
    queryKey: ["fileContent", projectId, filePath],
    queryFn: async () => {
      if (isFolder) return "";
      const response = await fetch(`/api/projects/${projectId}/container/files${filePath}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      const data = await response.json();
      return data.content;
    },
    enabled: !isFolder,
  });
}