#!/usr/bin/env node

'use strict'
const analyseCoverage = require('../lib/analyseCoverage')
const errorConsole = require('../lib/errorConsole')
const nodeWithCoverage = require('../lib/nodeWithCoverage')
const reportCoverage = require('../lib/reportCoverage')
const tempDirOperation = require('../lib/tempDirOperation')

const [, , ...nodeArgs] = process.argv

/**
 * Powers the `coverage-node` CLI. Runs Node.js with the given arguments and
 * coverage enabled. An analysis of the coverage is reported to the console, and
 * if coverage isn’t complete the process exits with code `1`.
 * @kind function
 * @name coverageNode
 * @returns {Promise} Resolves when all work is complete.
 * @ignore
 */
async function coverageNode() {
  try {
    if (!nodeArgs.length) throw new Error('Node.js CLI arguments are required.')

    await tempDirOperation(async tempDirPath => {
      const exitCode = await nodeWithCoverage(tempDirPath, nodeArgs)

      // Only show a code coverage report if the Node.js script didn’t error,
      // to reduce distraction from the priority to solve errors.
      if (exitCode === 0) {
        const analysis = await analyseCoverage(tempDirPath)
        reportCoverage(analysis)
        if (analysis.uncovered.length) process.exitCode = 1
      }

      // The error exit code of the spawned subprocess must be manually applied
      // to this parent process.
      else process.exitCode = exitCode
    })
  } catch (error) {
    errorConsole.group('Error running Node.js with coverage:')
    errorConsole.error(error)
    errorConsole.groupEnd()
    process.exitCode = 1
  }
}

coverageNode()
