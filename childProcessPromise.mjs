// @ts-check

import { ChildProcess } from "node:child_process";

/**
 * Promisifies a Node.js child process.
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<{
 *   exitCode: number | null,
 *   signal: NodeJS.Signals | null
 * }>} Resolves the exit code if the child exited on its own, or the signal by
 *   which the child process was terminated.
 */
export default async function childProcessPromise(childProcess) {
  if (!(childProcess instanceof ChildProcess))
    throw new TypeError(
      "Argument 1 `childProcess` must be a `ChildProcess` instance."
    );

  return new Promise((resolve, reject) => {
    childProcess.once("error", reject);
    childProcess.once("close", (exitCode, signal) =>
      resolve({ exitCode, signal })
    );
  });
}
