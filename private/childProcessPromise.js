'use strict';

/**
 * Promisifies a Node.js child process.
 * @kind function
 * @name childProcessPromise
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<{exitCode: number, signal: string}>} Resolves the exit code if the child exited on its own, or the signal by which the child process was terminated.
 * @ignore
 */
module.exports = function childProcessPromise(childProcess) {
  return new Promise((resolve, reject) => {
    childProcess.once('error', reject);
    childProcess.once('close', (exitCode, signal) =>
      resolve({ exitCode, signal })
    );
  });
};
