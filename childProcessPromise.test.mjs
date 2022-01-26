// @ts-check

import { rejects } from "assert";
import childProcessPromise from "./childProcessPromise.mjs";

/**
 * Adds `childProcessPromise` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add(
    "`childProcessPromise` with first argument `childProcess` not a `ChildProcess` instance.",
    async () => {
      await rejects(
        childProcessPromise(
          // @ts-expect-error Testing invalid.
          true
        ),
        new TypeError(
          "First argument `childProcess` must be a `ChildProcess` instance."
        )
      );
    }
  );
};
