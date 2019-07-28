import attempt from 'attempt-x';
import isDate from 'is-date-object';
import padStart from 'string-pad-start-x';
import map from 'array-map-x';
import arraySlice from 'array-slice-x';
import toBoolean from 'to-boolean-x';

/* eslint-disable-next-line no-restricted-globals */
const globalIsFinite = isFinite;
const {abs} = Math;
const {
  toISOString: ntis,
  getTime,
  getUTCFullYear,
  getUTCMonth,
  getUTCDate,
  getUTCHours,
  getUTCMinutes,
  getUTCSeconds,
  getUTCMilliseconds,
} = Date.prototype;
const nativeToISOString = typeof ntis === 'function' && ntis;
const {join} = [];

const test1 = function test1() {
  const res = attempt.call(new Date(0), nativeToISOString);

  return res.threw === false && res.value === '1970-01-01T00:00:00.000Z';
};

const test2 = function test2() {
  const res = attempt.call(new Date(-62198755200000), nativeToISOString);

  return res.threw === false && res.value.indexOf('-000001') > -1;
};

const test3 = function test3() {
  const res = attempt.call(new Date(-1), nativeToISOString);

  return res.threw === false && res.value === '1969-12-31T23:59:59.999Z';
};

const isWorking = toBoolean(nativeToISOString) && test1() && test2() && test3();

const assertIsDate = function assertIsDate(date) {
  if (isDate(date) === false) {
    throw new TypeError('toISOString called on incompatible receiver.');
  }

  return date;
};

const assertAdobe = function assertAdobe(date) {
  if (globalIsFinite(date) === false || globalIsFinite(getTime.call(date)) === false) {
    // Adobe Photoshop requires the second check.
    throw new RangeError('toISOString called on non-finite value.');
  }

  return date;
};

const stringify = function stringify(date, month, year) {
  // the date time string format is specified in 15.9.1.15.
  const parts = [month + 1, getUTCDate.call(date), getUTCHours.call(date), getUTCMinutes.call(date), getUTCSeconds.call(date)];

  const result = map(parts, function iteratee(item) {
    // pad months, days, hours, minutes, and seconds to have two digits.
    return padStart(item, 2, '0');
  });

  const dateStr = `${year}-${join.call(arraySlice(result, 0, 2), '-')}`;
  // pad milliseconds to have three digits.
  const msStr = padStart(getUTCMilliseconds.call(date), 3, '0');
  const timeStr = `${join.call(arraySlice(result, 2), ':')}.${msStr}`;

  return `${dateStr}T${timeStr}Z`;
};

const wrappedToISOString = function wrappedToISOString() {
  return function toISOString(date) {
    assertIsDate(date);
    assertAdobe(date);

    return nativeToISOString.call(date);
  };
};

const getSign = function getSign(year) {
  if (year < 0) {
    return '-';
  }

  if (year > 9999) {
    return '+';
  }

  return '';
};

const patchedToISOString = function patchedToISOString() {
  return function toISOString(date) {
    assertIsDate(date);
    assertAdobe(date);

    let year = getUTCFullYear.call(date);
    let month = getUTCMonth.call(date);
    // see https://github.com/es-shims/es5-shim/issues/111
    /* eslint-disable-next-line no-bitwise */
    year += (month / 12) >> 0; // floor
    month = ((month % 12) + 12) % 12;

    const sign = getSign(year);

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
const $toISOString = isWorking ? wrappedToISOString() : patchedToISOString();

export default $toISOString;
