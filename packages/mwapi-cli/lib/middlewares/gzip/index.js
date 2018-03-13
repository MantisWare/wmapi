'use strict';

/**
 * Gzip hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(mwapi.koaMiddlewares.compress());

      cb();
    }
  };
};
