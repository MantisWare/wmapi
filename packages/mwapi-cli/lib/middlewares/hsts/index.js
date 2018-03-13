'use strict';

/**
 * Module dependencies
 */

/**
 * HSTS hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(
        async (ctx, next) => {
          if (ctx.request.admin) return next();

          return await mwapi.koaMiddlewares.convert(
            mwapi.koaMiddlewares.lusca.hsts({
              maxAge: mwapi.config.middleware.settings.hsts.maxAge,
              includeSubDomains: mwapi.config.middleware.settings.hsts.includeSubDomains
            })
          )(ctx, next);
        }
      );

      cb();
    }
  };
};
