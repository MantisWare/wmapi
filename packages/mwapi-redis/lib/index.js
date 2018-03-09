'use strict';

/**
 * Module dependencies
 */

// Core
const util = require('util');

// Public node modules.
const _ = require('lodash');
const Redis = require('ioredis');
const stackTrace = require('stack-trace');

/**
 * Redis hook
 */

module.exports = function(mwapi) {
  const hook = {
    /**
     * Default options
     */

    defaults: {
      port: 6379,
      host: 'localhost',
      options: {
        db: 0
      },
      showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
    },

    /**
     * Initialize the hook
     */

    initialize: cb => {
      if (_.isEmpty(mwapi.models) || !_.pickBy(mwapi.config.connections, {
        connector: 'mwapi-redis'
      })) {
        return cb();
      }

      const connections = _.pickBy(mwapi.config.connections, {
        connector: 'mwapi-redis'
      });

      if(_.size(connections) === 0) {
        cb();
      }

      const done = _.after(_.size(connections), () => {
        cb();
      });

      // For each connection in the config register a new Knex connection.
      _.forEach(connections, (connection, name) => {
        // Apply defaults
        _.defaults(connection.settings, mwapi.config.hook.settings.redis);

        try {
          const redis = new Redis(_.defaultsDeep({
            port: _.get(connection.settings, 'port'),
            host: _.get(connection.settings, 'host'),
            options: {
              db: _.get(connection.options, 'database') || 0
            }
          }, mwapi.config.hook.settings.redis));

          redis.on('error', err => {
            mwapi.log.error(err);
            process.exit(0);
            return;
          });

          // Utils function.
          // Behavior: Try to retrieve data from Redis, if null
          // execute callback and set the value in Redis for this serial key.
          redis.cache = async ({ expired = 60 * 60, serial }, cb, type) => {
            if (_.isEmpty(serial)) {
              mwapi.log.warn(
                `Be careful, you're using cache() function of mwapi-redis without serial`
              );

              const traces = stackTrace.get();

              mwapi.log.warn(
                `> [${traces[1].getLineNumber()}] ${traces[1]
                  .getFileName()
                  .replace(mwapi.config.appPath, '')}`
              );

              return await cb();
            }

            let cache = await redis.get(serial);

            if (!cache) {
              cache = await cb();

              if (
                cache &&
                _.get(connection, 'options.disabledCaching') !== true
              ) {
                switch (type) {
                  case 'json':
                    redis.set(serial, JSON.stringify(cache), 'ex', expired);
                    break;
                  case 'int':
                  default:
                    redis.set(serial, cache, 'ex', expired);
                    break;
                }

              }
            }

            switch (type) {
              case 'int':
                return parseInt(cache);
              case 'float':
                return _.toNumber(cache);
              case 'json':
                try {
                  return _.isObject(cache) ? cache : JSON.parse(cache);
                } catch (e) {
                  return cache;
                }
              default:
                return cache;
            }
          };

          // Define as new connection.
          mwapi.connections[name] = redis;

          // Expose global
          if (_.get(connection, 'options.global') !== false) {
            global[_.get(connection, 'options.globalName') || 'redis'] = redis;
          }

          if (_.get(connection, 'options.debug') === true) {
            redis.monitor((err, monitor) => {
              // Entering monitoring mode.
              monitor.on('monitor', (time, args) => {
                console.log(time + ': ' + util.inspect(args));
              });
            });
          }

          redis.on('ready', () => {
            done();
          });
        } catch (e) {
          cb(e);

          return false;
        }
      });
    }
  };

  return hook;
};
