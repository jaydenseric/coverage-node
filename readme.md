# coverage-node

[![npm version](https://badgen.net/npm/v/coverage-node)](https://npm.im/coverage-node) [![CI status](https://github.com/jaydenseric/coverage-node/workflows/CI/badge.svg)](https://github.com/jaydenseric/coverage-node/actions)

A simple CLI to run [Node.js](https://nodejs.org) and report code coverage.

- ✨ Zero config.
- 🏁 Tiny [SLOC](https://en.wikipedia.org/wiki/Source_lines_of_code), written from scratch to use [code coverage features](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) built into Node.js v10+.
- 📦 [Lean install size](https://packagephobia.com/result?p=coverage-node), compared to [2.2 MB for `c8` v7.7.1](https://packagephobia.com/result?p=c8@7.7.1) or [8.84 MB for `nyc` v15.1.0](https://packagephobia.com/result?p=nyc@15.1.0).
- 🖱 Displays ignored or uncovered source code ranges as paths, clickable in IDEs such as [VS Code](https://code.visualstudio.com).

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install coverage-node --save-dev
```

In a [`package.json` script](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts), replace the `node` command with [`coverage-node`](#command-coverage-node):

```diff
 {
   "scripts": {
-    "test": "node test.mjs"
+    "test": "coverage-node test.mjs"
   }
 }
```

## Requirements

- Operating system:
  - Linux
  - macOS
- [Node.js](https://nodejs.org): `^12.22.0 || ^14.17.0 || >= 16.0.0`, but for Node.js versions < v13.3 that produce [unreliable coverage data](https://github.com/nodejs/node/issues/25937#issuecomment-563115421) the command [`coverage-node`](#command-coverage-node) skips code coverage and logs a warning.

## Ignored files

Code coverage analysis ignores:

- `node_modules` directory files, e.g. `node_modules/foo/index.mjs`.
- `test` directory files, e.g. `test/index.mjs`.
- Files with `.test` prefixed before the extension, e.g. `foo.test.mjs`.
- Files named `test` (regardless of extension), e.g. `test.mjs`.

## Ignored lines

In source code, a comment (case insensitive) can be used to ignore code coverage ranges that start on the the next line:

```js
// coverage ignore next line
if (false) console.log("Never runs.");
```

## CLI

### Command `coverage-node`

Substitutes the normal `node` command; any [`node` CLI options](https://nodejs.org/api/cli.html#cli_options) can be used to run a test script. If the script doesn’t error a code coverage analysis is reported to the console, and if coverage is incomplete and there isn’t a truthy `ALLOW_MISSING_COVERAGE` environment variable the process exits with code `1`.

#### Examples

[`npx`](https://docs.npmjs.com/cli/v8/commands/npx) can be used to quickly check code coverage for a script:

```sh
npx coverage-node test.mjs
```

A [`package.json` script](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts):

```json
{
  "scripts": {
    "test": "coverage-node test.mjs"
  }
}
```

A [`package.json` script](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts) that allows missing coverage:

```json
{
  "scripts": {
    "test": "ALLOW_MISSING_COVERAGE=1 coverage-node test.mjs"
  }
}
```

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`analyseCoverage.mjs`](./analyseCoverage.mjs)
- [`coverageSupported.mjs`](./coverageSupported.mjs)
- [`coverageSupportedMinNodeVersion.mjs`](./coverageSupportedMinNodeVersion.mjs)
- [`reportCoverage.mjs`](./reportCoverage.mjs)
