'use strict';

/**
 * Minimum Node.js version supported for code coverage. Although Node.js v10+
 * supports coverage, only v13.3+ produces coverage data reliable enough to use.
 * @kind constant
 * @name coverageSupportedMinNodeVersion
 * @type {SemanticVersion}
 * @example <caption>How to import.</caption>
 * ```js
 * const { coverageSupportedMinNodeVersion } = require('coverage-node');
 * ```
 */
module.exports = { major: 13, minor: 3, patch: 0 };
