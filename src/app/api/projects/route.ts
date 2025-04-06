import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validations";
import { createProjectSchema } from "@/schemas/project";
import { handleApiError } from "@/utils/errorUtils";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for retrieving all projects for the authenticated user
 *
 * @route GET /api/project
 * @returns {NextResponse} JSON response with projects or error
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all projects for the authenticated user
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    // Handle and format any errors using the error utility
    return handleApiError(error);
  }
}

/**
 * POST handler for creating a new project
 *
 * @route POST /api/project
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} JSON response with created project or error
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    const body = await request.json();

    // Validate request data using schema validation utility
    const validation = await validateRequest(createProjectSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    const { name, description, language } = validation.data;

    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        name,
        description: description,
        language: language,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    // Handle and format any errors using the error utility
    return handleApiError(error);
  }
}
