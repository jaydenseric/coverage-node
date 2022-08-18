#!/usr/bin/env node
// @ts-check

import disposableDirectory from "disposable-directory";
import { spawn } from "node:child_process";

import analyseCoverage from "./analyseCoverage.mjs";
import childProcessPromise from "./childProcessPromise.mjs";
import CliError from "./CliError.mjs";
import reportCliError from "./reportCliError.mjs";
import reportCoverage from "./reportCoverage.mjs";

/**
 * Powers the `coverage-node` CLI. Runs Node.js with the given arguments and
 * coverage enabled. An analysis of the coverage is reported to the console, and
 * if coverage is incomplete and there isn’t a truthy `ALLOW_MISSING_COVERAGE`
 * environment variable the process exits with code `1`.
 * @returns {Promise<void>} Resolves when all work is complete.
 */
async function coverageNode() {
  try {
    const [, , ...nodeArgs] = process.argv;

    if (!nodeArgs.length)
      throw new CliError("Node.js CLI arguments are required.");

    await disposableDirectory(async (tempDirPath) => {
      const { exitCode } = await childProcessPromise(
        spawn("node", nodeArgs, {
          stdio: "inherit",
          env: { ...process.env, NODE_V8_COVERAGE: tempDirPath },
        })
      );

      // Only show a code coverage report if the Node.js script didn’t error,
      // to reduce distraction from the priority to solve errors.
      if (exitCode === 0) {
        const analysis = await analyseCoverage(tempDirPath);
        reportCoverage(analysis);
        if (analysis.uncovered.length && !process.env.ALLOW_MISSING_COVERAGE)
          process.exitCode = 1;
      } else if (exitCode !== null) process.exitCode = exitCode;
    });
  } catch (error) {
    reportCliError("Node.js with coverage", error);

    process.exitCode = 1;
  }
}

coverageNode();
