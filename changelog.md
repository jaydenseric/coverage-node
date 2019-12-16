# coverage-node changelog

## Next

### Patch

- Updated the [eslint-config-env](https://npm.im/eslint-config-env) dev dependency.
- Don’t test Node.js v8 in CI.
- `fsPathRemove` function improvements:
  - Reject with an error if the provided path is not a string.
  - Use `rm -rf` instead of `rm -r` so that it doesn’t error when the path doesn’t exist.
- Corrected the temporary directory paths created by the `createTempDir` function.

## 1.0.0

Initial release.
