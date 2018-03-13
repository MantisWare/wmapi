'use strict';

/**
 * Module dependencies
 */

/**
 * IP filter hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(
        mwapi.koaMiddlewares.ip({
          whiteList: mwapi.config.middleware.settings.ip.whiteList,
          blackList: mwapi.config.middleware.settings.ip.blackList
        })
      );

      cb();
    }
  };
};
