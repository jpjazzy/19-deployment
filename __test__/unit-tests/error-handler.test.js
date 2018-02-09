'use strict';

const errHandler = require('../../lib/error-handler');
require('jest');


describe('Error-handler testing', function() {
  this.validation = new Error('Validation Error: Cannot update file with unmatched ID');
  this.path = new Error('Path Error. Route not found.');
  this.objectIDfail = new Error('ObjectID failed. Obj does not exist');
  this.duplicatekey = new Error('duplicate key. Cannot have multiple IDs');
  this.randomerror = new Error('Random error');
  this.res = { status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};
  
  it('Should be return status code 400', () => {
    let errMock = errHandler(this.validation, this.res);
    expect(errMock.statusCode).toBe(400);
  });
  it('Should match validation', () => {
    let errMock = errHandler(this.validation, this.res);
    expect(errMock.message).toMatch(/validation error/i);
  });

  it('Should be return status code 404', () => {
    let errMock = errHandler(this.path, this.res);
    expect(errMock.statusCode).toBe(404);
  });
  it('Should match enoent', () => {
    let errMock = errHandler(this.path, this.res);
    expect(errMock.message).toMatch(/path error/i);
  });
  it('Should match duplicate key', () => {
    let errMock = errHandler(this.duplicatekey, this.res);
    expect(errMock.message).toMatch(/duplicate key/i);
  });
  it('Should match object ID match fail', () => {
    let errMock = errHandler(this.objectIDfail, this.res);
    expect(errMock.message).toMatch(/ObjectID failed/i);
  });
  it('Should match none', () => {
    let errMock = errHandler(this.randomerror, this.res);
    expect(errMock.message).toMatch(/random error/i);
  });

});