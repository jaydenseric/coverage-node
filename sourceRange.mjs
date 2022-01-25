/**
 * Gets info about a source code range, including line/column numbers and if
 * it’s ignored by a comment.
 * @kind function
 * @name sourceRange
 * @param {string} source Source code.
 * @param {number} startOffset Start character offset.
 * @param {number} endOffset End character offset.
 * @param {string|boolean} [ignoreNextLineComment=" coverage ignore next line"] Single line case-insensitive comment content to ignore ranges that start on the the next line, or `false` to disable ignore comments.
 * @returns {SourceCodeRange} Source code range info.
 * @ignore
 */
export default function sourceRange(
  source,
  startOffset,
  endOffset,
  ignoreNextLineComment = " coverage ignore next line"
) {
  if (typeof source !== "string")
    throw new TypeError("First argument `source` must be a string.");

  if (typeof startOffset !== "number")
    throw new TypeError("Second argument `startOffset` must be a number.");

  if (typeof endOffset !== "number")
    throw new TypeError("Third argument `endOffset` must be a number.");

  if (
    typeof ignoreNextLineComment !== "string" &&
    ignoreNextLineComment !== false
  )
    throw new TypeError(
      "Fourth argument `ignoreNextLineComment` must be a string or `false`."
    );

  if (ignoreNextLineComment)
    var ignoreNextLineCommentLowerCase = `//${ignoreNextLineComment.toLowerCase()}`;

  const range = {
    start: { offset: startOffset },
    end: { offset: endOffset },
  };
  const lines = source.split(/^/gmu);

  let lineOffset = 0;

  for (const [lineIndex, lineSource] of lines.entries()) {
    const nextLineOffset = lineOffset + lineSource.length;

    if (
      !("line" in range.start) &&
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
}
