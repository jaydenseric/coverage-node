import { deepStrictEqual, throws } from "assert";
import sourceRange from "../../private/sourceRange.mjs";

export default (tests) => {
  tests.add("`sourceRange` with first argument `source` not a string.", () => {
    throws(() => {
      sourceRange(true);
    }, new TypeError("First argument `source` must be a string."));
  });

  tests.add(
    "`sourceRange` with second argument `startOffset` not a number.",
    () => {
      throws(() => {
        sourceRange("a", true);
      }, new TypeError("Second argument `startOffset` must be a number."));
    }
  );

  tests.add(
    "`sourceRange` with third argument `endOffset` not a number.",
    () => {
      throws(() => {
        sourceRange("a", 0, true);
      }, new TypeError("Third argument `endOffset` must be a number."));
    }
  );

  tests.add(
    "`sourceRange` with fourth argument `ignoreNextLineComment` not a string or `false`.",
    () => {
      throws(() => {
        sourceRange("a", 0, 0, true);
      }, new TypeError("Fourth argument `ignoreNextLineComment` must be a string or `false`."));
    }
  );

  tests.add("`sourceRange` with a single char line.", () => {
    const source = "a";

    deepStrictEqual(sourceRange(source, 0, 0), {
      ignore: false,
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 0,
        line: 1,
        column: 1,
      },
    });
  });

  tests.add("`sourceRange` with a multi char line.", () => {
    const source = "abc";

    deepStrictEqual(sourceRange(source, 0, 2), {
      ignore: false,
      start: {
        offset: 0,
        line: 1,
        column: 1,
      },
      end: {
        offset: 2,
        line: 1,
        column: 3,
      },
    });
  });

  tests.add("`sourceRange` in multiple lines.", () => {
    const source = `abc

def
ghi
jkl`;

    deepStrictEqual(sourceRange(source, 9, 11), {
      ignore: false,
      start: {
        offset: 9,
        line: 4,
        column: 1,
      },
      end: {
        offset: 11,
        line: 4,
        column: 3,
      },
    });
  });

  tests.add("`sourceRange` across multiple lines.", () => {
    const source = `abc

def
ghi
jkl`;

    deepStrictEqual(sourceRange(source, 6, 11), {
      ignore: false,
      start: {
        offset: 6,
        line: 3,
        column: 2,
      },
      end: {
        offset: 11,
        line: 4,
        column: 3,
      },
    });
  });

  tests.add(
    "`sourceRange` with a default ignore comment, line exclusive.",
    () => {
      const source = `// coverage ignore next line
a`;

      deepStrictEqual(sourceRange(source, 29, 29), {
        ignore: true,
        start: {
          offset: 29,
          line: 2,
          column: 1,
        },
        end: {
          offset: 29,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add("`sourceRange` with a default ignore comment, line shared.", () => {
    const source = `let a // coverage ignore next line
b`;

    deepStrictEqual(sourceRange(source, 35, 35), {
      ignore: true,
      start: {
        offset: 35,
        line: 2,
        column: 1,
      },
      end: {
        offset: 35,
        line: 2,
        column: 1,
      },
    });
  });

  tests.add(
    "`sourceRange` with a default ignore comment, arbitrary capitalization, line exclusive.",
    () => {
      const source = `// Coverage Ignore Next Line
a`;

      deepStrictEqual(sourceRange(source, 29, 29), {
        ignore: true,
        start: {
          offset: 29,
          line: 2,
          column: 1,
        },
        end: {
          offset: 29,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add(
    "`sourceRange` with a default ignore comment, arbitrary capitalization, line shared.",
    () => {
      const source = `let a // Coverage Ignore Next Line
b`;

      deepStrictEqual(sourceRange(source, 35, 35), {
        ignore: true,
        start: {
          offset: 35,
          line: 2,
          column: 1,
        },
        end: {
          offset: 35,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add(
    "`sourceRange` with a custom ignore comment, line exclusive.",
    () => {
      const source = `// a
a`;

      deepStrictEqual(sourceRange(source, 5, 5, " a"), {
        ignore: true,
        start: {
          offset: 5,
          line: 2,
          column: 1,
        },
        end: {
          offset: 5,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add("`sourceRange` with a custom ignore comment, line shared.", () => {
    const source = `let a // a
b`;

    deepStrictEqual(sourceRange(source, 11, 11, " a"), {
      ignore: true,
      start: {
        offset: 11,
        line: 2,
        column: 1,
      },
      end: {
        offset: 11,
        line: 2,
        column: 1,
      },
    });
  });

  tests.add(
    "`sourceRange` with a custom ignore comment, arbitrary capitalization, line exclusive.",
    () => {
      const source = `// A
a`;

      deepStrictEqual(sourceRange(source, 5, 5, " a"), {
        ignore: true,
        start: {
          offset: 5,
          line: 2,
          column: 1,
        },
        end: {
          offset: 5,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add(
    "`sourceRange` with a custom ignore comment, arbitrary capitalization, line shared.",
    () => {
      const source = `let a // A
b`;

      deepStrictEqual(sourceRange(source, 11, 11, " a"), {
        ignore: true,
        start: {
          offset: 11,
          line: 2,
          column: 1,
        },
        end: {
          offset: 11,
          line: 2,
          column: 1,
        },
      });
    }
  );

  tests.add("`sourceRange` with ignore comments disabled.", () => {
    const source = `// coverage ignore next line
a`;

    deepStrictEqual(sourceRange(source, 29, 29, false), {
      ignore: false,
      start: {
        offset: 29,
        line: 2,
        column: 1,
      },
      end: {
        offset: 29,
        line: 2,
        column: 1,
      },
    });
  });
};
