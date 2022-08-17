# coverage-node changelog

## Next

### Major

- Updated Node.js support to `^14.17.0 || ^16.0.0 || >= 18.0.0`.
- The command `coverage-node` no longer skips code coverage and logs a warning for Node.js versions < v13.3 that produce unreliable coverage data as they are no longer supported.
- Removed these modules that were previously exported:
  - `coverageSupported.mjs`
  - `coverageSupportedMinNodeVersion.mjs`

### Patch

- Updated GitHub Actions CI config:
  - Run tests with Node.js v14, v16, v18.
- Fixed a comment typo.

## 6.1.0

### Minor

- A truthy `ALLOW_MISSING_COVERAGE` environment variable can now be used with the `coverage-node` CLI to prevent missing coverage from causing the process to exit with code `1`, via [#2](https://github.com/jaydenseric/coverage-node/pull/2).

### Patch

- Updated dependencies.
- Amended the v6.0.0 changelog entry.

## 6.0.1

### Patch

- Simplified dev dependencies and config for ESLint.
- The private `reportCliError` function now explicitly calls `.toString()` for errors that don’t have a `stack` property.
- Stopped using the [`kleur`](https://npm.im/kleur) chaining API.
- Use a new [`replace-stack-traces`](https://npm.im/replace-stack-traces) dev dependency in tests.

## 6.0.0

### Major

- Updated Node.js support to `^12.22.0 || ^14.17.0 || >= 16.0.0`.
- Updated dependencies, some of which require newer Node.js versions than previously supported.
- Public modules are now individually listed in the package `files` and `exports` fields.
- Removed `./package` from the package `exports` field; the full `package.json` filename must be used in a `require` path.
- Removed the package main index module; deep imports must be used.
- Shortened public module deep import paths, removing the `/public/`.
- Implemented TypeScript types via JSDoc comments.

### Patch

- Simplified package scripts.
- Check TypeScript types via a new package `types` script.
- Fixed various type related issues.
- Also run GitHub Actions CI with Node.js v17, and drop v15.
- Removed the [`jsdoc-md`](https://npm.im/jsdoc-md) dev dependency and the related package scripts, replacing the readme “API” section with a manually written “Exports” section.
- Fixed snapshot tests for the Node.js v17.0.0+ behavior of adding the Node.js version after trace for errors that cause the process to exit.
- Reorganized the test file structure.
- Renamed imports in the test index module.
- Added `CliError` class tests.
- Runtime type check `CLiError` constructor arguments.
- Simplified runtime type error messages.
- Configured Prettier option `singleQuote` to the default, `false`.
- Added a `license.md` MIT License file.
- Readme tweaks.

## 5.0.1

### Patch

- Updated dependencies.
- Added a package `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
- Readme tweaks.

## 5.0.0

### Major

- Updated supported Node.js versions to `^12.20 || >= 14.13`.
- Updated dependencies, some of which require newer Node.js versions than previously supported.
- The API is now ESM in `.mjs` files instead of CJS in `.js` files, [accessible via `import` but not `require`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_require).
- Replaced the the `package.json` `exports` field public [subpath folder mapping](https://nodejs.org/api/packages.html#packages_subpath_folder_mappings) (deprecated by Node.js) with a [subpath pattern](https://nodejs.org/api/packages.html#packages_subpath_patterns).

### Patch

- Simplified the package scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10 automatically generates a Prettier formatted readme.
- Always use regex `u` mode.
- Stop using [`hard-rejection`](https://npm.im/hard-rejection) to detect unhandled `Promise` rejections in tests, as Node.js v15+ does this natively.
- Improved the test helper function `replaceStackTraces`.
- Refactored unnecessary template strings.
- Updated GitHub Actions CI config:
  - Also run tests with Node.js v16.
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Don’t specify the `CI` environment variable as it’s set by default.

## 4.0.0

### Major

- The updated [`kleur`](https://npm.im/kleur) dependency causes subtle differences in which environments get colored console output.

### Minor

- Added runtime argument type checks for various private and public functions.
- Improved console output for `coverage-node` CLI errors.

### Patch

- Updated dependencies.
- Also test Node.js v15 in GitHub Actions CI.
- Simplified the GitHub Actions CI config with the [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Removed an extra space character from the `coverage-node` CLI error message when coverage is enabled.
- Use the `FORCE_COLOR` environment variable in tests to ensure output is colorized.
- Use a new [`snapshot-assertion`](https://npm.im/snapshot-assertion) dev dependency to snapshot test CLI output.
- Replaced the `stripStackTraces` test helper with a smarter `replaceStackTraces` helper that allows tests to detect a missing stack trace.
- Use `spawnSync` from the Node.js `child_process` API instead of the `execFilePromise` helper in tests.
- Added more `coverage-node` CLI tests.
- Improved internal JSDoc.
- Updated SLOC and install size related documentation.

## 3.0.0

### Major

- Updated supported Node.js versions to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dependencies, some of which require newer Node.js versions than were previously supported.
- Added a [package `exports` field](https://nodejs.org/api/esm.html#esm_package_entry_points) with [conditional exports](https://nodejs.org/api/esm.html#esm_conditional_exports) to support native ESM in Node.js and keep internal code private, [whilst avoiding the dual package hazard](https://nodejs.org/api/esm.html#esm_approach_1_use_an_es_module_wrapper). Published files have been reorganized, so previously undocumented deep imports will need to be rewritten according to the newly documented paths.

### Patch

- Updated Prettier config and scripts.
- Added ESM related keywords to the package `keywords` field.
- Updated ESLint config to match the new Node.js version support.
- Moved reading `process.argv` into the `coverageNode` function scope.
- Improved a JSDoc return type.
- Ensure GitHub Actions run on pull request.
- Test with Node.js v14 instead of v13.
- Updated EditorConfig.

## 2.0.3

### Patch

- Updated dev dependencies.
- Added a new [`hard-rejection`](https://npm.im/hard-rejection) dev dependency to ensure unhandled rejections in tests exit the process with an error.
- Destructured `assert` imports.
- Moved the `execFilePromise` helper from the `/lib` directory to `/test`, reducing the install size.

## 2.0.2

### Patch

- Allow a line to contain both code and a coverage ignore next line comment.
- Simplified `test/index.js`.

## 2.0.1

### Patch

- Updated dev dependencies.
- Added a new [`disposable-directory`](https://npm.im/disposable-directory) dependency to simplify the implementation and tests.
- Moved JSDoc comments above module exports code.
- Updated the compared [`c8` install size](https://packagephobia.com/result?p=c8@7.0.0), fixing [#1](https://github.com/jaydenseric/coverage-node/issues/1).

## 2.0.0

### Major

- The `coverage-node` CLI now skips code coverage when Node.js < v13.3 and displays an explanatory message in place of a code coverage report.
- Removed the `nodeWithCoverage` function.

### Minor

- New `coverageSupported` and `coverageSupportedMinNodeVersion` constants are exported.

### Patch

- Additionally test Node.js v10 and v12 in CI.
- Updated the comparison install size in the readme for [`nyc@15.0.0`](https://packagephobia.com/result?p=nyc@15.0.0).

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
