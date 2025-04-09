import { useQuery } from "@tanstack/react-query";

export function useProjects() {
  return useQuery({
    queryFn: () => {
      return fetch("/api/projects").then((res) => res.json());
    },
    queryKey: ["projects"]
  });
}