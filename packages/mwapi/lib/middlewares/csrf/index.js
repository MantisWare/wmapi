'use strict';

/**
 * Module dependencies
 */

/**
 * CSRF hook
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
            mwapi.koaMiddlewares.lusca.csrf({
              key: mwapi.config.middleware.settings.csrf.key,
              secret: mwapi.config.middleware.settings.csrf.secret
            })
          )(ctx, next);
        }
      );

      cb();
    }
  };
};
