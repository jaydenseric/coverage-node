'use strict';

exports.coverageSupported = require('./coverageSupported');
exports.coverageSupportedMinNodeVersion = require('./coverageSupportedMinNodeVersion');
exports.analyseCoverage = require('./analyseCoverage');
exports.reportCoverage = require('./reportCoverage');

/**
 * [Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir)
 * analysis; useful for reporting.
 * @kind typedef
 * @name CoverageAnalysis
 * @type {object}
 * @prop {number} filesCount Number of files analyzed.
 * @prop {Array<string>} covered Covered file absolute paths.
 * @prop {Array<SourceCodeRanges>} ignored Ignored source code ranges.
 * @prop {Array<SourceCodeRanges>} uncovered Uncovered source code ranges.
 */

/**
 * A semantic version.
 * @kind typedef
 * @name SemanticVersion
 * @type {object}
 * @prop {number} major Major version.
 * @prop {number} minor Minor version.
 * @prop {number} patch Patch version.
 * @prop {string} [prerelease] Prerelease version.
 * @prop {string} [build] Build metadata.
 */

/**
 * Source code location.
 * @kind typedef
 * @name SourceCodeLocation
 * @type {object}
 * @prop {number} offset Character offset.
 * @prop {number} line Line number.
 * @prop {column} column Column number.
 */

/**
 * Source code range details.
 * @kind typedef
 * @name SourceCodeRange
 * @type {object}
 * @prop {boolean} [ignore] Should it be ignored.
 * @prop {SourceCodeLocation} start Start location.
 * @prop {SourceCodeLocation} end End location.
 */

/**
 * A source code file with ranges of interest.
 * @kind typedef
 * @name SourceCodeRanges
 * @type {object}
 * @prop {string} path File absolute path.
 * @prop {Array<SourceCodeRange>} ranges Ranges of interest.
 */
