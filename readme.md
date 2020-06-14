# coverage-node

[![npm version](https://badgen.net/npm/v/coverage-node)](https://npm.im/coverage-node) [![CI status](https://github.com/jaydenseric/coverage-node/workflows/CI/badge.svg)](https://github.com/jaydenseric/coverage-node/actions)

A simple CLI to run [Node.js](https://nodejs.org) and report code coverage.

- ✨ Zero config.
- 🏁 ~261 [SLOC](https://en.wikipedia.org/wiki/Source_lines_of_code), written from scratch to use [code coverage features](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) built into Node.js v10+.
- 📦 [~312 kB install size](https://packagephobia.now.sh/result?p=coverage-node), compared to [2.02 MB for `c8`](https://packagephobia.now.sh/result?p=c8@7.0.0) or [9.01 MB for `nyc`](https://packagephobia.now.sh/result?p=nyc@15.0.0).
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
- Node.js `^10.17.0 || ^12.0.0 || >= 13.7.0`, but for Node.js versions &lt; v13.3 that produce [unreliable coverage data](https://github.com/nodejs/node/issues/25937#issuecomment-563115421) the [`coverage-node` CLI](#cli) skips code coverage and logs a warning.

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
if (false) console.log('Never runs.');
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
- [function reportCoverage](#function-reportcoverage)
- [constant coverageSupported](#constant-coveragesupported)
- [constant coverageSupportedMinNodeVersion](#constant-coveragesupportedminnodeversion)
- [type CoverageAnalysis](#type-coverageanalysis)
- [type SemanticVersion](#type-semanticversion)
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

_Ways to `import`._

> ```js
> import { analyseCoverage } from 'coverage-node';
> ```
>
> ```js
> import analyseCoverage from 'coverage-node/public/analyseCoverage.js';
> ```

_Ways to `require`._

> ```js
> const { analyseCoverage } = require('coverage-node');
> ```
>
> ```js
> const analyseCoverage = require('coverage-node/public/analyseCoverage');
> ```

---

### function reportCoverage

Reports a code coverage analysis to the console.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `coverageAnalysis` | [CoverageAnalysis](#type-coverageanalysis) | Coverage analysis from [`analyseCoverage`](#function-analysecoverage). |

#### Examples

_Ways to `import`._

> ```js
> import { reportCoverage } from 'coverage-node';
> ```
>
> ```js
> import reportCoverage from 'coverage-node/public/reportCoverage.js';
> ```

_Ways to `require`._

> ```js
> const { reportCoverage } = require('coverage-node');
> ```
>
> ```js
> const reportCoverage = require('coverage-node/public/reportCoverage');
> ```

---

### constant coverageSupported

Is the process Node.js version greater at least [the minimum required to support code coverage](#constant-coveragesupportedminnodeversion).

**Type:** boolean

#### Examples

_Ways to `import`._

> ```js
> import { coverageSupported } from 'coverage-node';
> ```
>
> ```js
> import coverageSupported from 'coverage-node/public/coverageSupported.js';
> ```

_Ways to `require`._

> ```js
> const { coverageSupported } = require('coverage-node');
> ```
>
> ```js
> const coverageSupported = require('coverage-node/public/coverageSupported');
> ```

---

### constant coverageSupportedMinNodeVersion

Minimum Node.js version supported for code coverage. Although Node.js v10+ supports coverage, only v13.3+ produces coverage data reliable enough to use.

**Type:** [SemanticVersion](#type-semanticversion)

#### Examples

_Ways to `import`._

> ```js
> import { coverageSupportedMinNodeVersion } from 'coverage-node';
> ```
>
> ```js
> import coverageSupportedMinNodeVersion from 'coverage-node/public/coverageSupportedMinNodeVersion.js';
> ```

_Ways to `require`._

> ```js
> const { coverageSupportedMinNodeVersion } = require('coverage-node');
> ```
>
> ```js
> const coverageSupportedMinNodeVersion = require('coverage-node/public/coverageSupportedMinNodeVersion');
> ```

---

### type CoverageAnalysis

[Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) analysis; useful for reporting.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `filesCount` | number | Number of files analyzed. |
| `covered` | Array&lt;string> | Covered file absolute paths. |
| `ignored` | Array&lt;[SourceCodeRanges](#type-sourcecoderanges)> | Ignored source code ranges. |
| `uncovered` | Array&lt;[SourceCodeRanges](#type-sourcecoderanges)> | Uncovered source code ranges. |

---

### type SemanticVersion

A semantic version.

**Type:** object

| Property     | Type    | Description         |
| :----------- | :------ | :------------------ |
| `major`      | number  | Major version.      |
| `minor`      | number  | Minor version.      |
| `patch`      | number  | Patch version.      |
| `prerelease` | string? | Prerelease version. |
| `build`      | string? | Build metadata.     |

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
