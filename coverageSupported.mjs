// @ts-check

import coverageSupportedMinNodeVersion from "./coverageSupportedMinNodeVersion.mjs";
import semver from "./semver.mjs";

const {
  major: minMajor,
  minor: minMinor,
  patch: minPatch,
} = coverageSupportedMinNodeVersion;
const { major, minor, patch } = semver(process.versions.node);

/**
 * Is the process Node.js version greater than or equal to
 * {@link coverageSupportedMinNodeVersion the minimum required to support code coverage}.
 * @type {boolean}
 */
export default // coverage ignore next line
(major === minMajor && minor >= minMinor && patch >= minPatch) ||
  major > minMajor;
