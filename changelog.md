# coverage-node changelog

## Next

### Patch

- Allow a line to contain both code and a coverage ignore next line comment.
- Simplified `test/index.js`.

## 2.0.1

### Patch

- Updated dev dependencies.
- Added a new [`disposable-directory`](https://npm.im/disposable-directory) dependency to simplify the implementation and tests.
- Moved JSDoc comments above module exports code.
- Updated the compared [`c8` install size](https://packagephobia.now.sh/result?p=c8@7.0.0), fixing [#1](https://github.com/jaydenseric/coverage-node/issues/1).

## 2.0.0

### Major

- The `coverage-node` CLI now skips code coverage when Node.js < v13.3 and displays an explanatory message in place of a code coverage report.
- Removed the `nodeWithCoverage` function.

### Minor

- New `coverageSupported` and `coverageSupportedMinNodeVersion` constants are exported.

### Patch

- Additionally test Node.js v10 and v12 in CI.
- Updated the comparison install size in the readme for [`nyc@15.0.0`](https://packagephobia.now.sh/result?p=nyc@15.0.0).

## 1.1.0

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
