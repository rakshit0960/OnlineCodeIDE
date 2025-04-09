import { ProjectFile } from "@/app/project/types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { executeContainerCommand, getContainerFileTypes } from "@/utils/dockerUtils";
import { handleApiError } from "@/utils/errorUtils";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
export const rootDir = "/app";

/**
 * GET handler for retrieving project files from a container
 * @param req - The incoming request
 * @param context - Contains route parameters including project ID
 * @returns JSON response with file structure or error
 */
export async function GET(
  req: NextRequest,
  context: { params: { project: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();

    const params = await context.params;
    const projectId = params.project;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve container information for the project
    const container = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    // Return error if container doesn't exist
    if (!container) {
      return NextResponse.json(
        { error: "Container not found" },
        { status: 404 }
      );
    }

    // Execute command to list all files in the container
    const { stdout, stderr } = await executeContainerCommand(container.containerId, "find /app");

    // Log command output for debugging
    console.log(stdout);
    console.log(stderr);

    // Process the output to create a structured file system
    const fileList = stdout.split("\n").filter(Boolean);

    // Get information about which paths are files and which are folders
    const fileTypeMap = await getContainerFileTypes(container.containerId);

    // Create root node for file hierarchy
    const rootFile: ProjectFile = {
      id: uuidv4(),
      name: "app",
      isFolder: true,
      path: "/app",
      children: [],
    };

    // Build file tree structure from flat list
    for (const file of fileList) {
      insertFile(rootFile, file, fileTypeMap);
    }

    // Return the file structure as JSON
    return NextResponse.json({ files: rootFile }, { status: 200 });
  } catch (error) {
    // Handle and format any errors
    return handleApiError(error);
  }
}

/**
 * Determines the language based on file extension
 * @param filename - The name of the file
 * @returns The language identifier or undefined
 */
function getLanguageFromExtension(filename: string): string | undefined {
  const ext = path.extname(filename);
  switch (ext) {
    case ".js":
      return "javascript";
    case ".ts":
      return "typescript";
    case ".tsx":
      return "typescriptreact";
    case ".jsx":
      return "javascriptreact";
    case ".json":
      return "json";
    case ".html":
      return "html";
    case ".css":
      return "css";
    case ".py":
      return "python";
    default:
      return undefined;
  }
}

/**
 * Inserts a file into the hierarchical file structure
 * @param root - The root node of the file tree
 * @param absPath - The absolute path of the file to insert
 * @param fileTypeMap - Map containing information about file types (file vs folder)
 */
function insertFile(root: ProjectFile, absPath: string, fileTypeMap: Map<string, boolean>) {
  // Skip the root directory itself
  if (absPath === "/app") return;

  // Remove the /app prefix to get the relative path
  const relativePath = absPath.replace(/^\/app\/?/, "");
  if (relativePath === "") return;

  // Split path into components
  const parts = relativePath.split("/").filter(Boolean);
  let current = root;
  let currentPath = "/app";

  // Traverse the path parts to build the tree
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath = path.join(currentPath, part).replace(/\\/g, '/'); // Replace backslashes with forward slashes
    const isLast = i === parts.length - 1;

    // Check if this node already exists in the current level
    let existing = current.children.find((c) => c.name === part);

    if (!existing) {
      // Get the information about whether this is a folder directly from our map
      const isFolder = fileTypeMap.get(currentPath) ?? false;

      // Create new file/folder node
      const fileNode: ProjectFile = {
        id: uuidv4(),
        name: part,
        isFolder: isFolder,
        path: absPath,
        children: [],
      };

      // If it's a file (not a folder and is the last part), set language
      if (!isFolder && isLast) {
        fileNode.language = getLanguageFromExtension(part);
      }

      // Add to parent's children
      current.children.push(fileNode);
      existing = fileNode;
    }

    // Move to the next level in the tree
    current = existing;
  }
}
