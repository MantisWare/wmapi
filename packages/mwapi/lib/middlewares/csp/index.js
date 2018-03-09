'use strict';

/**
 * Module dependencies
 */

/**
 * CSP hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(
        async (ctx, next) => {
          if (ctx.request.admin) return await next();

          return await mwapi.koaMiddlewares.convert(
            mwapi.koaMiddlewares.lusca.csp(mwapi.config.middleware.settings.csp)
          )(ctx, next);
        }
      );

      cb();
    }
  };
};
