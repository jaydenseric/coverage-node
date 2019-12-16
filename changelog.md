# coverage-node changelog

## Next

### Minor

- Added a new `filesCount` field to the code coverage analysis resolved by the `analyseCoverage` function.

### Patch

- Fixed the total number of files in the report summary sometimes being too big.

## 1.0.1

### Patch

- Updated the [`eslint-config-env`](https://npm.im/eslint-config-env) dev dependency.
- Only test Node.js v13 in CI as earlier versions produce flawed coverage data.
- Updated the support documentation to recommend Node.js v13.3+.
- Corrected the temporary directory paths created by the `createTempDir` function.
- The `tempDirOperation` function now checks the temporary directory path was created before attempting to remove it in the cleanup phase.
- `fsPathRemove` function improvements:
  - Reject with an error if the provided path is not a string.
  - Use `rm -rf` instead of `rm -r` so that it doesn’t error when the path doesn’t exist.
- Tweaked test fixture formatting.

## 1.0.0

Initial release.
