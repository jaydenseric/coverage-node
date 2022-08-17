# coverage-node

A simple CLI to run [Node.js](https://nodejs.org) and report code coverage.

- ✨ Zero config.
- 🏁 Tiny source, written from scratch to use [code coverage features](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) built into Node.js.
- 📦 [Lean install size](https://packagephobia.com/result?p=coverage-node), compared to [1.94 MB for `c8` v7.11.1](https://packagephobia.com/result?p=c8@7.11.1) or [8.84 MB for `nyc` v15.1.0](https://packagephobia.com/result?p=nyc@15.1.0).
- 🖱 Displays ignored or uncovered source code ranges as paths, clickable in IDEs such as [VS Code](https://code.visualstudio.com).

## Installation

To install [`coverage-node`](https://npm.im/coverage-node) with [npm](https://npmjs.com/get-npm), run:

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

Supported operating systems:

- Linux
- macOS

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `^14.17.0 || ^16.0.0 || >= 18.0.0`.

Projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a `// @ts-check` comment:

- [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
- [`compilerOptions.maxNodeModuleJsDepth`](https://typescriptlang.org/tsconfig#maxNodeModuleJsDepth) should be reasonably large, e.g. `10`.
- [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

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

The [npm](https://npmjs.com) package [`coverage-node`](https://npm.im/coverage-node) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). It doesn’t have a main index module, so use deep imports from the ECMAScript modules that are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):

- [`analyseCoverage.mjs`](./analyseCoverage.mjs)
- [`reportCoverage.mjs`](./reportCoverage.mjs)
