import { useMutation } from "@tanstack/react-query";

export function useStartContainer() {
  return useMutation({
    mutationKey: ["startContainer"],
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/projects/${projectId}/container/start`);
      if (!res.ok) {
        throw new Error("Failed to start container");
      }
      return res.json();
    },
  });
}