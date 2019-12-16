'use strict'

const assert = require('assert')
const fs = require('fs')
const { join, resolve } = require('path')
const execFilePromise = require('../../lib/execFilePromise')
const tempDirOperation = require('../../lib/tempDirOperation')

module.exports = tests => {
  tests.add('`nodeWithCoverage` with a bad command.', async () => {
    await tempDirOperation(async tempDirPath => {
      const coverageDirPath = join(tempDirPath, 'coverage')
      const fileAPath = join(tempDirPath, 'a.js')

      // Using `.test.` so it won’t appear in the main coverage report.
      const fileBPath = join(tempDirPath, 'b.test.js')

      await fs.promises.writeFile(fileAPath, "'use strict'")
      await fs.promises.writeFile(
        fileBPath,
        `const nodeWithCoverage = require('${resolve(
          __dirname,
          '../../lib/nodeWithCoverage'
        )}');
nodeWithCoverage('${coverageDirPath}', ['${fileAPath}'], 'this-command-bad')
  .catch(console.error)`
      )

      const { stdout, stderr } = await execFilePromise('node', [fileBPath])

      assert.strictEqual(stdout, '')
      assert.strictEqual(
        stderr,
        'Error spawning Node.js: spawn this-command-bad ENOENT\n'
      )
    })
  })
}
