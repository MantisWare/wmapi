'use strict';

/**
 * Module dependencies
 */

/**
 * XSS hook
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
              mwapi.koaMiddlewares.lusca.xssProtection({
                enabled: true,
                mode: defaults.xss.mode
              })
            )(ctx, next);
          } else if (mwapi.config.currentEnvironment.security.xss.enabled) {
            return await mwapi.koaMiddlewares.convert(
              mwapi.koaMiddlewares.lusca.xssProtection({
                enabled: mwapi.config.middleware.settings.xss.enabled,
                mode: mwapi.config.middleware.settings.xss.mode
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
