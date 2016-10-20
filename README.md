
# hifetch

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
  timeout: 10000,
  handler: res => {
    return res;
  },
  success: res => {
    console.log('success!', res.status);
    // 0
    return res;
  },
  error: res => {
    console.log('error!', res.message);
    console.log('error code:', res.status);
    // 1 / 2 / 3 / 4 / 5 / 6, see "Error results"
    return res;
  },
}).send().then(res => {
  console.log('done!', res);
});
```

Fetch HTML string:

```javascript
hifetch({
  url: 'http://www.mydomain.com/profile/1/',
  query: {
    mobile: true,
  },
  responseType: 'text/html',
  parser(response) {
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
  dataType: 'application/json',
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
  dataType: 'multipart/form-data',
```

### Error results

```javascript
hifetch({
  // ...
  error: ({
    status, // error code
    message, // error log
    ...other, // more info
  }) => {
```

Error code:

* 1 - [INTERNAL JS ERROR]
* 2 - [FETCH ERROR]
* 3 - [REMOTE ERROR]
* 4 - [CUSTOM JS ERROR]
* 5 - [TIMEOUT ERROR]
* 6 - [MANUAL ERROR]

See [errors.spec.js]() for more detail.

### Actions

* `send()` - return promise; automatically nterrupt latest outstanding request each time it's called
* `cancel()` - interrupt latest outstanding request, nothing happen
* `error()` - interrupt latest outstanding request, trigger error callback

See [actions.spec.js]() for more detail.

## Development

```
npm run lint
```

```
npm run test
```
