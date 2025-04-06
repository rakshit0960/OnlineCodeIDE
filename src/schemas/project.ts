import { z } from "zod";

/**
 * Schema for validating project creation requests
 * Used for validating the POST /api/project request body
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string(),
  language: z.enum(["C", "PYTHON"])
});


// Type inference from the schemas for TypeScript use
export type CreateProject = z.infer<typeof createProjectSchema>;
