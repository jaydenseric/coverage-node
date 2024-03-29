// @ts-check

import disposableDirectory from "disposable-directory";
import { deepStrictEqual, rejects } from "node:assert";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import analyseCoverage from "./analyseCoverage.mjs";
import childProcessPromise from "./childProcessPromise.mjs";

/**
 * Adds `reportCliError` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add(
    "`reportCliError` with argument 1 `coverageDirPath` not a string.",
    async () => {
      await rejects(
        analyseCoverage(
          // @ts-expect-error Testing invalid.
          true
        ),
        new TypeError("Argument 1 `coverageDirPath` must be a string.")
      );
    }
  );

  tests.add(
    "`analyseCoverage` ignores `node_modules` directory files.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const coverageDirPath = join(tempDirPath, "coverage");
        const nodeModulesDirPath = join(tempDirPath, "node_modules");
        const nodeModulesModuleName = "a";
        const nodeModulesModuleMainFileName = "index.mjs";
        const nodeModulesModuleMainFilePath = join(
          nodeModulesDirPath,
          nodeModulesModuleName,
          nodeModulesModuleMainFileName
        );

        await mkdir(nodeModulesDirPath);
        await mkdir(join(nodeModulesDirPath, nodeModulesModuleName));
        await writeFile(nodeModulesModuleMainFilePath, "1;");

        await childProcessPromise(
          spawn("node", [nodeModulesModuleMainFilePath], {
            stdio: "inherit",
            env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
          })
        );

        deepStrictEqual(await analyseCoverage(coverageDirPath), {
          filesCount: 0,
          covered: [],
          ignored: [],
          uncovered: [],
        });
      });
    }
  );

  tests.add("`analyseCoverage` ignores `test` directory files.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, "coverage");
      const dirPath = join(tempDirPath, "test");
      const filePath = join(dirPath, "index.mjs");

      await mkdir(dirPath);
      await writeFile(filePath, "1;");

      await childProcessPromise(
        spawn("node", [filePath], {
          stdio: "inherit",
          env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
        })
      );

      deepStrictEqual(await analyseCoverage(coverageDirPath), {
        filesCount: 0,
        covered: [],
        ignored: [],
        uncovered: [],
      });
    });
  });

  tests.add(
    "`analyseCoverage` ignores files with `.test` prefixed before the extension.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const coverageDirPath = join(tempDirPath, "coverage");
        const filePath = join(tempDirPath, "index.test.mjs");

        await writeFile(filePath, "1;");

        await childProcessPromise(
          spawn("node", [filePath], {
            stdio: "inherit",
            env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
          })
        );

        deepStrictEqual(await analyseCoverage(coverageDirPath), {
          filesCount: 0,
          covered: [],
          ignored: [],
          uncovered: [],
        });
      });
    }
  );

  tests.add("`analyseCoverage` ignores files named `test`.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, "coverage");
      const filePath = join(tempDirPath, "test.mjs");

      await writeFile(filePath, "1;");

      await childProcessPromise(
        spawn("node", [filePath], {
          stdio: "inherit",
          env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
        })
      );

      deepStrictEqual(await analyseCoverage(coverageDirPath), {
        filesCount: 0,
        covered: [],
        ignored: [],
        uncovered: [],
      });
    });
  });

  tests.add("`analyseCoverage` with 1 covered file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, "coverage");
      const filePath = join(tempDirPath, "index.mjs");

      await writeFile(filePath, "1;");

      await childProcessPromise(
        spawn("node", [filePath], {
          stdio: "inherit",
          env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
        })
      );

      deepStrictEqual(await analyseCoverage(coverageDirPath), {
        filesCount: 1,
        covered: [filePath],
        ignored: [],
        uncovered: [],
      });
    });
  });

  tests.add("`analyseCoverage` with 1 uncovered file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, "coverage");
      const filePath = join(tempDirPath, "index.mjs");

      await writeFile(filePath, "function a() {}; function b() {};");

      await childProcessPromise(
        spawn("node", [filePath], {
          stdio: "inherit",
          env: { ...process.env, NODE_V8_COVERAGE: coverageDirPath },
        })
      );

      deepStrictEqual(await analyseCoverage(coverageDirPath), {
        filesCount: 1,
        covered: [],
        ignored: [],
        uncovered: [
          {
            path: filePath,
            ranges: [
              {
                ignore: false,
                start: {
                  offset: 0,
                  line: 1,
                  column: 1,
                },
                end: {
                  offset: 14,
                  line: 1,
                  column: 15,
                },
              },
              {
                ignore: false,
                start: {
                  offset: 17,
                  line: 1,
                  column: 18,
                },
                end: {
                  offset: 31,
                  line: 1,
                  column: 32,
                },
              },
            ],
          },
        ],
      });
    });
  });
};
