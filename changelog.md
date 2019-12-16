# coverage-node changelog

## Next

### Patch

- Updated the [`eslint-config-env`](https://npm.im/eslint-config-env) dev dependency.
- Only test Node.js v12 and v13 in CI.
- Updated the support documentation to recommend Node.js v13.3+.
- Corrected the temporary directory paths created by the `createTempDir` function.
- The `tempDirOperation` function now checks the temporary directory path was created before attempting to remove it in the cleanup phase.
- `fsPathRemove` function improvements:
  - Reject with an error if the provided path is not a string.
  - Use `rm -rf` instead of `rm -r` so that it doesn’t error when the path doesn’t exist.
- Tweaked test fixture formatting.

## 1.0.0

Initial release.
