/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('actions', function () {

  it('cancel()', function (done) {
    nock(ROOT)
      .get('/delay')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const req = hifetch({
      url: `${ROOT}/delay`,
      success(res) {
        expect(res.status).to.be.equal(0);
      },
      error(res) {
        expect(res.status).to.not.be.equal(0);
      },
    });
    req.send().then(done).catch(done);
    setTimeout(() => {
      req.cancel();
    }, 100);
    setTimeout(done, 300);
  });

  it('error()', function (done) {
    nock(ROOT)
      .get('/delay')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const req = hifetch({
      url: `${ROOT}/delay`,
      success(res) {
        expect(res.status).to.be.equal(0);
      },
      error(res) {
        expect(res.status).to.be.equal(6);
        expect(res.customError).to.be.an('error');
        expect(res.customError.toString()).to.be.include('test');
      },
    });
    req.send().then(done).catch(done);
    setTimeout(() => {
      req.error(new Error('test'));
    }, 100);
    setTimeout(done, 300);
  });

});
