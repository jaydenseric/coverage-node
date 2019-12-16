'use strict'

const assert = require('assert')
const fs = require('fs')
const { join } = require('path')
const analyseCoverage = require('../../lib/analyseCoverage')
const nodeWithCoverage = require('../../lib/nodeWithCoverage')
const tempDirOperation = require('../../lib/tempDirOperation')

module.exports = tests => {
  tests.add(
    '`analyseCoverage` ignores `node_modules` directory files.',
    async () => {
      await tempDirOperation(async tempDirPath => {
        const coverageDirPath = join(tempDirPath, 'coverage')
        const nodeModulesDirPath = join(tempDirPath, 'node_modules')
        const nodeModulesModuleName = 'a'
        const nodeModulesModuleMainFileName = 'index.js'
        const nodeModulesModuleMainFilePath = join(
          nodeModulesDirPath,
          nodeModulesModuleName,
          nodeModulesModuleMainFileName
        )

        await fs.promises.mkdir(nodeModulesDirPath)
        await fs.promises.mkdir(join(nodeModulesDirPath, nodeModulesModuleName))
        await fs.promises.writeFile(
          nodeModulesModuleMainFilePath,
          "'use strict'"
        )

        await nodeWithCoverage(coverageDirPath, [nodeModulesModuleMainFilePath])

        assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
          covered: [],
          ignored: [],
          uncovered: []
        })
      })
    }
  )

  tests.add('`analyseCoverage` ignores `test` directory files.', async () => {
    await tempDirOperation(async tempDirPath => {
      const coverageDirPath = join(tempDirPath, 'coverage')
      const dirPath = join(tempDirPath, 'test')
      const filePath = join(dirPath, 'index.js')

      await fs.promises.mkdir(dirPath)
      await fs.promises.writeFile(filePath, "'use strict'")

      await nodeWithCoverage(coverageDirPath, [filePath])

      assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
        covered: [],
        ignored: [],
        uncovered: []
      })
    })
  })

  tests.add(
    '`analyseCoverage` ignores files with `.test` prefixed before the extension.',
    async () => {
      await tempDirOperation(async tempDirPath => {
        const coverageDirPath = join(tempDirPath, 'coverage')
        const filePath = join(tempDirPath, 'index.test.js')

        await fs.promises.writeFile(filePath, "'use strict'")

        await nodeWithCoverage(coverageDirPath, [filePath])

        assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
          covered: [],
          ignored: [],
          uncovered: []
        })
      })
    }
  )

  tests.add('`analyseCoverage` ignores files named `test`.', async () => {
    await tempDirOperation(async tempDirPath => {
      const coverageDirPath = join(tempDirPath, 'coverage')
      const filePath = join(tempDirPath, 'test.js')

      await fs.promises.writeFile(filePath, "'use strict'")

      await nodeWithCoverage(coverageDirPath, [filePath])

      assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
        covered: [],
        ignored: [],
        uncovered: []
      })
    })
  })

  tests.add('`analyseCoverage` with 1 covered file.', async () => {
    await tempDirOperation(async tempDirPath => {
      const coverageDirPath = join(tempDirPath, 'coverage')
      const filePath = join(tempDirPath, 'index.js')

      await fs.promises.writeFile(filePath, "'use strict'")

      await nodeWithCoverage(coverageDirPath, [filePath])

      assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
        covered: [filePath],
        ignored: [],
        uncovered: []
      })
    })
  })

  tests.add('`analyseCoverage` with 1 uncovered file.', async () => {
    await tempDirOperation(async tempDirPath => {
      const coverageDirPath = join(tempDirPath, 'coverage')
      const filePath = join(tempDirPath, 'index.js')

      await fs.promises.writeFile(filePath, 'function a() {}; function b() {}')

      await nodeWithCoverage(coverageDirPath, [filePath])

      assert.deepStrictEqual(await analyseCoverage(coverageDirPath), {
        covered: [],
        ignored: [],
        uncovered: [
          {
            path: filePath,
            ranges: [
              {
                start: {
                  offset: 0,
                  line: 1,
                  column: 1
                },
                end: {
                  offset: 14,
                  line: 1,
                  column: 15
                }
              },
              {
                start: {
                  offset: 17,
                  line: 1,
                  column: 18
                },
                end: {
                  offset: 31,
                  line: 1,
                  column: 32
                }
              }
            ]
          }
        ]
      })
    })
  })
}
