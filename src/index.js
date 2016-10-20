
import 'babel-polyfill';
import 'isomorphic-fetch';
import qs from 'qs';

class Hifetch {

  static defaultConfig = {
    url: '',
    method: 'get',
    query: null,
    data: '',
    dataType: 'application/x-www-form-urlencoded',
    parser(response) {
      return response.json();
    },
    responseType: 'application/json',
    timeout: 0,
    handler: null,
    success: null,
    error: null,
  };

  constructor(opt) {
    this._config = Object.assign({}, Hifetch.defaultConfig, opt);
    const {
      query,
      method,
      responseType,
      dataType,
      data,
    } = this._config;
    const validMethod = method.toLowerCase();
    if (validMethod === 'post') {
      let dataString;
      if (typeof data === 'object') {
        if (dataType.indexOf(Hifetch.defaultConfig.dataType) !== -1) {
          dataString = qs.stringify(data);
        } else if (dataType.indexOf('json') !== -1) {
          dataString = JSON.stringify(data);
        }
      }
      this._fetchOpt = {
        method: 'POST',
        headers: {
          Accept: responseType,
          'Content-Type': dataType,
        },
        body: dataString || data,
      };
    } else {
      this._fetchOpt = {
        headers: {
          Accept: responseType,
        },
      };
    }
    this._queryString = query ? qs.stringify(query) : '';
  }

  send() {
    const {
      url,
      timeout,
      parser,
      handler,
      success,
      error,
    } = this._config;
    const current = this._current = uuid();
    return new Promise((resolve, reject) => {
      if (timeout) {
        setTimeout(() => {
          if (current === this._current) {
            reject('timeout');
          }
        }, timeout);
      }
      return fetch(
        this._queryString ? `${url}?${this._queryString}` : url,
        this._fetchOpt,
      ).then(res => {
        if (current === this._current) {
          resolve(res);
        }
      }).catch(res => {
        if (current === this._current) {
          reject(res);
        }
      });
    }).then(handleResponse).then(parser).then(data => {
      try {
        if (typeof data === 'object' && data.status) {
          return error({
            status: 3,
            message: `[REMOTE ERROR] status: ${data.status} message: ${data.message}`,
            data,
          });
        }
        const result = handler ? handler(data) : data;
        return success(result);
      } catch (err) {
        return error({
          status: 4,
          message: `[CUSTOM JS ERROR] ${clearErrorMessage(err)}`,
          error: err,
        });
      }
    }).catch(err => {
      if (err === 'timeout') {
        return error({
          status: 5,
          message: `[TIMEOUT ERROR] limit: ${timeout / 1000}s`,
          timeout,
        });
      }
      const {
        status: httpStatus,
        statusText: httpStatusText,
      } = err.response || {};
      if (httpStatus) {
        return error({
          status: 2,
          message: `[FETCH ERROR] ${httpStatus} ${httpStatusText}`,
          httpStatus,
          httpStatusText,
        });
      }
      return error({
        status: 1,
        message: `[INTERNAL JS ERROR] ${clearErrorMessage(err)}`,
        error: err,
      });
    });
  }

  cancel() {
    this._current = null;
  }

  error(customError) {
    const {
      error,
    } = this._config;
    this._current = null;
    return error({
      status: 6,
      message: `[MANUAL ERROR] ${clearErrorMessage(customError)}`,
      customError,
    });
  }

}

function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const err = new Error(response.statusText);
  err.response = response;
  throw err;
}

function uuid() {
  return new Date().getTime() * 1000 + Math.floor(Math.random() * 1000);
}

function clearErrorMessage(err) {
  return err.toString(); // .replace(/.+:\s*/, '');
}

function hifetch(opt) {
  return new Hifetch(opt);
}

hifetch.Class = Hifetch;

export default hifetch;
