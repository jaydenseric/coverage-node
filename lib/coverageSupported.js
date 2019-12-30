'use strict'

const {
  major: minMajor,
  minor: minMinor,
  patch: minPatch
} = require('./coverageSupportedMinNodeVersion')
const semver = require('./semver')

const { major, minor, patch } = semver(process.versions.node)

/**
 * Is the process Node.js version greater at least [the minimum required to
 * support code coverage]{@link coverageSupportedMinNodeVersion}.
 * @kind constant
 * @name coverageSupported
 * @type {boolean}
 * @example <caption>How to import.</caption>
 * ```js
 * const { coverageSupported } = require('coverage-node')
 * ```
 */
module.exports =
  // coverage ignore next line
  (major === minMajor && minor >= minMinor && patch >= minPatch) ||
  major > minMajor
