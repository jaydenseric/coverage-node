// @ts-check

import { strictEqual } from "assert";
import { spawnSync } from "child_process";
import disposableDirectory from "disposable-directory";
import fs from "fs";
import { join, relative } from "path";
import replaceStackTraces from "replace-stack-traces";
import snapshot from "snapshot-assertion";
import { fileURLToPath } from "url";

import coverageSupported from "./coverageSupported.mjs";

const COVERAGE_NODE_CLI_PATH = fileURLToPath(
  new URL("./coverage-node.mjs", import.meta.url)
);
const SNAPSHOT_REPLACEMENT_FILE_PATH = "<file path>";
const SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION = "<process Node.js version>";

/**
 * Adds `coverage-node` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`coverage-node` CLI with 1 covered file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(filePath, "1;");

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        new URL(
          `./test/snapshots/coverage-node/1-covered-file-coverage-${
            coverageSupported ? "supported" : "unsupported"
          }-stdout.ans`,
          import.meta.url
        )
      );

      strictEqual(stderr.toString(), "");
      strictEqual(status, 0);
    });
  });

  tests.add("`coverage-node` CLI with 1 ignored file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(
        filePath,
        `// coverage ignore next line
() => {};
`
      );

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        new URL(
          `./test/snapshots/coverage-node/1-ignored-file-coverage-${
            coverageSupported ? "supported" : "unsupported"
          }-stdout.ans`,
          import.meta.url
        )
      );

      strictEqual(stderr.toString(), "");
      strictEqual(status, 0);
    });
  });

  tests.add(
    "`coverage-node` CLI with 1 uncovered file, `ALLOW_MISSING_COVERAGE` environment variable falsy.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "index.mjs");

        await fs.promises.writeFile(filePath, "() => {};");

        const { stdout, stderr, status, error } = spawnSync(
          "node",
          [COVERAGE_NODE_CLI_PATH, filePath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: "1",
            },
          }
        );

        if (error) throw error;

        await snapshot(
          coverageSupported
            ? stdout.toString()
            : stdout
                .toString()
                .replace(
                  process.version,
                  SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
                ),
          new URL(
            `./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-falsy-coverage-${
              coverageSupported ? "supported" : "unsupported"
            }-stdout.ans`,
            import.meta.url
          )
        );

        if (coverageSupported)
          await snapshot(
            stderr
              .toString()
              .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
            new URL(
              "./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-falsy-coverage-supported-stderr.ans",
              import.meta.url
            )
          );
        else strictEqual(stderr.toString(), "");

        strictEqual(status, coverageSupported ? 1 : 0);
      });
    }
  );

  tests.add(
    "`coverage-node` CLI with 1 uncovered file, `ALLOW_MISSING_COVERAGE` environment variable truthy.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "index.mjs");

        await fs.promises.writeFile(filePath, "() => {};");

        const { stdout, stderr, status, error } = spawnSync(
          "node",
          [COVERAGE_NODE_CLI_PATH, filePath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: "1",
              ALLOW_MISSING_COVERAGE: "1",
            },
          }
        );

        if (error) throw error;

        await snapshot(
          coverageSupported
            ? stdout.toString()
            : stdout
                .toString()
                .replace(
                  process.version,
                  SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
                ),
          new URL(
            `./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-truthy-coverage-${
              coverageSupported ? "supported" : "unsupported"
            }-stdout.ans`,
            import.meta.url
          )
        );

        if (coverageSupported)
          await snapshot(
            stderr
              .toString()
              .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
            new URL(
              "./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-truthy-coverage-supported-stderr.ans",
              import.meta.url
            )
          );
        else strictEqual(stderr.toString(), "");

        strictEqual(status, 0);
      });
    }
  );

  tests.add(
    "`coverage-node` CLI with 2 covered, ignored and uncovered files.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const fileAPath = join(tempDirPath, "a.mjs");
        const fileBPath = join(tempDirPath, "b.mjs");
        const fileCPath = join(tempDirPath, "c.mjs");
        const fileDPath = join(tempDirPath, "d.mjs");
        const fileEPath = join(tempDirPath, "e.mjs");
        const fileFPath = join(tempDirPath, "f.mjs");

        await fs.promises.writeFile(
          fileAPath,
          `import "${fileBPath}";
import "${fileCPath}";
import "${fileDPath}";
import "${fileEPath}";
import "${fileFPath}";
`
        );
        await fs.promises.writeFile(fileBPath, "function a() {}; a();");
        await fs.promises.writeFile(
          fileCPath,
          `// coverage ignore next line
() => {};`
        );
        await fs.promises.writeFile(
          fileDPath,
          `// coverage ignore next line
() => {};`
        );
        await fs.promises.writeFile(fileEPath, "() => {};");
        await fs.promises.writeFile(fileFPath, "() => {};");

        const { stdout, stderr, status, error } = spawnSync(
          "node",
          [COVERAGE_NODE_CLI_PATH, fileAPath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: "1",
            },
          }
        );

        if (error) throw error;

        await snapshot(
          coverageSupported
            ? stdout
                .toString()
                .replace(relative("", fileAPath), "<pathA>")
                .replace(relative("", fileBPath), "<pathB>")
                .replace(relative("", fileCPath), "<pathC>")
                .replace(relative("", fileDPath), "<pathD>")
            : stdout
                .toString()
                .replace(
                  process.version,
                  SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
                ),
          new URL(
            `./test/snapshots/coverage-node/2-covered-ignored-uncovered-files-coverage-${
              coverageSupported ? "supported" : "unsupported"
            }-stdout.ans`,
            import.meta.url
          )
        );

        if (coverageSupported)
          await snapshot(
            stderr
              .toString()
              .replace(relative("", fileEPath), "<pathE>")
              .replace(relative("", fileFPath), "<pathF>"),
            new URL(
              "./test/snapshots/coverage-node/2-covered-ignored-uncovered-files-coverage-supported-stderr.ans",
              import.meta.url
            )
          );
        else strictEqual(stderr.toString(), "");

        strictEqual(status, coverageSupported ? 1 : 0);
      });
    }
  );

  tests.add("`coverage-node` CLI with a script console log.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(filePath, 'console.log("Message.");');

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        new URL(
          `./test/snapshots/coverage-node/script-console-log-coverage-${
            coverageSupported ? "supported" : "unsupported"
          }-stdout.ans`,
          import.meta.url
        )
      );

      strictEqual(stderr.toString(), "");
      strictEqual(status, 0);
    });
  });

  tests.add("`coverage-node` CLI with a script error.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(filePath, 'throw new Error("Error.");');

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()).replace(
          filePath,
          SNAPSHOT_REPLACEMENT_FILE_PATH
        ),
        new URL(
          "./test/snapshots/coverage-node/script-error-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 1);
    });
  });

  tests.add("`coverage-node` CLI with a Node.js option, valid.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(
        filePath,
        `import { deprecate } from "util";

const deprecated = deprecate(() => {}, "Deprecated!");
deprecated();
`
      );

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, "--throw-deprecation", filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), "");
      strictEqual(
        stderr.toString().includes("DeprecationWarning: Deprecated!"),
        true
      );
      strictEqual(status, 1);
    });
  });

  tests.add("`coverage-node` CLI with a Node.js option, invalid.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await fs.promises.writeFile(filePath, "1;");

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, "--not-a-real-option", filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()),
        new URL(
          "./test/snapshots/coverage-node/node-option-invalid-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 9);
    });
  });

  tests.add("`coverage-node` CLI with a missing file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      const { stdout, stderr, status, error } = spawnSync(
        "node",
        [COVERAGE_NODE_CLI_PATH, filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), "");
      strictEqual(
        stderr.toString().includes(`Error: Cannot find module '${filePath}'`),
        true
      );
      strictEqual(status, 1);
    });
  });

  tests.add("`coverage-node` CLI without arguments.", async () => {
    const { stdout, stderr, status, error } = spawnSync(
      "node",
      ["coverage-node.mjs"],
      {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      }
    );

    if (error) throw error;

    strictEqual(stdout.toString(), "");

    await snapshot(
      replaceStackTraces(stderr.toString()),
      new URL(
        `./test/snapshots/coverage-node/without-arguments-coverage-${
          coverageSupported ? "supported" : "unsupported"
        }-stderr.ans`,
        import.meta.url
      )
    );

    strictEqual(status, 1);
  });
};
