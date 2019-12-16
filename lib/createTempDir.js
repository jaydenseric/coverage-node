'use strict'

const fs = require('fs')
const { tmpdir } = require('os')

module.exports =
  /**
   * Creates a directory in the OS temporary directory.
   * @kind function
   * @name createTempDir
   * @returns {Promise<string>} Resolves the created directory path.
   * @ignore
   */
  async function createTempDir() {
    // On macOS `os.tmpdir()` returns the path to a symlink, see:
    // https://github.com/nodejs/node/issues/11422
    const osTempDirPath = await fs.promises.realpath(tmpdir())
    return fs.promises.mkdtemp(osTempDirPath)
  }
