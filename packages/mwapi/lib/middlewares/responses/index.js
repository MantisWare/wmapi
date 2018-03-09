'use strict';

/**
 * Custom responses hook
 */

const _ = require('lodash');

module.exports = () => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.use(async (ctx, next) => {
        await next();

        // Call custom responses.
        if (_.isFunction(_.get(mwapi.config, `functions.responses.${ctx.status}`))) {
          await mwapi.config.functions.responses[ctx.status].call(this, ctx);
        }

        // Set X-Powered-By header.
        if (_.get(mwapi.config, 'X-Powered-By.enabled', true)) {
          ctx.set('X-Powered-By', 'mwapi <mwapi.io>');
        }
      });
      cb();
    }
  };
};
