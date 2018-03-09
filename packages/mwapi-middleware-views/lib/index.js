'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Public node modules.
const _ = require('lodash');
const consolidate = require('consolidate');
const views = require('koa-views');

/**
 * Public assets hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      if (
        _.isPlainObject(mwapi.config.middleware.settings.views) &&
        !_.isEmpty(mwapi.config.middleware.settings.views)
      ) {
        const opts = _.clone(mwapi.config.middleware.settings.views);

        if (opts.hasOwnProperty('default')) {
          opts.extension = opts.default;
          delete opts.default;
        }

        // Map every template engine in config.
        _.forEach(opts.map, engine => {
          if (!consolidate.requires[engine]) {
            // Try to require them using `consolidate` or throw an error.
            try {
              consolidate.requires[engine] = require(path.resolve(
                mwapi.config.appPath,
                'node_modules',
                engine
              ));
            } catch (err) {
              mwapi.log.error(
                '`' + engine + '` template engine not installed.'
              );
              mwapi.log.error(
                'Execute `$ npm install ' + engine + ' --save` to install it.'
              );
              process.exit(1);
            }
          }

          // Initialize the engine with `consolidate`.
          consolidate[engine];
        });

        mwapi.app.use(
          views(
            path.resolve(mwapi.config.appPath, mwapi.config.paths.views),
            opts
          )
        );
      }

      cb();
    }
  };
};
