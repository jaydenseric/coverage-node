// @ts-check

import { bold, green, red, yellow } from "kleur/colors";
import { relative } from "node:path";

import errorConsole from "./errorConsole.mjs";

/**
 * Reports a code coverage analysis to the console.
 * @param {import("./analyseCoverage.mjs").CoverageAnalysis} coverageAnalysis
 *   Coverage analysis.
 */
export default function reportCoverage({
  filesCount,
  covered,
  ignored,
  uncovered,
}) {
  if (covered.length) {
    console.group(
      `\n${green(
        `${covered.length} file${covered.length === 1 ? "" : "s"} covered:`
      )}\n`
    );

    for (const path of covered) console.info(relative("", path));

    console.groupEnd();
  }

  if (ignored.length) {
    console.group(
      `\n${yellow(
        `${ignored.length} file${
          ignored.length === 1 ? "" : "s"
        } ignoring coverage:`
      )}\n`
    );

    for (const { path, ranges } of ignored)
      for (const { start, end } of ranges)
        console.info(
          `${relative("", path)}:${start.line}:${start.column} → ${end.line}:${
            end.column
          }`
        );

    console.groupEnd();
  }

  if (uncovered.length) {
    errorConsole.group(
      `\n${red(
        `${uncovered.length} file${
          uncovered.length === 1 ? "" : "s"
        } missing coverage:`
      )}\n`
    );

    for (const { path, ranges } of uncovered)
      for (const { start, end } of ranges)
        errorConsole.info(
          `${relative("", path)}:${start.line}:${start.column} → ${end.line}:${
            end.column
          }`
        );

    errorConsole.groupEnd();
  }

  console.info(
    `\n${bold(
      (uncovered.length ? red : ignored.length ? yellow : green)(
        `${covered.length}/${filesCount} files covered.`
      )
    )}\n`
  );
}
