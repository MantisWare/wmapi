'use strict';

/**
 * Module dependencies
 */

/**
 * P3P hook
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
            mwapi.koaMiddlewares.lusca.p3p({
              value: mwapi.config.middleware.settings.p3p.value
            })
          )(ctx, next);
        }
      );

      cb();
    }
  };
};
