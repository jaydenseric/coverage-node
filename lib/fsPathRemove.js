'use strict'

const execFilePromise = require('./execFilePromise')

module.exports =
  /**
   * Removes a file or directory.
   * @kind function
   * @name fsPathRemove
   * @param {string} path Filesystem path.
   * @returns {Promise} Resolves when the file or directory is removed.
   * @ignore
   */
  async function fsPathRemove(path) {
    if (typeof path !== 'string') throw new Error('Path must be a string.')
    return execFilePromise('rm', ['-rf', path])
  }
