/**
 * Extracts versions from a semver string.
 * @kind function
 * @name semver
 * @param {string} semver The semver string.
 * @returns {SemanticVersion} The major, minor, patch, prerelease and build versions.
 * @ignore
 */
export default function semver(semver) {
  if (typeof semver !== 'string')
    throw new TypeError('First argument `semver` must be a string.');

  const [, major, minor, patch, prerelease, build] = semver.match(
    // The is is official recommended RegEx, see:
    // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u
  );
  return {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    prerelease,
    build,
  };
}
