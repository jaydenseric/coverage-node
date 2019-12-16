'use strict'

const { spawn } = require('child_process')

module.exports =
  /**
   * Runs Node.js with code coverage enabled via the
   * [`NODE_V8_COVERAGE`](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir)
   * environment variable.
   * @kind function
   * @name nodeWithCoverage
   * @param {string} coverageDirPath Directory path to store code coverage data.
   * @param {Array<string>} args Node.js CLI arguments.
   * @param {string} [command='node'] Node.js CLI command to run with the arguments.
   * @returns {Promise<number>} Resolves the [Node.js exit code](https://nodejs.org/api/process.html#process_exit_codes).
   * @example <caption>How to import.</caption>
   * ```js
   * const { nodeWithCoverage } = require('coverage-node')
   * ```
   */
  function nodeWithCoverage(coverageDirPath, args, command = 'node') {
    return new Promise((resolve, reject) => {
      // Run tests, generating coverage data in the temp dir.
      const subprocess = spawn(command, args, {
        // Ensure input and output is shared with the parent process.
        stdio: 'inherit',
        env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath }
      })

      subprocess.on('error', ({ message }) => {
        reject(`Error spawning Node.js: ${message}`)
      })

      // Resolve the test’s exit code.
      subprocess.on('close', resolve)
    })
  }
