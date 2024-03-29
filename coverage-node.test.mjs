// @ts-check

import disposableDirectory from "disposable-directory";
import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import replaceStackTraces from "replace-stack-traces";
import snapshot from "snapshot-assertion";

const COVERAGE_NODE_CLI_PATH = fileURLToPath(
  new URL("./coverage-node.mjs", import.meta.url)
);
const SNAPSHOT_REPLACEMENT_FILE_PATH = "<file path>";

/**
 * Adds `coverage-node` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`coverage-node` CLI with 1 covered file.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await writeFile(filePath, "1;");

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
        stdout
          .toString()
          .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
        new URL(
          `./test/snapshots/coverage-node/1-covered-file-stdout.ans`,
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

      await writeFile(
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
        stdout
          .toString()
          .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
        new URL(
          `./test/snapshots/coverage-node/1-ignored-file-stdout.ans`,
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

        await writeFile(filePath, "() => {};");

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
          stdout.toString(),
          new URL(
            `./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-falsy-stdout.ans`,
            import.meta.url
          )
        );

        await snapshot(
          stderr
            .toString()
            .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
          new URL(
            "./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-falsy-stderr.ans",
            import.meta.url
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add(
    "`coverage-node` CLI with 1 uncovered file, `ALLOW_MISSING_COVERAGE` environment variable truthy.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "index.mjs");

        await writeFile(filePath, "() => {};");

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
          stdout.toString(),
          new URL(
            `./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-truthy-stdout.ans`,
            import.meta.url
          )
        );

        await snapshot(
          stderr
            .toString()
            .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
          new URL(
            "./test/snapshots/coverage-node/1-uncovered-file-ALLOW_MISSING_COVERAGE-truthy-stderr.ans",
            import.meta.url
          )
        );

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

        await writeFile(
          fileAPath,
          `import "${fileBPath}";
import "${fileCPath}";
import "${fileDPath}";
import "${fileEPath}";
import "${fileFPath}";
`
        );
        await writeFile(fileBPath, "function a() {}; a();");
        await writeFile(
          fileCPath,
          `// coverage ignore next line
() => {};`
        );
        await writeFile(
          fileDPath,
          `// coverage ignore next line
() => {};`
        );
        await writeFile(fileEPath, "() => {};");
        await writeFile(fileFPath, "() => {};");

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
          stdout
            .toString()
            .replace(relative("", fileAPath), "<pathA>")
            .replace(relative("", fileBPath), "<pathB>")
            .replace(relative("", fileCPath), "<pathC>")
            .replace(relative("", fileDPath), "<pathD>"),
          new URL(
            `./test/snapshots/coverage-node/2-covered-ignored-uncovered-files-stdout.ans`,
            import.meta.url
          )
        );

        await snapshot(
          stderr
            .toString()
            .replace(relative("", fileEPath), "<pathE>")
            .replace(relative("", fileFPath), "<pathF>"),
          new URL(
            "./test/snapshots/coverage-node/2-covered-ignored-uncovered-files-stderr.ans",
            import.meta.url
          )
        );

        strictEqual(status, 1);
      });
    }
  );

  tests.add("`coverage-node` CLI with a script console log.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "index.mjs");

      await writeFile(filePath, 'console.log("Message.");');

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
        stdout
          .toString()
          .replace(relative("", filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
        new URL(
          `./test/snapshots/coverage-node/script-console-log-stdout.ans`,
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

      await writeFile(filePath, 'throw new Error("Error.");');

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

      await writeFile(
        filePath,
        `import { deprecate } from "node:util";

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

      await writeFile(filePath, "1;");

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
        `./test/snapshots/coverage-node/without-arguments-stderr.ans`,
        import.meta.url
      )
    );

    strictEqual(status, 1);
  });
};
