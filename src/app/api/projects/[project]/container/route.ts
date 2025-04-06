import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET handler Check if a Docker container is already running for the given project
 *
 * @route GET /api/project
 * @returns {NextResponse} JSON response with project container or error
 */
export async function GET(res: NextResponse, context: { params: { project: string } }) {
  const session = await auth();

  const params = await context.params;
  const projectId = params.project;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: {
      container: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project.container);
}
