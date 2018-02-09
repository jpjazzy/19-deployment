'use strict';


const faker = require('faker');
const mock = require('../../lib/mocks.js');
const superagent = require('superagent');
const server = require('../../../lib/server.js');
require('jest');

describe('PUT /api/v1/gallery', function () {
  beforeAll(server.start);
  beforeAll(() => mock.gallery.createOne().then(data => this.mockData = data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  describe('Valid request', () => {
    it('should update an existing record', () => {
      let updated = {
        name: 'pajamas',
        description: 'fire trucks',
      };
      // console.log('MOCK DATA FOR PUT REQ:', this.mockData);
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockData.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockData.token}`)
        .send(updated)
        .then(res => expect(res.status).toEqual(204));
    });
  });

  describe('Invalid requests', () => {
    it('should return a 401 with an invalid token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockData.gallery._id}`)
        .set('Authorization', 'Bearer BADTOKEN')
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 status for not found', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/badpath`)
        .set('Authorization', `Bearer ${this.mockData.token}`)
        .send({
          name: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});