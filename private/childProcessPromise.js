'use strict';

const { ChildProcess } = require('child_process');

/**
 * Promisifies a Node.js child process.
 * @kind function
 * @name childProcessPromise
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<{exitCode: number, signal: string}>} Resolves the exit code if the child exited on its own, or the signal by which the child process was terminated.
 * @ignore
 */
module.exports = async function childProcessPromise(childProcess) {
  if (!(childProcess instanceof ChildProcess))
    throw new TypeError(
      'First argument `childProcess` must be a `ChildProcess` instance.'
    );

  return new Promise((resolve, reject) => {
    childProcess.once('error', reject);
    childProcess.once('close', (exitCode, signal) =>
      resolve({ exitCode, signal })
    );
  });
};
