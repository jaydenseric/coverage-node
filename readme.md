# coverage-node

[![npm version](https://badgen.net/npm/v/coverage-node)](https://npm.im/coverage-node) [![CI status](https://github.com/jaydenseric/coverage-node/workflows/CI/badge.svg)](https://github.com/jaydenseric/coverage-node/actions)

A simple CLI to run [Node.js](https://nodejs.org) and report code coverage.

- ✨ Zero config.
- 🏁 ~240 [SLOC](https://en.wikipedia.org/wiki/Source_lines_of_code), written from scratch to use [code coverage features](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) built into Node.js v10+.
- 📦 [~300 kB install size](https://packagephobia.now.sh/result?p=coverage-node), compared to [6.61 MB for `c8`](https://packagephobia.now.sh/result?p=c8@6.0.1) or [13 MB for `nyc`](https://packagephobia.now.sh/result?p=nyc@14.1.1).
- 🖱Displays ignored or uncovered source code ranges as paths, clickable in IDEs such as [VS Code](https://code.visualstudio.com).

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install coverage-node --save-dev
```

In a [`package.json` script](https://docs.npmjs.com/files/package.json#scripts), replace the `node` command with `coverage-node`:

```diff
 {
   "scripts": {
-    "test": "node test.js"
+    "test": "coverage-node test.js"
   }
 }
```

## Support

- Linux, macOS.
- Node.js v10+. Be aware that [Node.js v10-11 generates unreliable coverage data](https://github.com/nodejs/node/issues/25937#issuecomment-563115421).

## Ignored files

Code coverage analysis ignores:

- `node_modules` directory files, e.g. `node_modules/foo/index.js`.
- `test` directory files, e.g. `test/index.js`.
- Files with `.test` prefixed before the extension, e.g. `foo.test.js`.
- Files named `test` (regardless of extension), e.g. `test.js`.

## Ignored lines

In source code, a comment (case insensitive) can be used to ignore code coverage ranges that start on the the next line:

```js
// coverage ignore next line
if (false) console.log('Never runs.')
```

## CLI

The `coverage-node` command substitutes the normal `node` command; any [`node` CLI options](https://nodejs.org/api/cli.html) can be used to run a test script.

If the script doesn’t error a code coverage analysis is reported to the console, and if coverage is incomplete the exit code is `1`.

[`npx`](https://npm.im/npx) can be used to quickly check code coverage for a script:

```shell
npx coverage-node test.js
```

## API

### Table of contents

- [function analyseCoverage](#function-analysecoverage)
- [function nodeWithCoverage](#function-nodewithcoverage)
- [function reportCoverage](#function-reportcoverage)
- [type CoverageAnalysis](#type-coverageanalysis)
- [type SourceCodeLocation](#type-sourcecodelocation)
- [type SourceCodeRange](#type-sourcecoderange)
- [type SourceCodeRanges](#type-sourcecoderanges)

### function analyseCoverage

Analyzes [Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) in a directory; useful for reporting.

| Parameter         | Type   | Description                        |
| :---------------- | :----- | :--------------------------------- |
| `coverageDirPath` | string | Code coverage data directory path. |

**Returns:** Promise&lt;[CoverageAnalysis](#type-coverageanalysis)> — Resolves the coverage analysis.

#### Examples

_How to import._

> ```js
> const { analyseCoverage } = require('coverage-node')
> ```

---

### function nodeWithCoverage

Runs Node.js with code coverage enabled via the [`NODE_V8_COVERAGE`](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) environment variable.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `coverageDirPath` | string | Directory path to store code coverage data. |
| `args` | Array&lt;string> | Node.js CLI arguments. |
| `command` | string? = `node` | Node.js CLI command to run with the arguments. |

**Returns:** Promise&lt;number> — Resolves the [Node.js exit code](https://nodejs.org/api/process.html#process_exit_codes).

#### Examples

_How to import._

> ```js
> const { nodeWithCoverage } = require('coverage-node')
> ```

---

### function reportCoverage

Reports a code coverage analysis to the console.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `coverageAnalysis` | [CoverageAnalysis](#type-coverageanalysis) | Coverage analysis from [`analyseCoverage`](#function-analysecoverage). |

#### Examples

_How to import._

> ```js
> const { reportCoverage } = require('coverage-node')
> ```

---

### type CoverageAnalysis

[Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) analysis; useful for reporting.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `covered` | Array&lt;string> | Covered file absolute paths. |
| `ignored` | Array&lt;[SourceCodeRanges](#type-sourcecoderanges)> | Ignored source code ranges. |
| `uncovered` | Array&lt;[SourceCodeRanges](#type-sourcecoderanges)> | Uncovered source code ranges. |

---

### type SourceCodeLocation

Source code location.

**Type:** object

| Property | Type   | Description       |
| :------- | :----- | :---------------- |
| `offset` | number | Character offset. |
| `line`   | number | Line number.      |
| `column` | column | Column number.    |

---

### type SourceCodeRange

Source code range details.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `ignore` | boolean? | Should it be ignored. |
| `start` | [SourceCodeLocation](#type-sourcecodelocation) | Start location. |
| `end` | [SourceCodeLocation](#type-sourcecodelocation) | End location. |

---

### type SourceCodeRanges

A source code file with ranges of interest.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `path` | string | File absolute path. |
| `ranges` | Array&lt;[SourceCodeRange](#type-sourcecoderange)> | Ranges of interest. |