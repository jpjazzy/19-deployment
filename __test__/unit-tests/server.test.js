'use strict';

const server = require('../../lib/server');
require('jest');

describe('server testing', function() {
  beforeEach(server.start);
  afterEach(server.stop);
  
  it('Should return an err starting twice', () => {
    server.start()
      .catch(err => expect(err).toBeInstanceOf(Error));

  });

  // it('Should return an err stopping twice', () => {
  //   server.stop();
  //   server.stop()
  //   .catch(err => expect(err.message).toMatch(/hi/i));
  // });
});