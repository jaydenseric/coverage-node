'use strict';

/**
 * Minimum Node.js version supported for code coverage. Although Node.js v10+
 * supports coverage, only v13.3+ produces coverage data reliable enough to use.
 * @kind constant
 * @name coverageSupportedMinNodeVersion
 * @type {SemanticVersion}
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { coverageSupportedMinNodeVersion } from 'coverage-node';
 * ```
 *
 * ```js
 * import coverageSupportedMinNodeVersion from 'coverage-node/public/coverageSupportedMinNodeVersion.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { coverageSupportedMinNodeVersion } = require('coverage-node');
 * ```
 *
 * ```js
 * const coverageSupportedMinNodeVersion = require('coverage-node/public/coverageSupportedMinNodeVersion');
 * ```
 */
module.exports = { major: 13, minor: 3, patch: 0 };
