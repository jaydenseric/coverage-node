#!/usr/bin/env node

import { spawn } from 'child_process';
import { disposableDirectory } from 'disposable-directory';
import kleur from 'kleur';
import CliError from '../private/CliError.mjs';
import childProcessPromise from '../private/childProcessPromise.mjs';
import reportCliError from '../private/reportCliError.mjs';
import analyseCoverage from '../public/analyseCoverage.mjs';
import coverageSupported from '../public/coverageSupported.mjs';
import minNodeVersion from '../public/coverageSupportedMinNodeVersion.mjs';
import reportCoverage from '../public/reportCoverage.mjs';

/**
 * Powers the `coverage-node` CLI. Runs Node.js with the given arguments and
 * coverage enabled. An analysis of the coverage is reported to the console, and
 * if coverage isn’t complete the process exits with code `1`.
 * @kind function
 * @name coverageNode
 * @returns {Promise<void>} Resolves when all work is complete.
 * @ignore
 */
async function coverageNode() {
  try {
    const [, , ...nodeArgs] = process.argv;

    if (!nodeArgs.length)
      throw new CliError('Node.js CLI arguments are required.');

    // eslint-disable-next-line curly
    if (coverageSupported) {
      await disposableDirectory(async (tempDirPath) => {
        const { exitCode } = await childProcessPromise(
          spawn('node', nodeArgs, {
            stdio: 'inherit',
            env: { ...process.env, NODE_V8_COVERAGE: tempDirPath },
          })
        );

        // Only show a code coverage report if the Node.js script didn’t error,
        // to reduce distraction from the priority to solve errors.
        if (exitCode === 0) {
          const analysis = await analyseCoverage(tempDirPath);
          reportCoverage(analysis);
          if (analysis.uncovered.length) process.exitCode = 1;
        } else process.exitCode = exitCode;
      });
      // coverage ignore next line
    } else {
      const { exitCode } = await childProcessPromise(
        spawn('node', nodeArgs, { stdio: 'inherit' })
      );

      if (exitCode === 0)
        console.info(
          `\n${kleur.yellow(
            `Skipped code coverage as Node.js is ${process.version}, v${minNodeVersion.major}.${minNodeVersion.minor}.${minNodeVersion.patch}+ is supported.`
          )}\n`
        );
      else process.exitCode = exitCode;
    }
  } catch (error) {
    reportCliError(
      `Node.js${
        // coverage ignore next line
        coverageSupported ? ' with coverage' : ''
      }`,
      error
    );

    process.exitCode = 1;
  }
}

coverageNode();
