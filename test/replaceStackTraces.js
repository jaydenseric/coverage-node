'use strict';

/**
 * Replaces Node.js `Error` stack traces in a multiline string.
 * @kind function
 * @name replaceStackTraces
 * @param {string} string Multiline string.
 * @param {string|Function} [replacer='$1<stack trace>'] String match replacer. Use `$1` at the start of a string replacer to preserve the original indentation.
 * @returns {string} The input string with stack traces replaced.
 * @ignore
 */
module.exports = function replaceStackTraces(
  string,
  replacer = '$1<stack trace>'
) {
  if (typeof string !== 'string')
    throw new TypeError('First argument `string` must be a string.');

  if (typeof replacer !== 'string' && typeof replacer !== 'function')
    throw new TypeError(
      'Second argument `replacer` must be a string or function.'
    );

  return string.replace(
    /(^ {2,})at (?:(?! \{$).)+(?:\r?\n\1at (?:(?! \{$).)+)*/gmu,
    replacer
  );
};
