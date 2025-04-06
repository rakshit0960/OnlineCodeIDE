import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import docker from "@/lib/docker";
import { executeCommandInPersistentShell, executeContainerCommand } from "@/utils/dockerUtils";
export async function GET(res: NextResponse, context: { params: { project: string } }) {
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

  const newContainer = await docker.createContainer({
    Image: 'ubuntu:latest',
    OpenStdin: true,
    Tty: false,
  });

  await newContainer.start();

  // create a app directory in the container
  const { stdout, stderr } = await executeContainerCommand(
    newContainer.id,
    "mkdir -p /app"
  );

  if (stderr) {
    return NextResponse.json({ error: stderr }, { status: 500 });
  }

  console.log(stdout);

  const newContainerData = await prisma.container.create({
    data: {
      projectId: projectId,
      containerId: newContainer.id,
      name: "Container",
    },
  });

  return NextResponse.json({ container: newContainerData }, { status: 200 });
}