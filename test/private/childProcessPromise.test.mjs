import { rejects } from 'assert';
import childProcessPromise from '../../private/childProcessPromise.mjs';

export default (tests) => {
  tests.add(
    '`childProcessPromise` with first argument `childProcess` not a `ChildProcess` instance.',
    async () => {
      await rejects(
        childProcessPromise(true),
        new TypeError(
          'First argument `childProcess` must be a `ChildProcess` instance.'
        )
      );
    }
  );
};
