'use strict';

/**
 * Module dependencies
 */

// Native
const path = require('path');

// Externals
const co = require('co');
const render = require('koa-ejs');
const _ = require('lodash');

/**
 * EJS hook
 */

module.exports = function (mwapi) {
  const hook = {

    /**
     * Default options
     */

    defaults: {
      root: path.join(mwapi.config.appPath, mwapi.config.paths.views),
      layout: 'layout',
      viewExt: 'ejs',
      cache: true,
      debug: true
    },

    /**
     * Initialize the hook
     */

    initialize: cb => {
      // Force cache mode in production
      if (mwapi.config.environment === 'production') {
        mwapi.config.hook.settings.ejs.cache = true;
      }

      render(mwapi.app, mwapi.config.hook.settings.ejs);

      mwapi.app.context.render = co.wrap(mwapi.app.context.render);

      cb();
    }
  };

  return hook;
};
