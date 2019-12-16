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
const fsPathExistsTests = require('./fsPathExists.test')
const analyseCoverageTests = require('./lib/analyseCoverage.test')
const createTempDirTests = require('./lib/createTempDir.test')
const fsPathRemoveTests = require('./lib/fsPathRemove.test')
const nodeWithCoverageTests = require('./lib/nodeWithCoverage.test')
const sourceRangeTests = require('./lib/sourceRange.test')
const tempDirOperationTests = require('./lib/tempDirOperation.test')

const tests = new TestDirector()

fsPathExistsTests(tests)
fsPathRemoveTests(tests)
createTempDirTests(tests)
tempDirOperationTests(tests)
nodeWithCoverageTests(tests)
sourceRangeTests(tests)
analyseCoverageTests(tests)
coverageNodeTests(tests)

tests.run()
