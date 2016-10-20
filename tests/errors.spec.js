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
    hifetch({
      url: `${ROOT}/error1`,
      handler(json) {
        const a = 1;
        a.b = 2;
        return json;
      },
      error(res) {
        if (res.status === 4) {
          const a = 1;
          a.b = 2;
        }
        expect(res.status).to.be.equal(1);
        expect(res.error).to.be.an('error');
      },
    }).send().then(done).catch(done);
  });

  it('status: 2', function (done) {
    nock(ROOT)
      .get('/error2')
      .reply(500, {
        status: 0,
      });
    hifetch({
      url: `${ROOT}/error2`,
      error(res) {
        expect(res.status).to.be.equal(2);
        expect(res.httpStatus).to.be.equal(500);
      },
    }).send().then(done).catch(done);
  });

  it('status: 3', function (done) {
    nock(ROOT)
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    hifetch({
      url: `${ROOT}/error3`,
      error(res) {
        expect(res.status).to.be.equal(3);
        expect(res.data.status).to.be.equal(-1);
      },
    }).send().then(done).catch(done);
  });

  it('status: 4 (from handler)', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    hifetch({
      url: `${ROOT}/error4`,
      handler(json) {
        const a = 1;
        a.b = 2;
        return json;
      },
      error(res) {
        expect(res.status).to.be.equal(4);
        expect(res.error).to.be.an('error');
      },
    }).send().then(done).catch(done);
  });

  it('status: 4 (from success)', function (done) {
    nock(ROOT)
      .get('/error4')
      .reply(200, {
        status: 0,
      });
    hifetch({
      url: `${ROOT}/error4`,
      success(res) {
        expect(res.status).to.be.equal(0);
        const a = 1;
        a.b = 2;
      },
      error(res) {
        expect(res.status).to.be.equal(4);
        expect(res.error).to.be.an('error');
      },
    }).send().then(done).catch(done);
  });

  it('status: 5 (timeout)', function (done) {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    hifetch({
      url: `${ROOT}/error5`,
      timeout: 100,
      error(res) {
        expect(res.status).to.be.equal(5);
        expect(res.timeout).to.be.equal(100);
        return res;
      },
    }).send().then(res => {
      expect(res.status).to.be.equal(5);
    }).then(done).catch(done);
  });

  it('status: 5 (no timeout)', function (done) {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    hifetch({
      url: `${ROOT}/error5`,
      timeout: 300,
      success(res) {
        expect(res.status).to.be.equal(0);
        return res;
      },
    }).send().then(res => {
      expect(res.status).to.be.equal(0);
    }).then(done).catch(done);
  });

});
