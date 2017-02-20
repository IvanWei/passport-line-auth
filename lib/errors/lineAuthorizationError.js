/**
 * `LineAuthorizationError` error.
 *
 * LineAuthorizationError represents an error in response to an
 * authorization request on Line.
 *
 * References:
 *   - https://devdocs.line.me/en/#error-responses
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function LineAuthorizationError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'LineAuthorizationError';
  this.message = message;
  this.code = code;
  this.status = 500;
}

// Inherit from `Error`.
LineAuthorizationError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = LineAuthorizationError;
