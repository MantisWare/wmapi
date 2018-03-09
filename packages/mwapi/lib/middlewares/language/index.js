'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const { get } = require('lodash');
const path = require('path');

/**
 * Language hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.koaMiddlewares.locale(mwapi.app);

      mwapi.app.use(
        mwapi.koaMiddlewares.i18n(mwapi.app, {
          directory: path.resolve(
            mwapi.config.appPath,
            mwapi.config.paths.config,
            'locales'
          ),
          locales: Object.keys(get(mwapi.config, 'locales', {})),
          defaultLocale: mwapi.config.middleware.settings.language.defaultLocale,
          modes: mwapi.config.middleware.settings.language.modes,
          cookieName: mwapi.config.middleware.settings.language.cookieName,
          extension: '.json'
        })
      );

      cb();
    }
  };
};
