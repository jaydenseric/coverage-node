'use strict'

const { Console } = require('console')

module.exports =
  /*
   * The `console` API, but all output is to `stderr`. This allows
   * `console.group` to be used with `console.error`.
   */
  new Console({
    stdout: process.stderr,
    stderr: process.stderr
  })
