'use strict'

const assert = require('assert')
const createTempDir = require('../../lib/createTempDir')
const fsPathRemove = require('../../lib/fsPathRemove')
const fsPathExists = require('../fsPathExists')

module.exports = tests => {
  tests.add('`fsPathRemove`.', async () => {
    const tempDirPath = await createTempDir()
    await fsPathRemove(tempDirPath)
    assert.strictEqual(await fsPathExists(tempDirPath), false)
  })
}
