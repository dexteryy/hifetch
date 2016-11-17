/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('error: 4', function () {

  it('from handler, promise style', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error4`,
      handler(json) {
        const a = 1;
        a.b = 2;
        return json;
      },
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(4);
      expect(res.error).to.be.an('error');
    };
    hifetch(fetchConfig).send()
      .catch(errorHandler)
      .then(() => {
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('from handler, callback style', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error4`,
      handler(json) {
        const a = 1;
        a.b = 2;
        return json;
      },
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(4);
      expect(res.error).to.be.an('error');
    };
    hifetch(Object.assign({}, fetchConfig, {
      error: errorHandler,
    })).send()
      .then(() => {
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('from success, promise style', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error4`,
    };
    const successHandler = res => {
      expect(res.status).to.be.equal(0);
      const a = 1;
      a.b = 2;
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(4);
      expect(res.error).to.be.an('error');
    };
    hifetch(Object.assign({}, fetchConfig, {
      success: successHandler,
    })).send()
      .catch(errorHandler)
      .then(() => {
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('from success, callback style', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error4`,
    };
    const successHandler = res => {
      expect(res.status).to.be.equal(0);
      const a = 1;
      a.b = 2;
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(4);
      expect(res.error).to.be.an('error');
    };
    hifetch(Object.assign({}, fetchConfig, {
      success: successHandler,
      error: errorHandler,
    })).send()
      .then(() => {
        done();
      }).catch(err => {
        console.log(err);
      });
  });

});
