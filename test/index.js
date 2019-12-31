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

const tests = new TestDirector()

require('./cli/coverage-node.test')(tests)
require('./lib/analyseCoverage.test')(tests)
require('./lib/semver.test')(tests)
require('./lib/sourceRange.test')(tests)

tests.run()
