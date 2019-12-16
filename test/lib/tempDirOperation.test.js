'use strict'

const assert = require('assert')
const tempDirOperation = require('../../lib/tempDirOperation')
const fsPathExists = require('../fsPathExists')
const sleep = require('../sleep')

module.exports = tests => {
  tests.add('`tempDirOperation` without a callback error.', async () => {
    let createdTempDirPath
    let callbackAwaited

    await tempDirOperation(async tempDirPath => {
      createdTempDirPath = tempDirPath
      await sleep(50)
      callbackAwaited = true
    })

    assert.strictEqual(callbackAwaited, true)
    assert.strictEqual(typeof createdTempDirPath, 'string')
    assert.strictEqual(await fsPathExists(createdTempDirPath), false)
  })

  tests.add('`tempDirOperation` with a callback error.', async () => {
    let createdTempDirPath

    try {
      await tempDirOperation(tempDirPath => {
        createdTempDirPath = tempDirPath
        throw new Error('TEST_MESSAGE')
      })
    } catch (error) {
      if (error.message !== 'TEST_MESSAGE') throw error
    }

    assert.strictEqual(await fsPathExists(createdTempDirPath), false)
  })
}
