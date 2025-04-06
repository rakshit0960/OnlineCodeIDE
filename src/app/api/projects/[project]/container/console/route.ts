import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { closeShellSession, executeContainerCommand } from "@/utils/dockerUtils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating command execution requests
const CommandSchema = z.object({
  command: z.string().min(1, "Command must not be empty"),
});


/**
 * POST handler for executing commands in a container's persistent shell
 *
 * @route POST /api/projects/[project]/container/console
 * @param {NextRequest} req - The request object containing the command to execute
 * @param {Object} context - The context object containing the project ID
 * @returns {NextResponse} JSON response with command output or error
 */
export async function POST(req: NextRequest, context: { params: { project: string } }) {
  const session = await auth();

  const params = await context.params;
  const projectId = params.project;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = CommandSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    const container = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }

    // Execute the command in the container
    const { stdout, stderr } = await executeContainerCommand(
      container.containerId,
      validation.data.command
    );

    return NextResponse.json({ stdout, stderr });
  } catch (error) {
    console.error("Error executing command:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}


/**
 * DELETE handler for closing a container's shell session
 *
 * @route DELETE /api/projects/[project]/container/console
 * @param {NextRequest} req - The request object
 * @param {Object} context - The context object containing the project ID
 * @returns {NextResponse} JSON response with success message or error
 */
export async function DELETE(req: NextRequest, context: { params: { project: string } }) {
  const session = await auth();

  const params = await context.params;
  const projectId = params.project;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const container = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }

    await closeShellSession(container.containerId);
    return NextResponse.json({ message: "Shell session closed" }, { status: 200 });
  } catch (error) {
    console.error("Error closing shell session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
