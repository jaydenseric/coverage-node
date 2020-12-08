'use strict';

const { strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const { join, relative, resolve } = require('path');
const { disposableDirectory } = require('disposable-directory');
const snapshot = require('snapshot-assertion');
const coverageSupported = require('../../public/coverageSupported');
const stripStackTraces = require('../stripStackTraces');

const SNAPSHOT_REPLACEMENT_FILE_PATH = '<file path>';
const SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION = '<process Node.js version>';

module.exports = (tests) => {
  tests.add('`coverage-node` CLI with 1 covered file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(filePath, "'use strict'");

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative('', filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        resolve(
          __dirname,
          `../snapshots/coverage-node/1-covered-file-coverage-${
            coverageSupported ? 'supported' : 'unsupported'
          }-stdout.ans`
        )
      );

      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);
    });
  });

  tests.add('`coverage-node` CLI with 1 ignored file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(
        filePath,
        `// coverage ignore next line
() => {}`
      );

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative('', filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        resolve(
          __dirname,
          `../snapshots/coverage-node/1-ignored-file-coverage-${
            coverageSupported ? 'supported' : 'unsupported'
          }-stdout.ans`
        )
      );

      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);
    });
  });

  tests.add('`coverage-node` CLI with 1 uncovered file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(filePath, '() => {}');

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
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
        resolve(
          __dirname,
          `../snapshots/coverage-node/1-uncovered-file-coverage-${
            coverageSupported ? 'supported' : 'unsupported'
          }-stdout.ans`
        )
      );

      if (coverageSupported)
        await snapshot(
          stderr
            .toString()
            .replace(relative('', filePath), SNAPSHOT_REPLACEMENT_FILE_PATH),
          resolve(
            __dirname,
            '../snapshots/coverage-node/1-uncovered-file-coverage-supported-stderr.ans'
          )
        );
      else strictEqual(stderr.toString(), '');

      strictEqual(status, coverageSupported ? 1 : 0);
    });
  });

  tests.add(
    '`coverage-node` CLI with 2 covered, ignored and uncovered files.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const fileAPath = join(tempDirPath, 'a.js');
        const fileBPath = join(tempDirPath, 'b.js');
        const fileCPath = join(tempDirPath, 'c.js');
        const fileDPath = join(tempDirPath, 'd.js');
        const fileEPath = join(tempDirPath, 'e.js');
        const fileFPath = join(tempDirPath, 'f.js');

        await fs.promises.writeFile(
          fileAPath,
          `require('${fileBPath}')
require('${fileCPath}')
require('${fileDPath}')
require('${fileEPath}')
require('${fileFPath}')`
        );
        await fs.promises.writeFile(fileBPath, 'function a() {}; a()');
        await fs.promises.writeFile(
          fileCPath,
          `// coverage ignore next line
() => {}`
        );
        await fs.promises.writeFile(
          fileDPath,
          `// coverage ignore next line
() => {}`
        );
        await fs.promises.writeFile(fileEPath, '() => {}');
        await fs.promises.writeFile(fileFPath, '() => {}');

        const { stdout, stderr, status, error } = spawnSync(
          'node',
          ['cli/coverage-node', fileAPath],
          {
            env: {
              ...process.env,
              FORCE_COLOR: 1,
            },
          }
        );

        if (error) throw error;

        await snapshot(
          coverageSupported
            ? stdout
                .toString()
                .replace(relative('', fileAPath), '<pathA>')
                .replace(relative('', fileBPath), '<pathB>')
                .replace(relative('', fileCPath), '<pathC>')
                .replace(relative('', fileDPath), '<pathD>')
            : stdout
                .toString()
                .replace(
                  process.version,
                  SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
                ),
          resolve(
            __dirname,
            `../snapshots/coverage-node/2-covered-ignored-uncovered-files-coverage-${
              coverageSupported ? 'supported' : 'unsupported'
            }-stdout.ans`
          )
        );

        if (coverageSupported)
          await snapshot(
            stderr
              .toString()
              .replace(relative('', fileEPath), '<pathE>')
              .replace(relative('', fileFPath), '<pathF>'),
            resolve(
              __dirname,
              '../snapshots/coverage-node/2-covered-ignored-uncovered-files-coverage-supported-stderr.ans'
            )
          );
        else strictEqual(stderr.toString(), '');

        strictEqual(status, coverageSupported ? 1 : 0);
      });
    }
  );

  tests.add('`coverage-node` CLI with a script console log.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(filePath, "console.log('Message.')");

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        }
      );

      if (error) throw error;

      await snapshot(
        coverageSupported
          ? stdout
              .toString()
              .replace(relative('', filePath), SNAPSHOT_REPLACEMENT_FILE_PATH)
          : stdout
              .toString()
              .replace(
                process.version,
                SNAPSHOT_REPLACEMENT_PROCESS_NODE_VERSION
              ),
        resolve(
          __dirname,
          `../snapshots/coverage-node/script-console-log-coverage-${
            coverageSupported ? 'supported' : 'unsupported'
          }-stdout.ans`
        )
      );

      strictEqual(stderr.toString(), '');
      strictEqual(status, 0);
    });
  });

  tests.add('`coverage-node` CLI with a script error.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(filePath, "throw new Error('Error.')");

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', filePath],
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
        stripStackTraces(stderr.toString()).replace(
          filePath,
          SNAPSHOT_REPLACEMENT_FILE_PATH
        ),
        resolve(__dirname, '../snapshots/coverage-node/script-error-stderr.ans')
      );

      strictEqual(status, 1);
    });
  });

  tests.add('`coverage-node` CLI with a valid Node.js option.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const filePath = join(tempDirPath, 'index.js');

      await fs.promises.writeFile(
        filePath,
        `const { deprecate } = require('util')
const deprecated = deprecate(() => {}, 'Deprecated!')
deprecated()`
      );

      const { stdout, stderr, status, error } = spawnSync(
        'node',
        ['cli/coverage-node', '--throw-deprecation', filePath],
        {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), '');
      strictEqual(
        stderr.toString().includes('DeprecationWarning: Deprecated!'),
        true
      );

      strictEqual(status, 1);
    });
  });

  tests.add('`coverage-node` CLI without arguments.', async () => {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      ['cli/coverage-node'],
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
      stripStackTraces(stderr.toString()),
      resolve(
        __dirname,
        `../snapshots/coverage-node/without-arguments-coverage-${
          coverageSupported ? 'supported' : 'unsupported'
        }-stderr.ans`
      )
    );

    strictEqual(status, 1);
  });
};
