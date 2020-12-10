'use strict';

const { rejects } = require('assert');
const childProcessPromise = require('../../private/childProcessPromise');

module.exports = (tests) => {
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
