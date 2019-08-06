<a
  href="https://travis-ci.org/Xotic750/to-iso-string-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/to-iso-string-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/to-iso-string-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/to-iso-string-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/to-iso-string-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/to-iso-string-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/to-iso-string-x"
  title="npm version">
<img src="https://badge.fury.io/js/to-iso-string-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/to-iso-string-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/to-iso-string-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/to-iso-string-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/to-iso-string-x?branch=master"
  alt="bettercodehub score" height="18">
</a>
<a
  href="https://coveralls.io/github/Xotic750/to-iso-string-x?branch=master"
  title="Coverage Status">
<img src="https://coveralls.io/repos/github/Xotic750/to-iso-string-x/badge.svg?branch=master"
  alt="Coverage Status" height="18">
</a>

<a name="module_to-iso-string-x"></a>

## to-iso-string-x

Cross-browser toISOString support.

<a name="exp_module_to-iso-string-x--module.exports"></a>

### `module.exports` ⇒ <code>string</code> ⏏

This method returns a string in simplified extended ISO format (ISO 8601),
which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or
±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively). The timezone is always zero UTC
offset, as denoted by the suffix "Z".

**Kind**: Exported member  
**Returns**: <code>string</code> - Given date in the ISO 8601 format according to universal time.  
**Throws**:

- <code>TypeError</code> If date is not a Date object.
- <code>RangeError</code> If date is invalid.

| Param | Type                | Description    |
| ----- | ------------------- | -------------- |
| date  | <code>Object</code> | A Date object. |

**Example**

```js
import toISOString =from 'to-iso-string-x';

toISOString(new Date(0)); // '1970-01-01T00:00:00.000Z'
```
