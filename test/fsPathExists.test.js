'use strict'

const assert = require('assert')
const fsPathExists = require('./fsPathExists')

module.exports = tests => {
  tests.add('`fsPathExists` with an existent path.', async () => {
    assert.strictEqual(await fsPathExists('./package.json'), true)
  })

  tests.add('`fsPathExists` with a non-existent path.', async () => {
    assert.strictEqual(await fsPathExists('./non-existent.json'), false)
  })
}
