import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { executeContainerCommand } from "@/utils/dockerUtils";
import { handleApiError } from "@/utils/errorUtils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schema for request validation
const runCodeSchema = z.object({
  code: z.string(),
  input: z.string().optional(),
  filePath: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: { project: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const projectId = context.params.project;

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const result = runCodeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const { code, input, filePath } = result.data;

    // Get project and container details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { container: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.container) {
      return NextResponse.json(
        { error: "Container not found" },
        { status: 404 }
      );
    }

    // Prepare command based on language
    let command: string;
    let targetFilePath: string;

    switch (project.language) {
      case "PYTHON":
        targetFilePath = filePath || "/app/main.py";
        if (!targetFilePath.endsWith(".py")) {
          targetFilePath = targetFilePath + ".py";
        }
        // Create the file and run it in one command
        command = `echo '${code.replace(/'/g, "'\\''")}' > ${targetFilePath} && python ${targetFilePath}`;
        if (input) {
          command += ` <<< '${input.replace(/'/g, "'\\''")}'`;
        }
        break;
      case "C":
        targetFilePath = filePath || "/app/main.c";
        if (!targetFilePath.endsWith(".c")) {
          targetFilePath = targetFilePath + ".c";
        }
        // Create, compile and run in one command
        command = `echo '${code.replace(/'/g, "'\\''")}' > ${targetFilePath} && gcc ${targetFilePath} -o main && ./main`;
        if (input) {
          command += ` <<< '${input.replace(/'/g, "'\\''")}'`;
        }
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported language" },
          { status: 400 }
        );
    }
    // Execute the command
    const { stdout, stderr } = await executeContainerCommand(
      project.container.containerId,
      command
    );

    return NextResponse.json({ stdout, stderr }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}