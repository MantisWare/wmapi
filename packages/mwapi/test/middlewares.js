'use strict';

const assert = require('assert');
const mwapi = require('../lib/');


  /**
   * No need to test everything about Koa middleware.
   * We just need need to make sure that they all are
   * correctly required and loaded inside `mwapi`.
   */
  describe('middleware', () => {
    before(function(done) {
      mwapi.log.level = 'silent';
      
      // runs before all tests in this block
      mwapi.start({
        port: 1338
      }, () => {
        done();
      });
    });

    it('`mwapi.middleware` should be an object', () => {
      assert(typeof mwapi.middleware === 'object');
    });

    it('`mwapi.middleware.cors` should be a function', () => {
      assert(typeof mwapi.middleware.cors.load.initialize === 'function');
    });

    it('`mwapi.middleware.cron` should be a function', () => {
      assert(typeof mwapi.middleware.cron.load.initialize === 'function');
    });

    it('`mwapi.middleware.csp` should be a function', () => {
      assert(typeof mwapi.middleware.csp.load.initialize === 'function');
    });

    it('`mwapi.middleware.csrf` should be a function', () => {
      assert(typeof mwapi.middleware.csrf.load.initialize === 'function');
    });

    it('`mwapi.middleware.favicon` should be a function', () => {
      assert(typeof mwapi.middleware.favicon.load.initialize === 'function');
    });

    it('`mwapi.middleware.gzip` should be a function', () => {
      assert(typeof mwapi.middleware.gzip.load.initialize === 'function');
    });

    it('`mwapi.middleware.hsts` should be a function', () => {
      assert(typeof mwapi.middleware.hsts.load.initialize === 'function');
    });

    it('`mwapi.middleware.ip` should be a function', () => {
      assert(typeof mwapi.middleware.ip.load.initialize === 'function');
    });

    it('`mwapi.middleware.language` should be a function', () => {
      assert(typeof mwapi.middleware.language.load.initialize === 'function');
    });

    it('`mwapi.middleware.logger` should be a function', () => {
      assert(typeof mwapi.middleware.logger.load.initialize === 'function');
    });

    it('`mwapi.middleware.p3p` should be a function', () => {
      assert(typeof mwapi.middleware.p3p.load.initialize === 'function');
    });

    it('`mwapi.middleware.parser` should be a function', () => {
      assert(typeof mwapi.middleware.parser.load.initialize === 'function');
    });

    it('`mwapi.middleware.public` should be a function', () => {
      assert(typeof mwapi.middleware.public.load.initialize === 'function');
    });

    it('`mwapi.middleware.responses` should not be a function', () => {
      assert(typeof mwapi.middleware.responses.load.initialize === "function");
    });

    it('`mwapi.middleware.responseTime` should be a function', () => {
      assert(typeof mwapi.middleware.responseTime.load.initialize === 'function');
    });

    it('`mwapi.middleware.router` should be a function', () => {
      assert(typeof mwapi.middleware.router.load.initialize === 'function');
    });

    it('`mwapi.middleware.session` should be a function', () => {
      assert(typeof mwapi.middleware.session.load.initialize === 'function');
    });

    it('`mwapi.middleware.xframe` should be a function', () => {
      assert(typeof mwapi.middleware.xframe.load.initialize === 'function');
    });

    it('`mwapi.middleware.xss` should be a function', () => {
      assert(typeof mwapi.middleware.xss.load.initialize === 'function');
    });
  });
