import docker from "@/lib/docker";
import { Exec } from "dockerode";
import { Duplex } from "stream";

interface ShellSession {
  exec: Exec;
  stream: Duplex;
  stdout: string;
  stderr: string;
}

const activeSessions: Record<string, ShellSession> = {};

/**
 * Initializes a persistent shell in a Docker container.
 *
 * @param containerId The ID of the Docker container
 * @return s The exec instance that keeps the shell open
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
 * @param     containerId The ID of the Docker container
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

  // return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
  //   let stdout = '';
  //   let stderr = '';

  //   // Attach listeners
  //   stream.on('data', (chunk: Buffer) => {
  //     stdout += chunk.toString();
  //     console.log("data chunk", chunk);
  //     console.log("stdout data chunk", stdout);
  //     resolve({ stdout, stderr });
  //   });

  //   stream.on('error', (chunk: Buffer) => {
  //     console.log("error chunk", chunk);
  //     console.log("stderr error chunk", stderr);
  //     stderr += chunk.toString();
  //     resolve({ stdout, stderr });
  //   });



  //   // Listen for the end of the stream to resolve the promise
  //   stream.on('end', () => {
  //     console.log("end");
  //     console.log("stdout", stdout);
  //     console.log("stderr", stderr);
  //     resolve({ stdout, stderr );
  //   });

  //   // Handle potential errors
  //   stream.on('error', (err) => {
  //     reject(err);
  //   });
  // });
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


/**
 * Executes a command in a Docker container
 *
 * @param containerId The ID of the Docker container
 * @param command The command to execute
 * @returns The output of the command
 */
export async function executeContainerCommand(containerId: string, command: string) {
  const container = await docker.getContainer(containerId);

  const exec = await container.exec({
    Cmd: ["bash", "-c", command],
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

  return { stdout, stderr };
}