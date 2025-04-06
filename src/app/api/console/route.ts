import docker from "@/lib/docker";
import { validateRequest } from "@/lib/validations";
import { handleApiError } from "@/utils/errorUtils";
import { Container } from "dockerode";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


/**
 * Schema for validating command execution requests
 * Used for validating the POST /api/console request body
 */
const CommandSchema = z.object({
  command: z.string().min(1, "Command must not be empty"),
});

/**
 * POST handler for executing shell commands
 *
 * @route POST /api/console
 * @param {NextRequest} req - The incoming request object
 * @returns {NextResponse} JSON response with command output or error
 */
export async function POST(req: NextRequest) {
  let container: Container | null = null;
  try {
    // Parse and validate request body
    const body = await req.json();
    console.log("body", body);


    const validation = await validateRequest(CommandSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    // Retrieve the Ubuntu container (replace 'ubuntu_container_name' with your container's name or ID)
    container = await docker.createContainer({
      Image: 'ubuntu:latest',
      OpenStdin: true,
      Tty: false,
    });

    await container.start();

    // Create an exec instance
    const exec = await container.exec({
      Cmd: ["bash", "-c", validation.data.command],
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

    // Start the exec instance and collect the output
    const stream = await exec.start({});

    let stdout = '';
    let stderr = '';


    await new Promise((resolve, reject) => {
      if (!container) {
        throw new Error("Container not found");
      }
      container.modem.demuxStream(stream, {
        write: (chunk: Buffer) => {
          stdout += chunk.toString();
        },
      }, {
        write: (chunk: Buffer) => {
          stderr += chunk.toString();
        },
      });

      stream.on('end', resolve);
      stream.on('error', reject);
    });

    console.log('stdout', stdout);
    console.log('stderr', stderr);

    return NextResponse.json({ stdout, stderr });


  } catch (error) {
    return handleApiError(error);

  } finally {
    if (container !== null) {
      await container.stop();
      await container.remove();
    }
  }
}


export async function GET() {
  try {
    const containers = await docker.listContainers();
    const images = await docker.listImages();
    return NextResponse.json({ containers, images: images.map((image) => image.RepoTags?.[0]) });
  } catch (error) {
    return handleApiError(error);
  }
}
