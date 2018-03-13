'use strict';

const assert = require('assert');

const mwapi = require('../lib/');

/**
 * Make sure the logger works correctly.
 */

describe('logger', () => {
  it('`mwapi.log` should be an object', () => {
    assert(typeof mwapi.log === 'object');
  });

  it('`mwapi.log.info` should be a function', () => {
    assert(typeof mwapi.log.info === 'function');
  });

  it('`mwapi.log.warn` should be a function', () => {
    assert(typeof mwapi.log.warn === 'function');
  });

  it('`mwapi.log.error` should be a function', () => {
    assert(typeof mwapi.log.error === 'function');
  });
});
