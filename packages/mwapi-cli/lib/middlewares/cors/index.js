'use strict';

/**
 * Module dependencies
 */

/**
 * CORS hook
 */

const defaults = require('./defaults.json');

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(
        async (ctx, next) => {
          if (ctx.request.admin) {
            return mwapi.koaMiddlewares.kcors({
              origin: '*',
              exposeHeaders: defaults.cors.expose,
              maxAge: defaults.cors.maxAge,
              credentials: defaults.cors.credentials,
              allowMethods: defaults.cors.methods,
              allowHeaders: defaults.cors.headers,
              keepHeadersOnError: defaults.cors.keepHeadersOnError
            })(ctx, next);
          } else if (mwapi.config.currentEnvironment.security.cors.enabled) {
            return mwapi.koaMiddlewares.kcors({
              origin: mwapi.config.middleware.settings.cors.origin,
              exposeHeaders: mwapi.config.middleware.settings.cors.expose,
              maxAge: mwapi.config.middleware.settings.cors.maxAge,
              credentials: mwapi.config.middleware.settings.cors.credentials,
              allowMethods: mwapi.config.middleware.settings.cors.methods,
              allowHeaders: mwapi.config.middleware.settings.cors.headers,
              keepHeadersOnError: mwapi.config.middleware.settings.cors.keepHeadersOnError
            })(ctx, next);
          }

          await next();
        }
      );

      cb();
    }
  };
};
