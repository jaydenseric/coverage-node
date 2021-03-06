import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import v8Coverage from '@bcoe/v8-coverage';
import sourceRange from '../private/sourceRange.mjs';

/**
 * Analyzes [Node.js generated V8 JavaScript code coverage data](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir)
 * in a directory; useful for reporting.
 * @kind function
 * @name analyseCoverage
 * @param {string} coverageDirPath Code coverage data directory path.
 * @returns {Promise<CoverageAnalysis>} Resolves the coverage analysis.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { analyseCoverage } from 'coverage-node';
 * ```
 *
 * ```js
 * import analyseCoverage from 'coverage-node/public/analyseCoverage.mjs';
 * ```
 */
export default async function analyseCoverage(coverageDirPath) {
  if (typeof coverageDirPath !== 'string')
    throw new TypeError('First argument `coverageDirPath` must be a string.');

  const coverageDirFileNames = await fs.promises.readdir(coverageDirPath);
  const filteredProcessCoverages = [];

  for (const fileName of coverageDirFileNames)
    if (fileName.startsWith('coverage-'))
      filteredProcessCoverages.push(
        fs.promises
          .readFile(join(coverageDirPath, fileName), 'utf8')
          .then((coverageFileJson) => {
            const { result } = JSON.parse(coverageFileJson);
            return {
              // For performance, filtering happens as early as possible.
              result: result.filter(
                ({ url }) =>
                  // Exclude Node.js internals, keeping only files.
                  url.startsWith('file://') &&
                  // Exclude `node_modules` directory files.
                  !url.includes('/node_modules/') &&
                  // Exclude `test` directory files.
                  !url.includes('/test/') &&
                  // Exclude files with `.test` prefixed before the extension.
                  !/\.test\.\w+$/u.test(url) &&
                  // Exclude files named `test` (regardless of extension).
                  !/\/test\.\w+$/u.test(url)
              ),
            };
          })
      );

  const mergedCoverage = v8Coverage.mergeProcessCovs(
    await Promise.all(filteredProcessCoverages)
  );

  // The analysis will only include info useful for reporting.
  const analysis = {
    // Total number of files.
    filesCount: 0,

    // Fully covered file paths.
    covered: [],

    // File paths and ignored ranges.
    ignored: [],

    // File paths and uncovered ranges.
    uncovered: [],
  };

  for (const { url, functions } of mergedCoverage.result) {
    analysis.filesCount++;

    const path = fileURLToPath(url);
    const uncoveredRanges = [];

    for (const { ranges } of functions)
      for (const range of ranges) if (!range.count) uncoveredRanges.push(range);

    if (uncoveredRanges.length) {
      const source = await fs.promises.readFile(path, 'utf8');
      const ignored = [];
      const uncovered = [];

      for (const range of uncoveredRanges) {
        const { ignore, ...rangeDetails } = sourceRange(
          source,
          range.startOffset,
          // The coverage data end offset is the first character after the
          // range. For reporting to a user, it’s better to show the range
          // as only the included characters.
          range.endOffset - 1
        );

        if (ignore) ignored.push(rangeDetails);
        else uncovered.push(rangeDetails);
      }

      if (ignored.length) analysis.ignored.push({ path, ranges: ignored });
      if (uncovered.length)
        analysis.uncovered.push({ path, ranges: uncovered });
    } else analysis.covered.push(path);
  }

  return analysis;
}
