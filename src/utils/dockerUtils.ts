import docker from "@/lib/docker";
import { Exec } from "dockerode";
import { Duplex } from "stream";
import { prisma } from "@/lib/prisma";

interface ShellSession {
  exec: Exec;
  stream: Duplex;
  stdout: string;
  stderr: string;
}

const activeSessions: Record<string, ShellSession> = {};

/**
 * Gets a container instance by project ID
 *
 * @param projectId The ID of the project
 * @returns The container details or null if not found
 */
export async function getContainerByProject(projectId: string) {
  try {
    // Find the container in the database by project ID
    const containerData = await prisma.container.findUnique({
      where: {
        projectId: projectId,
      },
    });

    if (!containerData) {
      console.error(`No container found for project: ${projectId}`);
      return null;
    }

    return containerData;
  } catch (error) {
    console.error(`Error getting container for project ${projectId}:`, error);
    return null;
  }
}

/**
 * Executes a command in a container and returns the output
 *
 * @param containerId The ID of the Docker container
 * @param command The command to execute
 * @returns Object containing stdout and stderr output
 */
export async function executeContainerCommand(
  containerId: string,
  command: string
): Promise<{ stdout: string; stderr: string }> {
  try {
    const containerInstance = docker.getContainer(containerId);

    // Create an exec instance
    const exec = await containerInstance.exec({
      Cmd: ['bash', '-c', command],
      AttachStdout: true,
      AttachStderr: true,
    });

    // Start the exec instance
    const stream = await exec.start({ hijack: true, stdin: false });

    // Collect the output
    let stdout = '';
    let stderr = '';

    await new Promise<void>((resolve, reject) => {
      containerInstance.modem.demuxStream(stream, {
        write: (chunk: Buffer) => {
          stdout += chunk.toString();
        }
      }, {
        write: (chunk: Buffer) => {
          stderr += chunk.toString();
        }
      });

      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return { stdout, stderr };
  } catch (error) {
    console.error(`Error executing command in container ${containerId}:`, error);
    throw error;
  }
}

/**
 * Get information about files and directories in a container path using printf format
 *
 * @param containerId The ID of the Docker container
 * @param dirPath The directory path to list
 * @returns Map of paths to boolean (true if directory, false if file)
 */
export async function getContainerFileTypes(
  containerId: string,
  dirPath: string = "/app"
): Promise<Map<string, boolean>> {
  try {
    // Use find with -printf to get detailed file type info
    // %y outputs the file type ('d' for directory, 'f' for regular file)
    // %p outputs the file path
    const { stdout, stderr } = await executeContainerCommand(
      containerId,
      `find ${dirPath} -printf "%y|%p\\n"`
    );

    if (stderr && stderr.trim() !== "") {
      console.error("Error getting file types:", stderr);
    }

    // Create a map of paths to isFolder values
    const fileTypeMap = new Map<string, boolean>();

    // Process each line of the output
    const lines = stdout.split("\n").filter(Boolean);
    for (const line of lines) {
      const [typeChar, path] = line.split('|', 2);
      if (typeChar && path) {
        // 'd' means it's a directory
        const isDirectory = typeChar.trim() === 'd';
        fileTypeMap.set(path, isDirectory);
      }
    }

    return fileTypeMap;
  } catch (error) {
    console.error("Error getting container file types:", error);
    return new Map();
  }
}

/**
 * Initializes a persistent shell in a Docker container.
 *
 * @param containerId The ID of the Docker container
 * @returns The exec instance that keeps the shell open
 */
export async function createPersistentShell(containerId: string): Promise<ShellSession> {
  if (activeSessions[containerId]) {
    return activeSessions[containerId];
  }

  const containerInstance = docker.getContainer(containerId);

  // Create a shell session
  const exec = await containerInstance.exec({
    Cmd: ["bash", "-c"],
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
  });

  const stream = await exec.start({ stdin: true });

  activeSessions[containerId] = { exec, stream, stdout: '', stderr: '' };
  return activeSessions[containerId];
}

/**
 * Executes a command in the persistent shell session
 *
 * @param containerId The ID of the Docker container
 * @param command The command to execute
 */
export async function executeCommandInPersistentShell(
  containerId: string,
  command: string
): Promise<{ stdout: string; stderr: string }> {
  if (activeSessions[containerId]) {
    return activeSessions[containerId];
  }

  const containerInstance = docker.getContainer(containerId);

  // Create a shell session
  const exec = await containerInstance.exec({
    Cmd: ["bash"],
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
    Tty: true,
  });

  const stream = await exec.start({ hijack: true, stdin: true });

  // Write the command to stdin of the shell
  stream.write("bash -c " + command + "\n", "utf-8", () => {
    console.log("command written");
  });

  console.log("command", command);

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    if (!containerInstance) {
      throw new Error("Container not found");
    }
    containerInstance.modem.demuxStream(stream, {
      write: (chunk: Buffer) => {
        stdout += chunk.toString();
        console.log("stdout data chunk", stdout);
        resolve({ stdout, stderr });
      },
    }, {
      write: (chunk: Buffer) => {
        stderr += chunk.toString();
        console.log("stderr data chunk", stderr);
        resolve({ stdout, stderr });
      },
    });

    stream.on('end', () => {
      resolve({ stdout, stderr });
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Closes the shell session
 */
export async function closeShellSession(containerId: string) {
  if (activeSessions[containerId]) {
    activeSessions[containerId].stream.end();
    delete activeSessions[containerId];
  }
}
