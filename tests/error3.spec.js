/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('error: 3', function () {

  it('promise style', function (done) {
    nock(ROOT)
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(3);
      expect(res.data.status).to.be.equal(-1);
      expect(res.poweredBy).to.be.equal('nock');
    };
    hifetch(fetchConfig).send()
      .catch(errorHandler)
      .then(() => {
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('callback style', function (done) {
    nock(ROOT)
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    };
    const errorHandler = res => {
      expect(res.status).to.be.equal(3);
      expect(res.data.status).to.be.equal(-1);
      expect(res.poweredBy).to.be.equal('nock');
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

});
