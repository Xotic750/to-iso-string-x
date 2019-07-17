import attempt from 'attempt-x';
import isDate from 'is-date-object';
import padStart from 'string-pad-start-x';
import map from 'array-map-x';
import arraySlice from 'array-slice-x';
import isFinite from 'is-finite-x';

const nativeToISOString = typeof Date.prototype.toISOString === 'function' && Date.prototype.toISOString;

let isWorking;

if (nativeToISOString) {
  let res = attempt.call(new Date(0), nativeToISOString);
  isWorking = res.threw === false && res.value === '1970-01-01T00:00:00.000Z';

  if (isWorking) {
    res = attempt.call(new Date(-62198755200000), nativeToISOString);
    isWorking = res.threw === false && res.value.indexOf('-000001') > -1;
  }

  if (isWorking) {
    res = attempt.call(new Date(-1), nativeToISOString);
    isWorking = res.threw === false && res.value === '1969-12-31T23:59:59.999Z';
  }
}

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
let $toISOString;

if (isWorking) {
  $toISOString = function toISOString(date) {
    return nativeToISOString.call(date);
  };
} else {
  const {join} = Array.prototype;

  $toISOString = function toISOString(date) {
    if (isDate(date) === false) {
      throw new TypeError('toISOString called on incompatible receiver.');
    }

    if (isFinite(date) === false || isFinite(date.getTime()) === false) {
      // Adope Photoshop requires the second check.
      throw new RangeError('toISOString called on non-finite value.');
    }

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    // see https://github.com/es-shims/es5-shim/issues/111
    /* eslint-disable-next-line no-bitwise */
    year += (month / 12) >> 0; // floor
    month = ((month % 12) + 12) % 12;

    // the date time string format is specified in 15.9.1.15.
    const parts = [month + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];

    let sign;

    if (year < 0) {
      sign = '-';
    } else if (year > 9999) {
      sign = '+';
    } else {
      sign = '';
    }

    year = sign + padStart(Math.abs(year), sign ? 6 : 4, '0');
    const result = map(parts, function _mapper(item) {
      // pad months, days, hours, minutes, and seconds to have two digits.
      return padStart(item, 2, '0');
    });

    const dateStr = `${year}-${join.call(arraySlice(result, 0, 2), '-')}`;
    // pad milliseconds to have three digits.
    const msStr = padStart(date.getUTCMilliseconds(), 3, '0');
    const timeStr = `${join.call(arraySlice(result, 2), ':')}.${msStr}`;

    return `${dateStr}T${timeStr}Z`;
  };
}

const tis = $toISOString;

export default tis;
