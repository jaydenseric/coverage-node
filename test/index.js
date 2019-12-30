'use strict'

process
  .on('uncaughtException', error => {
    console.error('Uncaught exception:', error)
    process.exitCode = 1
  })
  .on('unhandledRejection', error => {
    console.error('Unhandled rejection:', error)
    process.exitCode = 1
  })

const { TestDirector } = require('test-director')
const coverageNodeTests = require('./cli/coverage-node.test')
const analyseCoverageTests = require('./lib/analyseCoverage.test')
const semverTests = require('./lib/semver.test')
const sourceRangeTests = require('./lib/sourceRange.test')

const tests = new TestDirector()

semverTests(tests)
sourceRangeTests(tests)
analyseCoverageTests(tests)
coverageNodeTests(tests)

tests.run()
