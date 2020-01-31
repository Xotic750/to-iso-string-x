function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import attempt from 'attempt-x';
import isDate from 'is-date-object';
import padStart from 'string-pad-start-x';
import map from 'array-map-x';
import arraySlice from 'array-slice-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
/* eslint-disable-next-line no-restricted-globals */

var globalIsFinite = isFinite;
var abs = Math.abs;
var $Date = Date;
var datePrototype = $Date.prototype;
var getTime = methodize(datePrototype.getTime);
var getUTCFullYear = methodize(datePrototype.getUTCFullYear);
var getUTCMonth = methodize(datePrototype.getUTCMonth);
var getUTCDate = methodize(datePrototype.getUTCDate);
var getUTCHours = methodize(datePrototype.getUTCHours);
var getUTCMinutes = methodize(datePrototype.getUTCMinutes);
var getUTCSeconds = methodize(datePrototype.getUTCSeconds);
var getUTCMilliseconds = methodize(datePrototype.getUTCMilliseconds);
var ntis = datePrototype.toISOString;
var methodizedToISOString = typeof ntis === 'function' && methodize(ntis);
var join = methodize([].join);
var EMPTY_STRING = '';
var indexOf = methodize(EMPTY_STRING.indexOf);

var test1 = function test1() {
  var res = attempt(methodizedToISOString, new $Date(0));
  return res.threw === false && res.value === '1970-01-01T00:00:00.000Z';
};

var test2 = function test2() {
  var res = attempt(methodizedToISOString, new $Date(-62198755200000));
  return res.threw === false && indexOf(res.value, '-000001') > -1;
};

var test3 = function test3() {
  var res = attempt(methodizedToISOString, new $Date(-1));
  return res.threw === false && res.value === '1969-12-31T23:59:59.999Z';
};

var isWorking = toBoolean(methodizedToISOString) && test1() && test2() && test3();

var assertIsDate = function assertIsDate(date) {
  if (isDate(date) === false) {
    throw new TypeError('toISOString called on incompatible receiver.');
  }

  return date;
};

var assertAdobe = function assertAdobe(date) {
  if (globalIsFinite(date) === false || globalIsFinite(getTime(date)) === false) {
    // Adobe Photoshop requires the second check.
    throw new RangeError('toISOString called on non-finite value.');
  }

  return date;
};

var stringify = function stringify(args) {
  var _args = _slicedToArray(args, 3),
      date = _args[0],
      month = _args[1],
      year = _args[2]; // the date time string format is specified in 15.9.1.15.


  var parts = [month + 1, getUTCDate(date), getUTCHours(date), getUTCMinutes(date), getUTCSeconds(date)];
  var result = map(parts, function iteratee(item) {
    // pad months, days, hours, minutes, and seconds to have two digits.
    return padStart(item, 2, '0');
  });
  var dateStr = "".concat(year, "-").concat(join(arraySlice(result, 0, 2), '-')); // pad milliseconds to have three digits.

  var msStr = padStart(getUTCMilliseconds(date), 3, '0');
  var timeStr = "".concat(join(arraySlice(result, 2), ':'), ".").concat(msStr);
  return "".concat(dateStr, "T").concat(timeStr, "Z");
};

var patchedToIsoString = function toISOString(date) {
  assertIsDate(date);
  assertAdobe(date);
  return methodizedToISOString(date);
};

var getSign = function getSign(year) {
  if (year < 0) {
    return '-';
  }

  if (year > 9999) {
    return '+';
  }

  return EMPTY_STRING;
};

export var implementation = function toISOString(date) {
  assertIsDate(date);
  assertAdobe(date);
  var year = getUTCFullYear(date);
  var month = getUTCMonth(date); // see https://github.com/es-shims/es5-shim/issues/111

  /* eslint-disable-next-line no-bitwise */

  year += month / 12 >> 0; // floor

  month = (month % 12 + 12) % 12;
  var sign = getSign(year);
  year = sign + padStart(abs(year), sign ? 6 : 4, '0');
  return stringify([date, month, year]);
};
/**
 * This method returns a string in simplified extended ISO format (ISO 8601),
 * which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or
 * ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively). The timezone is always zero UTC
 * offset, as denoted by the suffix "Z".
 *
 * @param {object} date - A $Date object.
 * @throws {TypeError} If date is not a $Date object.
 * @throws {RangeError} If date is invalid.
 * @returns {string} Given date in the ISO 8601 format according to universal time.
 */

var $toISOString = isWorking ? patchedToIsoString : implementation;
export default $toISOString;

//# sourceMappingURL=to-iso-string-x.esm.js.map