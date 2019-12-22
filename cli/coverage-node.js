#!/usr/bin/env node

'use strict'

const { spawn } = require('child_process')
const kleur = require('kleur')
const analyseCoverage = require('../lib/analyseCoverage')
const childProcessPromise = require('../lib/childProcessPromise')
const coverageSupported = require('../lib/coverageSupported')
const minNodeVersion = require('../lib/coverageSupportedMinNodeVersion')
const errorConsole = require('../lib/errorConsole')
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

    // eslint-disable-next-line curly
    if (coverageSupported) {
      await tempDirOperation(async tempDirPath => {
        const { exitCode } = await childProcessPromise(
          spawn('node', nodeArgs, {
            stdio: 'inherit',
            env: { ...process.env, NODE_V8_COVERAGE: tempDirPath }
          })
        )

        // Only show a code coverage report if the Node.js script didn’t error,
        // to reduce distraction from the priority to solve errors.
        if (exitCode === 0) {
          const analysis = await analyseCoverage(tempDirPath)
          reportCoverage(analysis)
          if (analysis.uncovered.length) process.exitCode = 1
        } else process.exitCode = exitCode
      })
      // coverage ignore next line
    } else {
      const { exitCode } = await childProcessPromise(
        spawn('node', nodeArgs, { stdio: 'inherit' })
      )

      if (exitCode === 0)
        console.info(
          `\n${kleur.yellow(
            `Skipped code coverage as Node.js is ${process.version}, v${minNodeVersion.major}.${minNodeVersion.minor}.${minNodeVersion.patch}+ is supported.`
          )}\n`
        )
      else process.exitCode = exitCode
    }
  } catch (error) {
    errorConsole.group(
      // coverage ignore next line
      `Error running Node.js${coverageSupported ? '  with coverage' : ''}:`
    )
    errorConsole.error(error)
    errorConsole.groupEnd()
    process.exitCode = 1
  }
}

coverageNode()
