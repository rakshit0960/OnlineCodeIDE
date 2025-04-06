import { exec } from "child_process";

/**
 * Executes a command and returns a promise that resolves with the stdout
 * @param command The command to execute
 * @returns A promise that resolves with the stdout or rejects with an error
 */
export function execPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Execute the command and handle the result
    exec(command, (error, stdout, stderr) => {
      // Reject on error or stderr output
      if (error) reject(error);
      if (stderr) reject(stderr);

      // Resolve with stdout on success
      resolve(stdout);
    });
  });
}