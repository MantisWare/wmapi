'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

/**
 * Favicon hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(
        mwapi.koaMiddlewares.favicon(
          path.resolve(mwapi.config.appPath, mwapi.config.middleware.settings.favicon.path),
          {
            maxAge: mwapi.config.middleware.settings.favicon.maxAge
          }
        )
      );

      cb();
    }
  };
};
