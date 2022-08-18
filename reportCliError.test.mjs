// @ts-check

import { strictEqual, throws } from "assert";
import { spawnSync } from "child_process";
import disposableDirectory from "disposable-directory";
import { writeFile } from "fs/promises";
import { join } from "path";
import replaceStackTraces from "replace-stack-traces";
import snapshot from "snapshot-assertion";
import { fileURLToPath } from "url";

import reportCliError from "./reportCliError.mjs";

const REPORT_CLI_ERROR_PATH = fileURLToPath(
  new URL("./reportCliError.mjs", import.meta.url)
);

/**
 * Adds `reportCliError` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add(
    "`reportCliError` with argument 1 `cliDescription` not a string.",
    () => {
      throws(() => {
        reportCliError(
          // @ts-expect-error Testing invalid.
          true,
          new Error("Message.")
        );
      }, new TypeError("Argument 1 `cliDescription` must be a string."));
    }
  );

  tests.add(
    "`reportCliError` with a `Error` instance, with stack.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "test.mjs");

        await writeFile(
          filePath,
          `import reportCliError from "${REPORT_CLI_ERROR_PATH}";

reportCliError("CLI", new Error("Message."));
`
        );

        const { stdout, stderr, status, error } = spawnSync(
          "node",
          [filePath],
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
            "./test/snapshots/reportCliError/Error-instance-with-stack-stderr.ans",
            import.meta.url
          )
        );

        strictEqual(status, 0);
      });
    }
  );

  tests.add(
    "`reportCliError` with a `Error` instance, without stack.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "test.mjs");

        await writeFile(
          filePath,
          `import reportCliError from "${REPORT_CLI_ERROR_PATH}";

const error = new Error("Message.");
delete error.stack;
reportCliError("CLI", error);
`
        );

        const { stdout, stderr, status, error } = spawnSync(
          "node",
          [filePath],
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
            "./test/snapshots/reportCliError/Error-instance-without-stack-stderr.ans",
            import.meta.url
          )
        );

        strictEqual(status, 0);
      });
    }
  );

  tests.add("`reportCliError` with a `CliError` instance.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "test.mjs");
      const cliErrorPath = fileURLToPath(
        new URL("./CliError.mjs", import.meta.url)
      );

      await writeFile(
        filePath,
        `import CliError from "${cliErrorPath}";
import reportCliError from "${REPORT_CLI_ERROR_PATH}";

reportCliError("CLI", new CliError("Message."));
`
      );

      const { stdout, stderr, status, error } = spawnSync("node", [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()),
        new URL(
          "./test/snapshots/reportCliError/CliError-instance-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 0);
    });
  });

  tests.add("`reportCliError` with a primitive value.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "test.mjs");

      await writeFile(
        filePath,
        `import reportCliError from "${REPORT_CLI_ERROR_PATH}";

reportCliError("CLI", "");
`
      );

      const { stdout, stderr, status, error } = spawnSync("node", [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()),
        new URL(
          "./test/snapshots/reportCliError/primitive-value-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 0);
    });
  });
};
