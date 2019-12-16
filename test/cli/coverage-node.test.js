'use strict'

const assert = require('assert')
const fs = require('fs')
const { join, relative } = require('path')
const execFilePromise = require('../../lib/execFilePromise')
const tempDirOperation = require('../../lib/tempDirOperation')
const stripStackTraces = require('../stripStackTraces')

module.exports = tests => {
  tests.add('`coverage-node` CLI with 1 covered file.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(filePath, "'use strict'")
      const { stdout, stderr } = await execFilePromise('node', [
        'cli/coverage-node',
        filePath
      ])

      assert.strictEqual(
        stdout.replace(relative('', filePath), '<path>'),
        '\n\u001b[32m1 file covered:\u001b[39m\n\n  <path>\n\n\u001b[1m\u001b[32m1/1 files covered.\u001b[22m\u001b[39m\n\n'
      )
      assert.strictEqual(stderr, '')
    })
  })

  tests.add('`coverage-node` CLI with 1 ignored file.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(
        filePath,
        `// coverage ignore next line
() => {}`
      )
      const { stdout, stderr } = await execFilePromise('node', [
        'cli/coverage-node',
        filePath
      ])

      assert.strictEqual(
        stdout.replace(relative('', filePath), '<path>'),
        '\n\u001b[33m1 file ignoring coverage:\u001b[39m\n\n  <path>:2:1 → 2:8\n\n\u001b[1m\u001b[33m0/1 files covered.\u001b[22m\u001b[39m\n\n'
      )
      assert.strictEqual(stderr, '')
    })
  })

  tests.add('`coverage-node` CLI with 1 uncovered file.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(filePath, '() => {}')

      let threw

      try {
        await execFilePromise('node', ['cli/coverage-node', filePath])
      } catch (error) {
        threw = true
        var { stdout, stderr } = error
      }

      assert.strictEqual(threw, true, 'CLI should error.')
      assert.strictEqual(
        stdout,
        '\n\u001b[1m\u001b[31m0/1 files covered.\u001b[22m\u001b[39m\n\n'
      )
      assert.strictEqual(
        stderr.replace(relative('', filePath), '<path>'),
        '\n\u001b[31m1 file missing coverage:\u001b[39m\n\n  <path>:1:1 → 1:8\n'
      )
    })
  })

  tests.add(
    '`coverage-node` CLI with 2 covered, ignored and uncovered files.',
    async () => {
      await tempDirOperation(async tempDirPath => {
        const fileAPath = join(tempDirPath, 'a.js')
        const fileBPath = join(tempDirPath, 'b.js')
        const fileCPath = join(tempDirPath, 'c.js')
        const fileDPath = join(tempDirPath, 'd.js')
        const fileEPath = join(tempDirPath, 'e.js')
        const fileFPath = join(tempDirPath, 'f.js')

        await fs.promises.writeFile(
          fileAPath,
          `require('${fileBPath}')
require('${fileCPath}')
require('${fileDPath}')
require('${fileEPath}')
require('${fileFPath}')`
        )
        await fs.promises.writeFile(fileBPath, 'function a() {}; a()')
        await fs.promises.writeFile(
          fileCPath,
          `// coverage ignore next line
() => {}`
        )
        await fs.promises.writeFile(
          fileDPath,
          `// coverage ignore next line
() => {}`
        )
        await fs.promises.writeFile(fileEPath, '() => {}')
        await fs.promises.writeFile(fileFPath, '() => {}')

        let threw

        try {
          await execFilePromise('node', ['cli/coverage-node', fileAPath])
        } catch (error) {
          threw = true
          var { stdout, stderr } = error
        }

        assert.strictEqual(threw, true, 'CLI should error.')
        assert.strictEqual(
          stdout
            .replace(relative('', fileAPath), '<pathA>')
            .replace(relative('', fileBPath), '<pathB>')
            .replace(relative('', fileCPath), '<pathC>')
            .replace(relative('', fileDPath), '<pathD>'),
          '\n\u001b[32m2 files covered:\u001b[39m\n\n  <pathA>\n  <pathB>\n\n\u001b[33m2 files ignoring coverage:\u001b[39m\n\n  <pathC>:2:1 → 2:8\n  <pathD>:2:1 → 2:8\n\n\u001b[1m\u001b[31m2/6 files covered.\u001b[22m\u001b[39m\n\n'
        )
        assert.strictEqual(
          stderr
            .replace(relative('', fileEPath), '<pathE>')
            .replace(relative('', fileFPath), '<pathF>'),
          '\n\u001b[31m2 files missing coverage:\u001b[39m\n\n  <pathE>:1:1 → 1:8\n  <pathF>:1:1 → 1:8\n'
        )
      })
    }
  )

  tests.add('`coverage-node` CLI with a script console log.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(filePath, "console.log('Message.')")
      const { stdout, stderr } = await execFilePromise('node', [
        'cli/coverage-node',
        filePath
      ])

      assert.strictEqual(
        stdout.replace(relative('', filePath), '<path>'),
        'Message.\n\n\u001b[32m1 file covered:\u001b[39m\n\n  <path>\n\n\u001b[1m\u001b[32m1/1 files covered.\u001b[22m\u001b[39m\n\n'
      )
      assert.strictEqual(stderr, '')
    })
  })

  tests.add('`coverage-node` CLI with a script error.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(filePath, "throw new Error('Error.')")

      let threw

      try {
        await execFilePromise('node', ['cli/coverage-node', filePath])
      } catch (error) {
        threw = true
        var { stdout, stderr } = error
      }

      assert.strictEqual(threw, true, 'CLI should error.')
      assert.strictEqual(stdout, '')
      assert.strictEqual(
        stripStackTraces(stderr).replace(filePath, '<path>'),
        "<path>:1\nthrow new Error('Error.')\n^\n\nError: Error.\n"
      )
    })
  })

  tests.add('`coverage-node` CLI with a valid Node.js option.', async () => {
    await tempDirOperation(async tempDirPath => {
      const filePath = join(tempDirPath, 'index.js')
      await fs.promises.writeFile(
        filePath,
        `const { deprecate } = require('util')
const deprecated = deprecate(() => {}, 'Deprecated!')
deprecated()`
      )

      let threw

      try {
        await execFilePromise('node', [
          'cli/coverage-node',
          '--throw-deprecation',
          filePath
        ])
      } catch (error) {
        threw = true
        var { stdout, stderr } = error
      }

      assert.strictEqual(threw, true, 'CLI should error.')
      assert.strictEqual(stdout, '')
      assert.strictEqual(
        stderr.includes('DeprecationWarning: Deprecated!'),
        true
      )
    })
  })

  tests.add('`coverage-node` CLI without arguments.', async () => {
    let threw

    try {
      await execFilePromise('node', ['cli/coverage-node'])
    } catch (error) {
      threw = true
      var { stdout, stderr } = error
    }

    assert.strictEqual(threw, true, 'CLI should error.')
    assert.strictEqual(stdout, '')
    assert.strictEqual(
      stripStackTraces(stderr),
      'Error running Node.js with coverage:\n  Error: Node.js CLI arguments are required.\n'
    )
  })
}
