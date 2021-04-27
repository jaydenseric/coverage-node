import { deepStrictEqual, throws } from 'assert';
import semver from '../../private/semver.mjs';

export default (tests) => {
  tests.add(
    '`reportCliError` with first argument `semver` not a string.',
    () => {
      throws(() => {
        semver(true);
      }, new TypeError('First argument `semver` must be a string.'));
    }
  );

  tests.add('`semver` with a simple version.', () => {
    deepStrictEqual(semver('1.2.3'), {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: undefined,
    });
  });

  tests.add('`semver` with a complex version.', () => {
    deepStrictEqual(semver('1.2.3-alpha.4+5'), {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha.4',
      build: '5',
    });
  });
};
