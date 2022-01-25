import { strictEqual, throws } from "assert";
import { spawnSync } from "child_process";
import fs from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import disposableDirectory from "disposable-directory";
import snapshot from "snapshot-assertion";
import reportCliError from "../../private/reportCliError.mjs";
import replaceStackTraces from "../replaceStackTraces.mjs";

const REPORT_CLI_ERROR_PATH = fileURLToPath(
  new URL("../../private/reportCliError.mjs", import.meta.url)
);

export default (tests) => {
  tests.add(
    "`reportCliError` with first argument `cliDescription` not a string.",
    () => {
      throws(() => {
        reportCliError(true);
      }, new TypeError("First argument `cliDescription` must be a string."));
    }
  );

  tests.add(
    "`reportCliError` with a `Error` instance, with stack.",
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, "test.mjs");

        await fs.promises.writeFile(
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
              FORCE_COLOR: 1,
            },
          }
        );

        if (error) throw error;

        strictEqual(stdout.toString(), "");

        await snapshot(
          replaceStackTraces(stderr.toString()),
          new URL(
            "../snapshots/reportCliError/Error-instance-with-stack-stderr.ans",
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

        await fs.promises.writeFile(
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
              FORCE_COLOR: 1,
            },
          }
        );

        if (error) throw error;

        strictEqual(stdout.toString(), "");

        await snapshot(
          replaceStackTraces(stderr.toString()),
          new URL(
            "../snapshots/reportCliError/Error-instance-without-stack-stderr.ans",
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
        new URL("../../private/CliError.mjs", import.meta.url)
      );

      await fs.promises.writeFile(
        filePath,
        `import CliError from "${cliErrorPath}";
import reportCliError from "${REPORT_CLI_ERROR_PATH}";

reportCliError("CLI", new CliError("Message."));
`
      );

      const { stdout, stderr, status, error } = spawnSync("node", [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()),
        new URL(
          "../snapshots/reportCliError/CliError-instance-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 0);
    });
  });

  tests.add("`reportCliError` with a primitive value.", async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, "test.mjs");

      await fs.promises.writeFile(
        filePath,
        `import reportCliError from "${REPORT_CLI_ERROR_PATH}";

reportCliError("CLI", "");
`
      );

      const { stdout, stderr, status, error } = spawnSync("node", [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), "");

      await snapshot(
        replaceStackTraces(stderr.toString()),
        new URL(
          "../snapshots/reportCliError/primitive-value-stderr.ans",
          import.meta.url
        )
      );

      strictEqual(status, 0);
    });
  });
};
