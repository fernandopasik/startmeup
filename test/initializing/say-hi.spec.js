'use strict';

const app = require('../../generators/app');

describe('Init', () => {

  it('can be imported without blowing up', () => {
    assert.ok(app);
  });

});
