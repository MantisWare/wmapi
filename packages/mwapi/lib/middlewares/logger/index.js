'use strict';

/**
 * Logger hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      if (mwapi.config.middleware.settings.logger.level) {
        mwapi.log.level = mwapi.config.middleware.settings.logger.level;
      }

      if (mwapi.config.middleware.settings.logger.exposeInContext) {
        mwapi.app.context.log = mwapi.log;
      }

      if (mwapi.config.middleware.settings.logger.requests && mwapi.log.levelVal <= 20) {
        mwapi.app.use(async (ctx, next) => {
          const start = Date.now();

          await next();

          const delta = Math.ceil(Date.now() - start);

          mwapi.log.debug(`${ctx.method} ${ctx.url} (${delta} ms)`);
        });
      }

      cb();
    }
  };
};
