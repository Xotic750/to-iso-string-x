import attempt from 'attempt-x';
import isDate from 'is-date-object';
import padStart from 'string-pad-start-x';
import map from 'array-map-x';
import arraySlice from 'array-slice-x';
import toBoolean from 'to-boolean-x';
/* eslint-disable-next-line no-restricted-globals */

var globalIsFinite = isFinite;
var abs = Math.abs;
var _Date$prototype = Date.prototype,
    ntis = _Date$prototype.toISOString,
    getTime = _Date$prototype.getTime,
    getUTCFullYear = _Date$prototype.getUTCFullYear,
    getUTCMonth = _Date$prototype.getUTCMonth,
    getUTCDate = _Date$prototype.getUTCDate,
    getUTCHours = _Date$prototype.getUTCHours,
    getUTCMinutes = _Date$prototype.getUTCMinutes,
    getUTCSeconds = _Date$prototype.getUTCSeconds,
    getUTCMilliseconds = _Date$prototype.getUTCMilliseconds;
var nativeToISOString = typeof ntis === 'function' && ntis;
var join = [].join;

var test1 = function test1() {
  var res = attempt.call(new Date(0), nativeToISOString);
  return res.threw === false && res.value === '1970-01-01T00:00:00.000Z';
};

var test2 = function test2() {
  var res = attempt.call(new Date(-62198755200000), nativeToISOString);
  return res.threw === false && res.value.indexOf('-000001') > -1;
};

var test3 = function test3() {
  var res = attempt.call(new Date(-1), nativeToISOString);
  return res.threw === false && res.value === '1969-12-31T23:59:59.999Z';
};

var isWorking = toBoolean(nativeToISOString) && test1() && test2() && test3();

var assertIsDate = function assertIsDate(date) {
  if (isDate(date) === false) {
    throw new TypeError('toISOString called on incompatible receiver.');
  }

  return date;
};

var assertAdobe = function assertAdobe(date) {
  if (globalIsFinite(date) === false || globalIsFinite(getTime.call(date)) === false) {
    // Adobe Photoshop requires the second check.
    throw new RangeError('toISOString called on non-finite value.');
  }

  return date;
};

var stringify = function stringify(date, month, year) {
  // the date time string format is specified in 15.9.1.15.
  var parts = [month + 1, getUTCDate.call(date), getUTCHours.call(date), getUTCMinutes.call(date), getUTCSeconds.call(date)];
  var result = map(parts, function iteratee(item) {
    // pad months, days, hours, minutes, and seconds to have two digits.
    return padStart(item, 2, '0');
  });
  var dateStr = "".concat(year, "-").concat(join.call(arraySlice(result, 0, 2), '-')); // pad milliseconds to have three digits.

  var msStr = padStart(getUTCMilliseconds.call(date), 3, '0');
  var timeStr = "".concat(join.call(arraySlice(result, 2), ':'), ".").concat(msStr);
  return "".concat(dateStr, "T").concat(timeStr, "Z");
};

var patchedToIsoString = function patchedToIsoString() {
  return function toISOString(date) {
    assertIsDate(date);
    assertAdobe(date);
    return nativeToISOString.call(date);
  };
};

var getSign = function getSign(year) {
  if (year < 0) {
    return '-';
  }

  if (year > 9999) {
    return '+';
  }

  return '';
};

export var implementation = function implementation() {
  return function toISOString(date) {
    assertIsDate(date);
    assertAdobe(date);
    var year = getUTCFullYear.call(date);
    var month = getUTCMonth.call(date); // see https://github.com/es-shims/es5-shim/issues/111

    /* eslint-disable-next-line no-bitwise */

    year += month / 12 >> 0; // floor

    month = (month % 12 + 12) % 12;
    var sign = getSign(year);
    year = sign + padStart(abs(year), sign ? 6 : 4, '0');
    return stringify(date, month, year);
  };
};
/**
 * This method returns a string in simplified extended ISO format (ISO 8601),
 * which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or
 * ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively). The timezone is always zero UTC
 * offset, as denoted by the suffix "Z".
 *
 * @param {object} date - A Date object.
 * @throws {TypeError} If date is not a Date object.
 * @throws {RangeError} If date is invalid.
 * @returns {string} Given date in the ISO 8601 format according to universal time.
 */

var $toISOString = isWorking ? patchedToIsoString() : implementation();
export default $toISOString;

//# sourceMappingURL=to-iso-string-x.esm.js.map