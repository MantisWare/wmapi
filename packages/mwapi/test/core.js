'use strict';

const assert = require('assert');

const mwapi = require('../lib/');

/**
 * Make sure private functions are correctly
 * required and loaded.
 */

describe('core', () => {
  it('`mwapi` should be an object', () => {
    assert(typeof mwapi === 'object');
  });

  it('`mwapi.load` should be a function', () => {
    assert(typeof mwapi.load === 'function');
  });

  it('`mwapi.server` should be a object', () => {
    assert(typeof mwapi.server === 'object');
  });

  it('`mwapi.start` should be a function', () => {
    assert(typeof mwapi.start === 'function');
  });

  it('`mwapi.stop` should be a function', () => {
    assert(typeof mwapi.stop === 'function');
  });
});
