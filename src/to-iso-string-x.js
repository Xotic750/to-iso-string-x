import attempt from 'attempt-x';
import isDate from 'is-date-object';
import padStart from 'string-pad-start-x';
import map from 'array-map-x';
import arraySlice from 'array-slice-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';

/* eslint-disable-next-line no-restricted-globals */
const globalIsFinite = isFinite;
const {abs} = Math;
const $Date = Date;
const datePrototype = $Date.prototype;
const getTime = methodize(datePrototype.getTime);
const getUTCFullYear = methodize(datePrototype.getUTCFullYear);
const getUTCMonth = methodize(datePrototype.getUTCMonth);
const getUTCDate = methodize(datePrototype.getUTCDate);
const getUTCHours = methodize(datePrototype.getUTCHours);
const getUTCMinutes = methodize(datePrototype.getUTCMinutes);
const getUTCSeconds = methodize(datePrototype.getUTCSeconds);
const getUTCMilliseconds = methodize(datePrototype.getUTCMilliseconds);
const ntis = datePrototype.toISOString;
const methodizedToISOString = typeof ntis === 'function' && methodize(ntis);
const join = methodize([].join);
const EMPTY_STRING = '';
const indexOf = methodize(EMPTY_STRING.indexOf);

const test1 = function test1() {
  const res = attempt(methodizedToISOString, new $Date(0));

  return res.threw === false && res.value === '1970-01-01T00:00:00.000Z';
};

const test2 = function test2() {
  const res = attempt(methodizedToISOString, new $Date(-62198755200000));

  return res.threw === false && indexOf(res.value, '-000001') > -1;
};

const test3 = function test3() {
  const res = attempt(methodizedToISOString, new $Date(-1));

  return res.threw === false && res.value === '1969-12-31T23:59:59.999Z';
};

const isWorking = toBoolean(methodizedToISOString) && test1() && test2() && test3();

const assertIsDate = function assertIsDate(date) {
  if (isDate(date) === false) {
    throw new TypeError('toISOString called on incompatible receiver.');
  }

  return date;
};

const assertAdobe = function assertAdobe(date) {
  if (globalIsFinite(date) === false || globalIsFinite(getTime(date)) === false) {
    // Adobe Photoshop requires the second check.
    throw new RangeError('toISOString called on non-finite value.');
  }

  return date;
};

const stringify = function stringify(args) {
  const [date, month, year] = args;
  // the date time string format is specified in 15.9.1.15.
  const parts = [month + 1, getUTCDate(date), getUTCHours(date), getUTCMinutes(date), getUTCSeconds(date)];

  const result = map(parts, function iteratee(item) {
    // pad months, days, hours, minutes, and seconds to have two digits.
    return padStart(item, 2, '0');
  });

  const dateStr = `${year}-${join(arraySlice(result, 0, 2), '-')}`;
  // pad milliseconds to have three digits.
  const msStr = padStart(getUTCMilliseconds(date), 3, '0');
  const timeStr = `${join(arraySlice(result, 2), ':')}.${msStr}`;

  return `${dateStr}T${timeStr}Z`;
};

const patchedToIsoString = function toISOString(date) {
  assertIsDate(date);
  assertAdobe(date);

  return methodizedToISOString(date);
};

const getSign = function getSign(year) {
  if (year < 0) {
    return '-';
  }

  if (year > 9999) {
    return '+';
  }

  return EMPTY_STRING;
};

export const implementation = function toISOString(date) {
  assertIsDate(date);
  assertAdobe(date);

  let year = getUTCFullYear(date);
  let month = getUTCMonth(date);
  // see https://github.com/es-shims/es5-shim/issues/111
  /* eslint-disable-next-line no-bitwise */
  year += (month / 12) >> 0; // floor
  month = ((month % 12) + 12) % 12;

  const sign = getSign(year);

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
const $toISOString = isWorking ? patchedToIsoString : implementation;

export default $toISOString;
