import { auth } from "@/auth";
import docker from "@/lib/docker";
import { prisma } from "@/lib/prisma";
import { executeContainerCommand } from "@/utils/dockerUtils";
import { handleApiError } from "@/utils/errorUtils";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse, context: { params: { project: string } }) {
  try {
    const session = await auth();

    const params = await context.params;
    const projectId = params.project;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting container");

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const container = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    if (container) {
      // for now, return the container
      return NextResponse.json({ container: container }, { status: 200 });
      // but in the future, return an error if the container already exists
      // return NextResponse.json({ error: "Container already exists" }, { status: 400 });
    }

    // Select image based on project language
    let image = 'ubuntu:latest';
    let setupCommands = [];
    let mainFile = '';

    switch (project.language) {
      case "PYTHON":
        image = 'python:3.9-slim';
        mainFile = '/app/main.py';
        setupCommands = [
          "mkdir -p /app",
          "echo '# Write your Python code here' > /app/main.py"
        ];
        break;
      case "C":
        image = 'gcc:latest';
        mainFile = '/app/main.c';
        setupCommands = [
          "mkdir -p /app",
          "echo '// Write your C code here\\n\\n#include <stdio.h>\\n\\nint main() {\\n    printf(\"Hello, World!\\n\");\\n    return 0;\\n}' > /app/main.c"
        ];
        break;
      default:
        // Default setup for unknown languages
        setupCommands = [
          "mkdir -p /app",
          "echo '# Write your code here' > /app/main.txt"
        ];
        mainFile = '/app/main.txt';
    }

    await docker.pull(image);
    
    const newContainer = await docker.createContainer({
      Image: image,
      OpenStdin: true,
      Tty: false,
    });

    await newContainer.start();

    // Execute setup commands
    for (const cmd of setupCommands) {
      const { stdout, stderr } = await executeContainerCommand(
        newContainer.id,
        cmd
      );

      if (stderr && !stderr.includes("WARNING")) {
        await newContainer.remove({ force: true });
        return NextResponse.json({ error: stderr }, { status: 500 });
      }

      console.log(stdout);
    }

    const newContainerData = await prisma.container.create({
      data: {
        projectId: projectId,
        containerId: newContainer.id,
        name: `${project.language || 'Default'} Container`,
      },
    });

    return NextResponse.json({
      container: newContainerData,
      mainFile: mainFile
    }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}