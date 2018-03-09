'use strict';

const assert = require('assert');

const mwapi = require('../lib/');

/**
 * No need to test everything about Koa.
 * We just need need to make sure that everything
 * is correctly required and loaded inside `mwapi`.
 */

describe('application', () => {
  it('`mwapi.app` should be an object', () => {
    assert(typeof mwapi.app === 'object');
  });

  it('`mwapi.app.use` should be a function', () => {
    assert(typeof mwapi.app.use === 'function');
  });

  it('`mwapi.app.context` should be an object', () => {
    assert(typeof mwapi.app.context === 'object');
  });

  it('`mwapi.app.request` should be an object', () => {
    assert(typeof mwapi.app.request === 'object');
  });

  it('`mwapi.app.response` should be an object', () => {
    assert(typeof mwapi.app.response === 'object');
  });
});
