'use strict';

const { strictEqual, throws } = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const { join, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');
const reportCliError = require('../../private/reportCliError');
const replaceStackTraces = require('../replaceStackTraces');

const REPORT_CLI_ERROR_PATH = resolve(
  __dirname,
  '../../private/reportCliError'
);

module.exports = (tests) => {
  tests.add(
    '`reportCliError` with first argument `cliDescription` not a string.',
    () => {
      throws(() => {
        reportCliError(true);
      }, new TypeError('First argument `cliDescription` must be a string.'));
    }
  );

  tests.add(
    '`reportCliError` with a `Error` instance, with stack.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, 'test.js');

        await fs.promises.writeFile(
          filePath,
          `const reportCliError = require('${REPORT_CLI_ERROR_PATH}');
reportCliError('CLI', new Error('Message.'));`
        );

        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [filePath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: 1,
            },
          }
        );

        if (error) throw error;

        strictEqual(stdout.toString(), '');

        await snapshot(
          replaceStackTraces(stderr.toString()),
          resolve(
            __dirname,
            '../snapshots/reportCliError/Error-instance-with-stack-stderr.ans'
          )
        );

        strictEqual(status, 0);
      });
    }
  );

  tests.add(
    '`reportCliError` with a `Error` instance, without stack.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const filePath = join(tempDirPath, 'test.js');

        await fs.promises.writeFile(
          filePath,
          `const reportCliError = require('${REPORT_CLI_ERROR_PATH}');
const error = new Error('Message.');
delete error.stack;
reportCliError('CLI', error);`
        );

        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [filePath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: 1,
            },
          }
        );

        if (error) throw error;

        strictEqual(stdout.toString(), '');

        await snapshot(
          replaceStackTraces(stderr.toString()),
          resolve(
            __dirname,
            '../snapshots/reportCliError/Error-instance-without-stack-stderr.ans'
          )
        );

        strictEqual(status, 0);
      });
    }
  );

  tests.add('`reportCliError` with a `CliError` instance.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'test.js');
      const cliErrorPath = resolve(__dirname, '../../private/CliError');

      await fs.promises.writeFile(
        filePath,
        `const CliError = require('${cliErrorPath}');
const reportCliError = require('${REPORT_CLI_ERROR_PATH}');
reportCliError('CLI', new CliError('Message.'));`
      );

      const { stdout, stderr, status, error } = spawnSync('node', [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), '');

      await snapshot(
        replaceStackTraces(stderr.toString()),
        resolve(
          __dirname,
          '../snapshots/reportCliError/CliError-instance-stderr.ans'
        )
      );

      strictEqual(status, 0);
    });
  });

  tests.add('`reportCliError` with a primitive value.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'test.js');

      await fs.promises.writeFile(
        filePath,
        `const reportCliError = require('${REPORT_CLI_ERROR_PATH}');
reportCliError('CLI', '');`
      );

      const { stdout, stderr, status, error } = spawnSync('node', [filePath], {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      });

      if (error) throw error;

      strictEqual(stdout.toString(), '');

      await snapshot(
        replaceStackTraces(stderr.toString()),
        resolve(
          __dirname,
          '../snapshots/reportCliError/primitive-value-stderr.ans'
        )
      );

      strictEqual(status, 0);
    });
  });
};
