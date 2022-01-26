// @ts-check

/**
 * Gets info about a source code range, including line/column numbers and if
 * it’s ignored by a comment.
 * @param {string} source Source code.
 * @param {number} startOffset Start character offset.
 * @param {number} endOffset End character offset.
 * @param {string | false} [ignoreNextLineComment] Single line
 *   case-insensitive comment content to ignore ranges that start on the the
 *   next line, or `false` to disable ignore comments. Defaults to
 *   `" coverage ignore next line"`.
 * @returns {SourceCodeRange} Source code range info.
 */
export default function sourceRange(
  source,
  startOffset,
  endOffset,
  ignoreNextLineComment = " coverage ignore next line"
) {
  if (typeof source !== "string")
    throw new TypeError("Argument 1 `source` must be a string.");

  if (typeof startOffset !== "number")
    throw new TypeError("Argument 2 `startOffset` must be a number.");

  if (typeof endOffset !== "number")
    throw new TypeError("Argument 3 `endOffset` must be a number.");

  if (
    typeof ignoreNextLineComment !== "string" &&
    ignoreNextLineComment !== false
  )
    throw new TypeError(
      "Argument 4 `ignoreNextLineComment` must be a string or `false`."
    );

  const ignoreNextLineCommentLowerCase = ignoreNextLineComment
    ? `//${ignoreNextLineComment.toLowerCase()}`
    : null;

  /** @type {SourceCodeRange["ignore"]} */
  let ignore = false;

  /** @type {SourceCodeLocation["line"] | undefined} */
  let startLine;

  /** @type {SourceCodeLocation["column"] | undefined} */
  let startColumn;

  /** @type {SourceCodeLocation["line"] | undefined} */
  let endLine;

  /** @type {SourceCodeLocation["column"] | undefined} */
  let endColumn;

  const lines = source.split(/^/gmu);

  let lineOffset = 0;

  for (const [lineIndex, lineSource] of lines.entries()) {
    const nextLineOffset = lineOffset + lineSource.length;

    if (
      !startLine &&
      startOffset >= lineOffset &&
      startOffset < nextLineOffset
    ) {
      startLine = lineIndex + 1;
      startColumn = startOffset - lineOffset + 1;

      if (
        // Ignoring is enabled.
        ignoreNextLineCommentLowerCase &&
        // It’s not the first line that can’t be ignored, because there can’t be
        // an ignore comment on the previous line.
        lineIndex &&
        // The previous line contains the case-insensitive comment to ignore
        // this line.
        lines[lineIndex - 1]
          .trim()
          .toLowerCase()
          .endsWith(ignoreNextLineCommentLowerCase)
      )
        ignore = true;
    }

    if (endOffset >= lineOffset && endOffset < nextLineOffset) {
      endLine = lineIndex + 1;
      endColumn = endOffset - lineOffset + 1;
      break;
    }

    lineOffset = nextLineOffset;
  }

  return {
    ignore,
    start: {
      offset: startOffset,
      line: /** @type {number} */ (startLine),
      column: /** @type {number} */ (startColumn),
    },
    end: {
      offset: endOffset,
      line: /** @type {number} */ (endLine),
      column: /** @type {number} */ (endColumn),
    },
  };
}

/**
 * Source code location.
 * @typedef {object} SourceCodeLocation
 * @prop {number} offset Character offset.
 * @prop {number} line Line number.
 * @prop {number} column Column number.
 */

/**
 * Source code range details.
 * @typedef {object} SourceCodeRange
 * @prop {boolean} ignore Should it be ignored.
 * @prop {SourceCodeLocation} start Start location.
 * @prop {SourceCodeLocation} end End location.
 */
