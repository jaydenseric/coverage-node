// @ts-check

/**
 * Extracts versions from a semver string.
 * @param {string} semver The semver string.
 * @returns {SemanticVersion} The major, minor, patch, prerelease and build
 *   versions.
 */
export default function semver(semver) {
  if (typeof semver !== "string")
    throw new TypeError("Argument 1 `semver` must be a string.");

  const match = semver.match(
    // The is is official recommended RegEx, see:
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u
  );

  if (!match)
    throw new TypeError("Argument 1 `semver` must be a semver string.");

  const [, major, minor, patch, prerelease, build] = match;

  return {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    prerelease,
    build,
  };
}

/**
 * A semantic version.
 * @typedef {object} SemanticVersion
 * @prop {number} major Major version.
 * @prop {number} minor Minor version.
 * @prop {number} patch Patch version.
 * @prop {string} [prerelease] Prerelease version.
 * @prop {string} [build] Build metadata.
 */
