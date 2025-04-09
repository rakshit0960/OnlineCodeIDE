import { Language } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateProjectParams {
  name: string;
  description: string;
  language: Language;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: (newProject: CreateProjectParams) => {
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
}
