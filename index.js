/**
 * @file Cross-browser toISOString support.
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-iso-string-x
 */

'use strict';

var nativeToISOString = Date.prototype.toISOString;

var $toISOString;
try {
  if (nativeToISOString.call(new Date(0)) !== '1970-01-01T00:00:00.000Z') {
    throw new Error('failed epoch');
  }

  $toISOString = function toISOString(date) {
    return nativeToISOString.call(date);
  };
} catch (ignore) {
  var isDate = require('is-date-object');
  var padStart = require('string.prototype.padstart');
  var map = require('array-map-x');

  $toISOString = function toISOString(date) {
    if (isDate(date) === false) {
      throw new TypeError('toISOString called on incompatible receiver.');
    }

    if (isFinite(date) === false || isFinite(date.getTime()) === false) {
      // Adope Photoshop requires the second check.
      throw new RangeError('toISOString called on non-finite value.');
    }

    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    // see https://github.com/es-shims/es5-shim/issues/111
    year += Math.floor(month / 12);
    month = ((month % 12) + 12) % 12;

    // the date time string format is specified in 15.9.1.15.
    var parts = [
      month + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ];

    var sign;
    if (year < 0) {
      sign = '-';
    } else if (year > 9999) {
      sign = '+';
    } else {
      sign = '';
    }

    year = sign + padStart(Math.abs(year), sign ? 6 : 4, '0');
    var result = map(parts, function _mapper(item) {
      // pad months, days, hours, minutes, and seconds to have two digits.
      return padStart(item, 2, '0');
    });

    var dateStr = year + '-' + result.slice(0, 2).join('-');
    // pad milliseconds to have three digits.
    var msStr = padStart(date.getUTCMilliseconds(date), 3, '0');
    var timeStr = result.slice(2).join(':') + '.' + msStr;

    return dateStr + 'T' + timeStr + 'Z';
  };
}

/**
 * This method returns a string in simplified extended ISO format (ISO 8601),
 * which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or
 * ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively). The timezone is always zero UTC
 * offset, as denoted by the suffix "Z".
 *
 * @param {Object} date A Date object.
 * @throws {TypeError} If date is not a Date object.
 * @throws {RangeError} If date is invalid.
 * @return {string} Given date in the ISO 8601 format according to universal time.

 * @example
 * var toISOString = require('to-iso-string-x');
 * toISOString(new Date(0)); // '1970-01-01T00:00:00.000Z'
 */
module.exports = $toISOString;
