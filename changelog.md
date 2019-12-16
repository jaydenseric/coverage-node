# coverage-node changelog

## Next

### Patch

- Updated the [eslint-config-env](https://npm.im/eslint-config-env) dev dependency.
- Don’t test Node.js v8 in CI.
- Changed the `fsPathRemove` function to use `rm -rf` instead of `rm -r`, and tested that it doesn’t error when the path doesn’t exist.
- Corrected the temporary directory paths created by the `createTempDir` function.

## 1.0.0

Initial release.
