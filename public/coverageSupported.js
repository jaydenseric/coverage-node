'use strict';

const semver = require('../private/semver');
const {
  major: minMajor,
  minor: minMinor,
  patch: minPatch,
} = require('./coverageSupportedMinNodeVersion');

const { major, minor, patch } = semver(process.versions.node);

/**
 * Is the process Node.js version greater at least [the minimum required to
 * support code coverage]{@link coverageSupportedMinNodeVersion}.
 * @kind constant
 * @name coverageSupported
 * @type {boolean}
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { coverageSupported } from 'coverage-node';
 * ```
 *
 * ```js
 * import coverageSupported from 'coverage-node/public/coverageSupported.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { coverageSupported } = require('coverage-node');
 * ```
 *
 * ```js
 * const coverageSupported = require('coverage-node/public/coverageSupported');
 * ```
 */
module.exports =
  // coverage ignore next line
  (major === minMajor && minor >= minMinor && patch >= minPatch) ||
  major > minMajor;
