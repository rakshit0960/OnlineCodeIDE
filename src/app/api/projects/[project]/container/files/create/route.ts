import { prisma } from "@/lib/prisma";
import { executeContainerCommand } from "@/utils/dockerUtils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createFileSchema = z.object({
  path: z.string().min(1),
  content: z.string().optional(),
  isDirectory: z.boolean().default(false),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { project: string } }
) {
  try {
    const projectId = params.project;

    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createFileSchema.parse(body);

    // Get container
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

    // Create file or directory
    if (validatedData.isDirectory) {
      // Create directory
      await executeContainerCommand(container.containerId, `mkdir -p ${validatedData.path}`);
    } else {
      await executeContainerCommand(container.containerId, `echo '${validatedData.content || ""}' > ${validatedData.path}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating file/folder:", error);
    return NextResponse.json(
      { error: "Failed to create file/folder" },
      { status: 500 }
    );
  }
}