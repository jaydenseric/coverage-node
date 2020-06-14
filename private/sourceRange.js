'use strict';

/**
 * Gets info about a source code range, including line/column numbers and if
 * it’s ignored by a comment.
 * @kind function
 * @name sourceRange
 * @param {string} source Source code.
 * @param {number} startOffset Start character offset.
 * @param {number} endOffset End character offset.
 * @param {string} [ignoreNextLineComment=' coverage ignore next line'] Single line case-insensitive comment content to ignore ranges that start on the the next line.
 * @returns {SourceCodeRange} Source code range info.
 * @ignore
 */
module.exports = function sourceRange(
  source,
  startOffset,
  endOffset,
  ignoreNextLineComment = ' coverage ignore next line'
) {
  if (ignoreNextLineComment)
    var ignoreNextLineCommentLowerCase = `//${ignoreNextLineComment.toLowerCase()}`;

  const range = {
    start: { offset: startOffset },
    end: { offset: endOffset },
  };
  const lines = source.split(/^/gm);

  let lineOffset = 0;

  for (const [lineIndex, lineSource] of lines.entries()) {
    const nextLineOffset = lineOffset + lineSource.length;

    if (
      !('line' in range.start) &&
      startOffset >= lineOffset &&
      startOffset < nextLineOffset
    ) {
      range.start.line = lineIndex + 1;
      range.start.column = startOffset - lineOffset + 1;
      range.ignore =
        // Is ignoring enabled.
        !!ignoreNextLineComment &&
        // First line can’t be ignored.
        !!lineIndex &&
        // Does the previous line contain the case-insensitive comment to ignore
        // this line.
        lines[lineIndex - 1]
          .trim()
          .toLowerCase()
          .endsWith(ignoreNextLineCommentLowerCase);
    }

    if (endOffset >= lineOffset && endOffset < nextLineOffset) {
      range.end.line = lineIndex + 1;
      range.end.column = endOffset - lineOffset + 1;
      break;
    }

    lineOffset = nextLineOffset;
  }

  return range;
};
