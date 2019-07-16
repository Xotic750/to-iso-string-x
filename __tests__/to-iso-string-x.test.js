let toISOString;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  toISOString = require('../../index.js');
} else {
  toISOString = returnExports;
}

describe('toISOString', function() {
  let negativeDate;

  beforeEach(function() {
    const negativeCanned = [
      {
        dim: 31,
        getDay: 4,
        getTime: -3509827329600292,
        getUTCDay: 4,
      },
      {
        dim: 29,
        getDay: 0,
        getTime: -3509824651200292,
        getUTCDay: 0,
      },
      {
        dim: 31,
        getDay: 1,
        getTime: -3509822145600292,
        getUTCDay: 1,
      },
      {
        dim: 30,
        getDay: 4,
        getTime: -3509819467200292,
        getUTCDay: 4,
      },
      {
        dim: 31,
        getDay: 6,
        getTime: -3509816875200292,
        getUTCDay: 6,
      },
      {
        dim: 30,
        getDay: 2,
        getTime: -3509814196800292,
        getUTCDay: 2,
      },
      {
        dim: 31,
        getDay: 4,
        getTime: -3509811604800292,
        getUTCDay: 4,
      },
      {
        dim: 31,
        getDay: 0,
        getTime: -3509808926400292,
        getUTCDay: 0,
      },
      {
        dim: 30,
        getDay: 3,
        getTime: -3509806248000292,
        getUTCDay: 3,
      },
      {
        dim: 31,
        getDay: 5,
        getTime: -3509803656000292,
        getUTCDay: 5,
      },
      {
        dim: 30,
        getDay: 1,
        getTime: -3509800977600292,
        getUTCDay: 1,
      },
      {
        dim: 31,
        getDay: 3,
        getTime: -3509798385600292,
        getUTCDay: 3,
      },
    ];

    negativeDate = negativeCanned.map(function(item) {
      const dateFirst = new Date(item.getTime);
      const dateLast = new Date(item.getTime + (item.dim - 1) * 86400000);

      return {
        dates: [dateFirst, dateLast],
        days: [1, item.dim],
        getDay: [item.getDay, (item.getDay + item.dim - 1) % 7],
        getUTCDay: [item.getUTCDay, (item.getUTCDay + item.dim - 1) % 7],
      };
    });
  });

  it('should throw TypeError if not supplied a date object', function() {
    expect.assertions(1);
    expect.assertions(1);
    expect(function() {
      toISOString();
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      toISOString(undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      toISOString(null);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      toISOString(1);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      toISOString(true);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      toISOString({});
    }).toThrowErrorMatchingSnapshot();
  });

  it('should throw RangeError date object is invalid', function() {
    expect.assertions(1);
    expect.assertions(1);
    expect(function() {
      toISOString(new Date(NaN));
    }).toThrowErrorMatchingSnapshot();
  });

  it('should support extended years', function() {
    expect.assertions(1);
    expect.assertions(1);
    expect(toISOString(new Date(-62198755200000)).indexOf('-000001-01-01')).toBe(0);
    expect(toISOString(new Date(8.64e15)).indexOf('+275760-09-13')).toBe(0);
  });

  it('should return correct dates', function() {
    expect.assertions(1);
    expect.assertions(1); // Safari 5.1.5 "1969-12-31T23:59:59.-01Z"
    expect(toISOString(new Date(-1))).toBe('1969-12-31T23:59:59.999Z');

    negativeDate.forEach(function(item, index) {
      const m = index + 1;
      item.dates.forEach(function(date, idx) {
        const d = item.days[idx];
        expect(toISOString(date)).toBe(`-109252-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}T11:59:59.708Z`); // Opera 11.61/Opera 12 bug with Date#getUTCMonth
      });
    });
  });
});
