// @ts-check

import { deepStrictEqual, throws } from "assert";
import semver from "./semver.mjs";

/**
 * Adds `semver` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`semver` with argument 1 `semver` not a string.", () => {
    throws(() => {
      semver(
        // @ts-expect-error Testing invalid.
        true
      );
    }, new TypeError("Argument 1 `semver` must be a string."));
  });

  tests.add("`semver` with argument 1 `semver` not a semver string.", () => {
    throws(() => {
      semver("");
    }, new TypeError("Argument 1 `semver` must be a semver string."));
  });

  tests.add("`semver` with a simple version.", () => {
    deepStrictEqual(semver("1.2.3"), {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: undefined,
    });
  });

  tests.add("`semver` with a complex version.", () => {
    deepStrictEqual(semver("1.2.3-alpha.4+5"), {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: "alpha.4",
      build: "5",
    });
  });
};
