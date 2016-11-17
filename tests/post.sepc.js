/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import qs from 'qs';
import FormData from 'form-data';
import hifetch from '../dist';
import {
  ROOT,
  parseFormData,
} from './utils';

describe('get/post', function () {

  it('post user3 by urlencoded', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).post('/user')
      .query({
        uid: 3,
      })
      .reply(200, function (uri, requestBody) {
        return Object.assign(qs.parse(requestBody), {
          status: 0,
        });
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 3,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: {
        name: 'user3',
      },
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user3');
        expect(res.status).to.be.equal(0);
        done();
      }).catch(err => {
        console.log(err);
      });
  });

  it('post user4 by JSON', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).post('/user')
      .query({
        uid: 4,
      })
      .reply(200, function (uri, requestBody) {
        return Object.assign(requestBody, {
          status: 0,
        });
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
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

  it('post user5 by FormData', function (done) {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    }).post('/user')
      .query({
        uid: 5,
      })
      .reply(200, function (uri, requestBody) {
        return Object.assign(parseFormData(requestBody), {
          status: 0,
        });
      });
    const formData = new FormData();
    formData.append('name', 'user5');
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 5,
      },
      headers: {
        'X-My-Headers': '1',
      },
      dataType: 'form',
      data: formData,
    }).send()
      .then(res => {
        expect(res.name).to.be.equal('user5');
        expect(res.status).to.be.equal(0);
        done();
      }).catch(err => {
        console.log(err);
      });
  });

});
