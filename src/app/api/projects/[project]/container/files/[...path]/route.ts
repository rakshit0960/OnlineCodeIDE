/**
 * This file provides API endpoints for managing files within a container for a project.
 * It includes functionality to read, update, and create files.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { executeContainerCommand } from "@/utils/dockerUtils";
import { handleApiError } from "@/utils/errorUtils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schemas for request validation
const fileContentSchema = z.object({
  content: z.string()
});

const optionalFileContentSchema = z.object({
  content: z.string().optional().default("")
});

/**
 * GET endpoint to retrieve file content from a container
 * @param req - The incoming request
 * @param context - Contains route parameters including project ID and file path
 * @returns JSON response with file content or error
 */
export async function GET(
  req: NextRequest,
  context: { params: { project: string; path: string[] } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const params = await context.params;
    const projectId = params.project;
    const pathParts = params.path;

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure path is provided
    if (!pathParts || pathParts.length === 0) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Construct the file path
    const filePath = "/" + pathParts.join("/");

    // Get container for the project
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

    // Check if path is a directory
    const { stdout: checkResult } = await executeContainerCommand(
      container.containerId,
      `test -d "${filePath}" && echo "isDirectory" || echo "isFile"`
    );

    // Return error if path is a directory
    if (checkResult.trim() === "isDirectory") {
      return NextResponse.json(
        { error: "Cannot read directory content with this endpoint" },
        { status: 400 }
      );
    }

    // Get the file content using cat command
    const { stdout, stderr } = await executeContainerCommand(
      container.containerId,
      `cat ${filePath}`
    );

    // Handle errors from the cat command
    if (stderr && stderr.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to read file: ${stderr}` },
        { status: 500 }
      );
    }

    // Return the file content
    return NextResponse.json({ content: stdout }, { status: 200 });
  } catch (error) {
    // Handle and format any errors
    return handleApiError(error);
  }
}

/**
 * PUT endpoint to update file content in a container
 * @param req - The incoming request with file content
 * @param context - Contains route parameters including project ID and file path
 * @returns JSON response indicating success or error
 */
export async function PUT(
  req: NextRequest,
  context: { params: { project: string; path: string[] } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const params = await context.params;
    const projectId = params.project;
    const pathParts = params.path;

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure path is provided
    if (!pathParts || pathParts.length === 0) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Parse request body to get content
    const body = await req.json();
    const contentResult = fileContentSchema.safeParse(body);

    if (!contentResult.success) {
      return NextResponse.json(
        { error: contentResult.error.message },
        { status: 400 }
      );
    }

    const { content } = contentResult.data;

    // Construct the file path
    const filePath = "/" + pathParts.join("/");

    // Get container for the project
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

    // Create a temporary file with the content within the container
    // This method handles escaping special characters properly
    const tempFilePath = `/tmp/file_${Date.now()}`;

    // Create the temporary file with the content
    const { stderr: createError } = await executeContainerCommand(
      container.containerId,
      `cat > ${tempFilePath} << 'EOL'\n${content}\nEOL`
    );

    // Handle errors from creating the temporary file
    if (createError && createError.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to create temporary file: ${createError}` },
        { status: 500 }
      );
    }

    // Move the temporary file to the target location
    const { stderr: moveError } = await executeContainerCommand(
      container.containerId,
      `mv ${tempFilePath} ${filePath}`
    );

    // Handle errors from moving the file
    if (moveError && moveError.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to save file: ${moveError}` },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Handle and format any errors
    return handleApiError(error);
  }
}

/**
 * POST endpoint to create a new file in a container
 * @param req - The incoming request with optional file content
 * @param context - Contains route parameters including project ID and file path
 * @returns JSON response indicating success or error
 */
export async function POST(
  req: NextRequest,
  context: { params: { project: string; path: string[] } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const params = await context.params;
    const projectId = params.project;
    const pathParts = params.path;

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure path is provided
    if (!pathParts || pathParts.length === 0) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Parse request body to get content
    const body = await req.json();
    const contentResult = optionalFileContentSchema.safeParse(body);

    if (!contentResult.success) {
      return NextResponse.json(
        { error: contentResult.error.message },
        { status: 400 }
      );
    }

    const { content } = contentResult.data;

    // Construct the file path
    const filePath = "/" + pathParts.join("/");

    // Get container for the project
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

    // Check if file already exists
    const { stdout: checkResult, stderr: checkError } = await executeContainerCommand(
      container.containerId,
      `test -e "${filePath}" && echo "exists" || echo "not_exists"`
    );

    // Handle errors from checking if file exists
    if (checkError && checkError.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to check if file exists: ${checkError}` },
        { status: 500 }
      );
    }

    // Return error if file already exists
    if (checkResult.trim() === "exists") {
      return NextResponse.json(
        { error: "File already exists" },
        { status: 409 }
      );
    }

    // Create directory structure if needed
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (dirPath) {
      const { stderr: mkdirError } = await executeContainerCommand(
        container.containerId,
        `mkdir -p "${dirPath}"`
      );

      // Handle errors from creating directory structure
      if (mkdirError && mkdirError.trim() !== "") {
        return NextResponse.json(
          { error: `Failed to create directory structure: ${mkdirError}` },
          { status: 500 }
        );
      }
    }

    // Create a temporary file with the content within the container
    const tempFilePath = `/tmp/file_${Date.now()}`;

    // Create the temporary file with the content
    const { stderr: createError } = await executeContainerCommand(
      container.containerId,
      `cat > ${tempFilePath} << 'EOL'\n${content}\nEOL`
    );

    // Handle errors from creating the temporary file
    if (createError && createError.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to create temporary file: ${createError}` },
        { status: 500 }
      );
    }

    // Move the temporary file to the target location
    const { stderr: moveError } = await executeContainerCommand(
      container.containerId,
      `mv ${tempFilePath} ${filePath}`
    );

    // Handle errors from moving the file
    if (moveError && moveError.trim() !== "") {
      return NextResponse.json(
        { error: `Failed to create file: ${moveError}` },
        { status: 500 }
      );
    }

    // Return success response with the created file path
    return NextResponse.json({ success: true, path: filePath }, { status: 201 });
  } catch (error) {
    // Handle and format any errors
    return handleApiError(error);
  }
}