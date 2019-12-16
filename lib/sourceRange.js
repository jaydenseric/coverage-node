'use strict'

module.exports =
  /**
   * Gets info about a source code range, including line/column numbers and if
   * it’s ignored by a comment.
   * @kind function
   * @name sourceRange
   * @param {string} source Source code.
   * @param {number} startOffset Start character offset.
   * @param {number} endOffset End character offset.
   * @param {string} [ignoreNextLineComment=' coverage ignore next line'] Single line comment content to ignore ranges that start on the the next line.
   * @returns {SourceCodeRange} Source code range info.
   * @ignore
   */
  function sourceRange(
    source,
    startOffset,
    endOffset,
    ignoreNextLineComment = ' coverage ignore next line'
  ) {
    const range = {
      start: { offset: startOffset },
      end: { offset: endOffset }
    }
    const lines = source.split(/^/gm)

    let lineOffset = 0

    for (const [index, lineSource] of lines.entries()) {
      const nextLineOffset = lineOffset + lineSource.length

      if (
        !('line' in range.start) &&
        startOffset >= lineOffset &&
        startOffset < nextLineOffset
      ) {
        range.start.line = index + 1
        range.start.column = startOffset - lineOffset + 1
        range.ignore =
          !!ignoreNextLineComment &&
          !!index &&
          lines[index - 1].trim().toLowerCase() ===
            `//${ignoreNextLineComment}`.toLowerCase()
      }

      if (endOffset >= lineOffset && endOffset < nextLineOffset) {
        range.end.line = index + 1
        range.end.column = endOffset - lineOffset + 1
        break
      }

      lineOffset = nextLineOffset
    }

    return range
  }
