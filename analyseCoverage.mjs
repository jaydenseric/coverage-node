// @ts-check

import v8Coverage from "@bcoe/v8-coverage";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sourceRange from "./sourceRange.mjs";

/**
 * Analyzes
 * [Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir)
 * in a directory; useful for reporting.
 * @param {string} coverageDirPath Code coverage data directory path.
 * @returns {Promise<CoverageAnalysis>} Resolves the coverage analysis.
 */
export default async function analyseCoverage(coverageDirPath) {
  if (typeof coverageDirPath !== "string")
    throw new TypeError("Argument 1 `coverageDirPath` must be a string.");

  const coverageDirFileNames = await readdir(coverageDirPath);
  const filteredProcessCoverages = [];

  for (const fileName of coverageDirFileNames)
    if (fileName.startsWith("coverage-"))
      filteredProcessCoverages.push(
        readFile(join(coverageDirPath, fileName), "utf8").then(
          (coverageFileJson) => {
            /** @type {import("@bcoe/v8-coverage").ProcessCov} */
            const { result } = JSON.parse(coverageFileJson);
            return {
              // For performance, filtering happens as early as possible.
              result: result.filter(
                ({ url }) =>
                  // Exclude Node.js internals, keeping only files.
                  url.startsWith("file://") &&
                  // Exclude `node_modules` directory files.
                  !url.includes("/node_modules/") &&
                  // Exclude `test` directory files.
                  !url.includes("/test/") &&
                  // Exclude files with `.test` prefixed before the extension.
                  !/\.test\.\w+$/u.test(url) &&
                  // Exclude files named `test` (regardless of extension).
                  !/\/test\.\w+$/u.test(url)
              ),
            };
          }
        )
      );

  const mergedCoverage = v8Coverage.mergeProcessCovs(
    await Promise.all(filteredProcessCoverages)
  );

  /** @type {CoverageAnalysis} */
  const analysis = {
    filesCount: 0,
    covered: [],
    ignored: [],
    uncovered: [],
  };

  for (const { url, functions } of mergedCoverage.result) {
    analysis.filesCount++;

    const path = fileURLToPath(url);
    const uncoveredRanges = [];

    for (const { ranges } of functions)
      for (const range of ranges) if (!range.count) uncoveredRanges.push(range);

    if (uncoveredRanges.length) {
      const source = await readFile(path, "utf8");
      const ignored = [];
      const uncovered = [];

      for (const range of uncoveredRanges) {
        const sourceCodeRange = sourceRange(
          source,
          range.startOffset,
          // The coverage data end offset is the first character after the
          // range. For reporting to a user, it’s better to show the range as
          // only the included characters.
          range.endOffset - 1
        );

        if (sourceCodeRange.ignore) ignored.push(sourceCodeRange);
        else uncovered.push(sourceCodeRange);
      }

      if (ignored.length) analysis.ignored.push({ path, ranges: ignored });
      if (uncovered.length)
        analysis.uncovered.push({ path, ranges: uncovered });
    } else analysis.covered.push(path);
  }

  return analysis;
}

/**
 * [Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir)
 * analysis; useful for reporting.
 * @typedef {object} CoverageAnalysis
 * @prop {number} filesCount Number of files analyzed.
 * @prop {Array<string>} covered Covered file absolute paths.
 * @prop {Array<SourceCodeRanges>} ignored Ignored source code ranges.
 * @prop {Array<SourceCodeRanges>} uncovered Uncovered source code ranges.
 */

/**
 * A source code file with ranges of interest.
 * @typedef {object} SourceCodeRanges
 * @prop {string} path File absolute path.
 * @prop {Array<import("./sourceRange.mjs").SourceCodeRange>} ranges Ranges of
 *   interest.
 */
