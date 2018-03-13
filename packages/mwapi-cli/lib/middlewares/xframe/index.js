'use strict';

/**
 * Module dependencies
 */

/**
 * CRON hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      const defaults = require('./defaults.json');
      
      mwapi.app.use(
        async (ctx, next) => {
          if (ctx.request.admin) {
            return await mwapi.koaMiddlewares.convert(
              mwapi.koaMiddlewares.lusca.xframe({
                enabled: defaults.xframe.enabled,
                value: defaults.xframe.value
              })
            )(ctx, next);
          } else if (mwapi.config.currentEnvironment.security.xframe.enabled) {
            return await mwapi.koaMiddlewares.convert(
              mwapi.koaMiddlewares.lusca.xframe({
                value: mwapi.config.middleware.settings.xframe.value
              })
            )(ctx, next);
          }

          await next();
        }
      );

      cb();
    }
  };
};
