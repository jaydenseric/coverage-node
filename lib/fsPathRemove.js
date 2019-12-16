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
  function fsPathRemove(path) {
    return execFilePromise('rm', ['-r', path])
  }
