import { deepStrictEqual, rejects } from 'assert';
import { spawn } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { disposableDirectory } from 'disposable-directory';
import childProcessPromise from '../../private/childProcessPromise.mjs';
import analyseCoverage from '../../public/analyseCoverage.mjs';

export default (tests) => {
  tests.add(
    '`reportCliError` with first argument `coverageDirPath` not a string.',
    async () => {
      await rejects(
        analyseCoverage(true),
        new TypeError('First argument `coverageDirPath` must be a string.')
      );
    }
  );

  tests.add(
    '`analyseCoverage` ignores `node_modules` directory files.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const coverageDirPath = join(tempDirPath, 'coverage');
        const nodeModulesDirPath = join(tempDirPath, 'node_modules');
        const nodeModulesModuleName = 'a';
        const nodeModulesModuleMainFileName = 'index.mjs';
        const nodeModulesModuleMainFilePath = join(
          nodeModulesDirPath,
          nodeModulesModuleName,
          nodeModulesModuleMainFileName
        );

        await fs.promises.mkdir(nodeModulesDirPath);
        await fs.promises.mkdir(
          join(nodeModulesDirPath, nodeModulesModuleName)
        );
        await fs.promises.writeFile(nodeModulesModuleMainFilePath, '1;');

        await childProcessPromise(
          spawn('node', [nodeModulesModuleMainFilePath], {
            stdio: 'inherit',
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

  tests.add('`analyseCoverage` ignores `test` directory files.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, 'coverage');
      const dirPath = join(tempDirPath, 'test');
      const filePath = join(dirPath, 'index.mjs');

      await fs.promises.mkdir(dirPath);
      await fs.promises.writeFile(filePath, '1;');

      await childProcessPromise(
        spawn('node', [filePath], {
          stdio: 'inherit',
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
    '`analyseCoverage` ignores files with `.test` prefixed before the extension.',
    async () => {
      await disposableDirectory(async (tempDirPath) => {
        const coverageDirPath = join(tempDirPath, 'coverage');
        const filePath = join(tempDirPath, 'index.test.mjs');

        await fs.promises.writeFile(filePath, '1;');

        await childProcessPromise(
          spawn('node', [filePath], {
            stdio: 'inherit',
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

  tests.add('`analyseCoverage` ignores files named `test`.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, 'coverage');
      const filePath = join(tempDirPath, 'test.mjs');

      await fs.promises.writeFile(filePath, '1;');

      await childProcessPromise(
        spawn('node', [filePath], {
          stdio: 'inherit',
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

  tests.add('`analyseCoverage` with 1 covered file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, 'coverage');
      const filePath = join(tempDirPath, 'index.mjs');

      await fs.promises.writeFile(filePath, '1;');

      await childProcessPromise(
        spawn('node', [filePath], {
          stdio: 'inherit',
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

  tests.add('`analyseCoverage` with 1 uncovered file.', async () => {
    await disposableDirectory(async (tempDirPath) => {
      const coverageDirPath = join(tempDirPath, 'coverage');
      const filePath = join(tempDirPath, 'index.mjs');

      await fs.promises.writeFile(
        filePath,
        'function a() {}; function b() {};'
      );

      await childProcessPromise(
        spawn('node', [filePath], {
          stdio: 'inherit',
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
