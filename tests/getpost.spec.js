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

  it('get user1', function (done) {
    nock(ROOT)
      .get('/user')
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
      success(res) {
        expect(res.name).to.be.equal('user1');
        return res;
      },
    }).send().then(res => {
      expect(res.name).to.be.equal('user1');
    }).then(done).catch(done);
  });

  it('get user2', function (done) {
    nock(ROOT)
      .get('/user')
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
      success(res) {
        expect(res.name).to.be.equal('user2');
        return res;
      },
    }).send().then(res => {
      expect(res.name).to.be.equal('user2');
    }).then(done).catch(done);
  });

  it('post user3 by urlencoded', function (done) {
    nock(ROOT)
      .post('/user')
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
      data: {
        name: 'user3',
      },
      success(res) {
        expect(res.name).to.be.equal('user3');
        expect(res.status).to.be.equal(0);
        return res;
      },
    }).send().then(res => {
      expect(res.status).to.be.equal(0);
    }).then(done).catch(done);
  });

  it('post user4 by JSON', function (done) {
    nock(ROOT)
      .post('/user')
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
      dataType: 'application/json',
      data: {
        name: 'user4',
      },
      success(res) {
        expect(res.name).to.be.equal('user4');
        expect(res.status).to.be.equal(0);
        return res;
      },
    }).send().then(res => {
      expect(res.status).to.be.equal(0);
    }).then(done).catch(done);
  });

  it('post user5 by FormData', function (done) {
    nock(ROOT)
      .post('/user')
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
      dataType: 'multipart/form-data',
      data: formData,
      success(res) {
        expect(res.name).to.be.equal('user5');
        expect(res.status).to.be.equal(0);
        return res;
      },
    }).send().then(res => {
      expect(res.status).to.be.equal(0);
    }).then(done).catch(done);
  });

});
