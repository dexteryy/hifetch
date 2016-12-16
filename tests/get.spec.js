/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('get', function () {

  it('user1, promise style', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).defaultReplyHeaders({
      'X-Powered-By': 'nock',
    }).get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user1');
        expect(res.poweredBy).to.be.equal('nock');
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('user1, callback style', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).defaultReplyHeaders({
      'X-Powered-By': 'nock',
    }).get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      success(res) {
        expect(res.name).to.be.equal('user1');
        expect(res.poweredBy).to.be.equal('nock');
        return res;
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user1');
        expect(res.poweredBy).to.be.equal('nock');
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('user2', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).get('/user')
      .query({
        uid: 2,
      })
      .reply(200, {
        name: 'user2',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 2,
      },
      headers: {
        'X-My-Headers': '1',
      },
      success(res) {
        expect(res.name).to.be.equal('user2');
        return res;
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user2');
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('text', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).defaultReplyHeaders({
      'X-Powered-By': 'nock',
    }).get('/text')
      .reply(200, 'some text');
    hifetch({
      url: `${ROOT}/text`,
      headers: {
        'X-My-Headers': '1',
      },
      parser: response => response.text(),
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    }).send()
      .then(res => {
        expect(res).to.be.equal('some text');
        done();
      }).catch(err => {
        console.log(err);
      });
  });

});
