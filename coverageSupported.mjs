import coverageSupportedMinNodeVersion from "./coverageSupportedMinNodeVersion.mjs";
import semver from "./semver.mjs";

const {
  major: minMajor,
  minor: minMinor,
  patch: minPatch,
} = coverageSupportedMinNodeVersion;
const { major, minor, patch } = semver(process.versions.node);

/**
 * Is the process Node.js version greater at least [the minimum required to
 * support code coverage]{@link coverageSupportedMinNodeVersion}.
 * @kind constant
 * @name coverageSupported
 * @type {boolean}
 * @example <caption>How to import.</caption>
 * ```js
 * import coverageSupported from "coverage-node/coverageSupported.mjs";
 * ```
 */
export default // coverage ignore next line
(major === minMajor && minor >= minMinor && patch >= minPatch) ||
  major > minMajor;
