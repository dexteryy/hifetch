/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('errors', function () {

  it('status: 1', function (done) {
    nock(ROOT)
      .get('/error1')
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error1`,
      handler(json) {
        const a = 1;
        a.b = 2;
        return json;
      },
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(1);
      expect(res.error).to.be.an('error');
    };
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 2', function (done) {
    nock(ROOT)
      .get('/error2')
      .reply(500, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error2`,
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(2);
      expect(res.httpStatus).to.be.equal(500);
    };
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 3', function (done) {
    nock(ROOT)
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(3);
      expect(res.data.status).to.be.equal(-1);
    };
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 4 (from handler)', function (done) {
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
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 4 (from success)', function (done) {
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
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        success: successHandler,
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .then(successHandler)
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 5 (timeout)', function (done) {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 100,
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(5);
      expect(res.timeout).to.be.equal(100);
      return res;
    };
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        error: errorHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .catch(errorHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

  it('status: 5 (no timeout)', function (done) {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 300,
    };
    const successHandler = res => {
      expect(res.status).to.be.equal(0);
    };
    Promise.all([
      hifetch(Object.assign({}, fetchConfig, {
        success: successHandler,
      })).send(),
      hifetch(fetchConfig).send()
        .then(successHandler),
    ]).then(() => {
      done();
    }).catch(() => {
      done();
    });
  });

});
