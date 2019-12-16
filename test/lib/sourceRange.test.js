'use strict'

const assert = require('assert')
const sourceRange = require('../../lib/sourceRange')

module.exports = tests => {
  tests.add('`sourceRange` with a single char line.', () => {
    const source = `a`

    assert.deepStrictEqual(sourceRange(source, 0, 0), {
      ignore: false,
      start: {
        offset: 0,
        line: 1,
        column: 1
      },
      end: {
        offset: 0,
        line: 1,
        column: 1
      }
    })
  })

  tests.add('`sourceRange` with a multi char line.', () => {
    const source = `abc`

    assert.deepStrictEqual(sourceRange(source, 0, 2), {
      ignore: false,
      start: {
        offset: 0,
        line: 1,
        column: 1
      },
      end: {
        offset: 2,
        line: 1,
        column: 3
      }
    })
  })

  tests.add('`sourceRange` in multiple lines.', () => {
    const source = `abc

def
ghi
jkl`

    assert.deepStrictEqual(sourceRange(source, 9, 11), {
      ignore: false,
      start: {
        offset: 9,
        line: 4,
        column: 1
      },
      end: {
        offset: 11,
        line: 4,
        column: 3
      }
    })
  })

  tests.add('`sourceRange` across multiple lines.', () => {
    const source = `abc

def
ghi
jkl`

    assert.deepStrictEqual(sourceRange(source, 6, 11), {
      ignore: false,
      start: {
        offset: 6,
        line: 3,
        column: 2
      },
      end: {
        offset: 11,
        line: 4,
        column: 3
      }
    })
  })

  tests.add('`sourceRange` with a default ignore comment.', () => {
    const source = `// coverage ignore next line
a`

    assert.deepStrictEqual(sourceRange(source, 29, 29), {
      ignore: true,
      start: {
        offset: 29,
        line: 2,
        column: 1
      },
      end: {
        offset: 29,
        line: 2,
        column: 1
      }
    })
  })

  tests.add(
    '`sourceRange` with a default ignore comment, arbitrary capitalization.',
    () => {
      const source = `// Coverage Ignore Next Line
a`

      assert.deepStrictEqual(sourceRange(source, 29, 29), {
        ignore: true,
        start: {
          offset: 29,
          line: 2,
          column: 1
        },
        end: {
          offset: 29,
          line: 2,
          column: 1
        }
      })
    }
  )

  tests.add('`sourceRange` with a custom ignore comment.', () => {
    const source = `// a
a`

    assert.deepStrictEqual(sourceRange(source, 5, 5, ' a'), {
      ignore: true,
      start: {
        offset: 5,
        line: 2,
        column: 1
      },
      end: {
        offset: 5,
        line: 2,
        column: 1
      }
    })
  })

  tests.add(
    '`sourceRange` with a custom ignore comment, arbitrary capitalization.',
    () => {
      const source = `// A
a`

      assert.deepStrictEqual(sourceRange(source, 5, 5, ' a'), {
        ignore: true,
        start: {
          offset: 5,
          line: 2,
          column: 1
        },
        end: {
          offset: 5,
          line: 2,
          column: 1
        }
      })
    }
  )

  tests.add('`sourceRange` with ignore comments disabled.', () => {
    const source = `// coverage ignore next line
a`

    assert.deepStrictEqual(sourceRange(source, 29, 29, false), {
      ignore: false,
      start: {
        offset: 29,
        line: 2,
        column: 1
      },
      end: {
        offset: 29,
        line: 2,
        column: 1
      }
    })
  })
}
