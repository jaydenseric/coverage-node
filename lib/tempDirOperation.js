'use strict'

const createTempDir = require('../lib/createTempDir')
const fsPathRemove = require('../lib/fsPathRemove')

module.exports =
  /**
   * Creates a temporary directory that gets deleted after the operation
   * callback runs, even if an error occurs.
   * @kind function
   * @name tempDirOperation
   * @param {Function} callback An async callback that receives the temp dir path.
   * @returns {Promise<void>} Resolves once the callback and cleanup are done.
   * @ignore
   */
  async function tempDirOperation(callback) {
    try {
      var tempDirPath = await createTempDir()
      await callback(tempDirPath)
    } finally {
      if (tempDirPath) await fsPathRemove(tempDirPath)
    }
  }
