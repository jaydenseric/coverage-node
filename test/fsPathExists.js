'use strict'

const fs = require('fs')

module.exports =
  /**
   * Determines if a file or directory path exists.
   * @kind function
   * @name fsPathExists
   * @param {string} path Filesystem path.
   * @returns {Promise<boolean>} Resolves if the filesystem path exits.
   * @ignore
   */
  async function fsPathExists(path) {
    try {
      await fs.promises.access(path)
      return true
    } catch (error) {
      if (error.code === 'ENOENT') return false
      throw error
    }
  }
