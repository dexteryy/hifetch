
# hifetch

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Greenkeeper badge][greenkeeper-image]](https://greenkeeper.io/)

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/hifetch.svg
[nodei-image]: https://nodei.co/npm/hifetch.png?downloads=true
[npm-url]: https://npmjs.org/package/hifetch
[travis-image]: https://img.shields.io/travis/dexteryy/hifetch/master.svg
[travis-url]: https://travis-ci.org/dexteryy/hifetch
[dep-image]: https://david-dm.org/dexteryy/hifetch.svg
[dep-url]: https://david-dm.org/dexteryy/hifetch
[coveralls-image]: https://img.shields.io/coveralls/dexteryy/nodecube/master.svg
[coveralls-url]: https://coveralls.io/r/dexteryy/nodecube?branch=master
[greenkeeper-image]: https://badges.greenkeeper.io/dexteryy/hifetch.svg

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

A minimal higher-level wrapper around [Fetch](https://github.com/github/fetch) API

Built on top of [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch)

## Get started

```
npm install hifetch
```

Fetch, process and consume JSON response with custom options (e.g. timeout limit) and default options (e.g. Content-Type):

```javascript
import hifetch from 'hifetch';

hifetch({
  url: 'http://www.mydomain.com/users/1/',
  query: {
    mobile: true,
  },
  jwtToken,
  headers: { // custom headers
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000,
  // enableMeta: true,
}).send().then(res => {
  // res
}).catch(res => {
  console.log('error!', res.message);
  console.log('error code:', res.status);
  // 1 / 2 / 3 / 4 / 5 / 6, see "Error results"
});
```

Get meta data

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/',
  query: {
    mobile: true,
  },
  enableMeta: true,
}).send().then(meta => {
  // meta.data
  // meta.status
  // meta.statusText
  // meta.url
  // meta.headers
  // meta.response
});
```

Merge headers into JSON result

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/',
  mergeHeaders: { // pick response headers
    poweredBy: 'X-Powered-By',
  },
}).send().then(res => {
  // res.poweredBy
});
```

Fetch HTML string:

```javascript
hifetch({
  url: 'http://www.mydomain.com/profile/1/',
  query: {
    mobile: true,
  },
  responseType: 'html', // or 'text/html',
  parser(response) { // custom parser for Fetch API's response
    return response.text();
  },
```

Post JSON with urlencoded body

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByUrlencoded',
  method: 'post',
  query: {
    mobile: true,
  },
  data: {
    name: 'yy',
  },
```

Post JSON with JSON-encoded body

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByJSON',
  method: 'post',
  query: {
    mobile: true,
  },
  data: {
    name: 'yy',
  },
  dataType: 'json', // or 'application/json',
```

Post form-data body

```javascript
const formData = new FormData();
formData.append('name', 'yy');

hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByFormData',
  method: 'post',
  query: {
    mobile: true,
  },
  data: formData,
```

or

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByFormData',
  method: 'post',
  query: {
    mobile: true,
  },
  data: {
    name: 'yy',
  },
  dataType: 'form', // or 'multipart/form-data',
```

Post form-data body with files

```javascript
hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByFormData',
  method: 'post',
  query: {
    mobile: true,
  },
  data: {
    name: 'yy',
    avatar: imageFile,
  },
```

or

```javascript
const formData = new FormData();
formData.append('name', 'yy');
formData.append('photos', imageFile1);
formData.append('photos', imageFile2);

hifetch({
  url: 'http://www.mydomain.com/users/1/actions/createByFormData',
  method: 'post',
  query: {
    mobile: true,
  },
  data: formData,
```

Custom validator for acceptable HTTP response status code

```javascript
hifetch({
  //...
  validateStatus: status => status >= 200 && status < 300,
```

Custom validator and processor for response data

```javascript
hifetch({
  //...
  handler: (res, headers) => {
    if (res.xx) {
      throw new Error(res.xx);
    }
    return Object.assign(headers, data);
  },
```

### Options

* `url` - [required]
* `method` - default: `'get'`
* `query` - plain object
* `data` - plain object, FormData object or string. when using FormData, `dataType` can be omitted (always be 'multipart/form-data')
* `dataType` - custom `'Content-Type'` header, default: `'application/x-www-form-urlencoded'`
* `FormData` - [required in node.js environment] [FormData class](https://www.npmjs.com/package/form-data)
* `responseType` - custom `'Accept'` header, default: `'application/json'`
* `validateStatus` - custom validator for acceptable HTTP response status code, default: `status >= 200 && status < 300`
* `jwtToken` - add JWT header
* `headers` - other custom request headers
* `mergeHeaders` - plain object, pick response headers, for example: `{ poweredBy: 'X-Powered-By' }`
* `enableCookies` - automatically send cookies, default: false
* `disableCORS` - default: false
* `enableMeta` - embed result into a meta data with status, headers and response object. default: false
* `parser` - default: `response => response.json()`
* `timeout` - millisecond
* `handler` - custom validator and processor for response data
* `success` - default: `res => res`
* `error` - default: `res => Promise.reject(res)`

### Error results

```javascript
hifetch({
  // ...
}).send().catch({
  status, // error code
  message, // error log
  ...other, // more info
}) => {
  // ...
});
```

or

```javascript
hifetch({
  // ...
  error({
    status, // error code
    message, // error log
    ...other, // more info
  }) {
    // ...
  },
}).send();
```

Error code:

* 1 - [INTERNAL JS ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/error1.spec.js)
* 2 - [FETCH ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/error2.spec.js)
* 3 - [REMOTE ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/error3.spec.js)
* 4 - [CUSTOM JS ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/error4.spec.js)
* 5 - [TIMEOUT ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/error5.spec.js)
* 6 - [MANUAL ERROR], [test case](https://github.com/dexteryy/hifetch/blob/master/tests/actions.spec.js)



### Actions

* `send()` - return promise; automatically nterrupt latest outstanding request each time it's called
* `cancel()` - interrupt latest outstanding request, nothing happen
* `error()` - interrupt latest outstanding request, trigger error callback

See [actions.spec.js](https://github.com/dexteryy/hifetch/blob/master/tests/actions.spec.js) for more detail.

## Development

```
npm run lint
```

```
npm run test
```
