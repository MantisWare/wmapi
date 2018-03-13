'use strict';

/**
 * Body parser hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(mwapi.koaMiddlewares.body(Object.assign({
          patchKoa: true,
        },
        mwapi.config.middleware.settings.parser
      )));

      cb();
    }
  };
};
