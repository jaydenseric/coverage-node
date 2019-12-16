'use strict'

module.exports =
  /**
   * Sleeps the process for a specified duration.
   * @kind function
   * @name sleep
   * @param {number} ms Duration in milliseconds.
   * @returns {Promise<void>} Resolves once the duration is up.
   * @ignore
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
