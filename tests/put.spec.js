/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import qs from 'qs';
import hifetch from '../dist';
import {
  ROOT,
} from './utils';

describe('put', function () {

  it('user3, by urlencoded', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /application\/x-www-form-urlencoded/,
      },
    }).defaultReplyHeaders({
      'X-Powered-By': 'nock',
    }).put('/user')
      .query({
        uid: 3,
      })
      .reply(201, function (uri, requestBody) {
        return Object.assign(qs.parse(requestBody), {
          status: 0,
        });
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'put',
      query: {
        uid: 3,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: {
        name: 'user3',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user3');
        expect(res.status).to.be.equal(0);
        expect(res.poweredBy).to.be.equal('nock');
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('user4, by JSON', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /json/,
      },
    }).put('/user')
      .query({
        uid: 4,
      })
      .reply(201, function (uri, requestBody) {
        return Object.assign(requestBody, {
          status: 0,
        });
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'put',
      query: {
        uid: 4,
      },
      headers: {
        'X-My-Headers': '1',
      },
      dataType: 'json',
      data: {
        name: 'user4',
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user4');
        expect(res.status).to.be.equal(0);
        done();
      }).catch(err => {
        console.log(err);
      });
  });

});
