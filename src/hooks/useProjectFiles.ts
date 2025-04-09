import { ProjectFile } from "@/app/project/types";
import { useQuery } from "@tanstack/react-query";

export function useProjectFiles(projectId: string) {

  return useQuery({
    queryKey: ["projectFiles", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/container/files`);
      if (!response.ok) {
        throw new Error("Failed to fetch project files");
      }

      const data = await response.json();
      console.log(data);
      return data.files as ProjectFile;
    },
  });

}
