import { ProjectFile } from "@/app/project/types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { executeContainerCommand } from "@/utils/dockerUtils";
import { handleApiError } from "@/utils/errorUtils";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
export const rootDir = "/app";

export async function GET(
  req: NextRequest,
  context: { params: { project: string } }
) {
  try {
    const session = await auth();

    const params = await context.params;
    const projectId = params.project;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get container for the project
    const container = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    if (!container) {
      return NextResponse.json(
        { error: "Container not found" },
        { status: 404 }
      );
    }

    // Get the file structure by executing find command in the container
    const { stdout, stderr } = await executeContainerCommand(container.containerId, "find /app");

    console.log(stdout);
    console.log(stderr);

    // Process the output to create a structured file system
    const fileList = stdout.split("\n").filter(Boolean);

    // Convert flat list to hierarchical structure
    const rootFile: ProjectFile = {
      id: uuidv4(),
      name: "app",
      isFolder: true,
      children: [],
    };

    for (const file of fileList) {
      insertFile(rootFile, file);
    }

    return NextResponse.json({ files: rootFile }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

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
    default:
      return undefined;
  }
}

function insertFile(root: ProjectFile, absPath: string) {
  const relativePath = path.relative(rootDir, absPath);
  if (relativePath === "") return;

  const parts = relativePath.split(path.sep);
  let current = root;
  let currentPath = rootDir;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath = path.join(currentPath, part);
    const isLast = i === parts.length - 1;

    let existing = current.children.find((c) => c.name === part);
    if (!existing) {
      const isDir =
        fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory();
      const fileNode: ProjectFile = {
        id: uuidv4(),
        name: part,
        isFolder: isDir,
        children: [],
      };

      if (!isDir && isLast) {
        fileNode.language = getLanguageFromExtension(part);
        try {
          fileNode.content = fs.readFileSync(currentPath, "utf-8");
        } catch {
          fileNode.content = "// failed to read content";
        }
      }

      current.children.push(fileNode);
      existing = fileNode;
    }

    current = existing;
  }
}
