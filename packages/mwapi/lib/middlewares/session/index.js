'use strict';

/**
 * Module dependencies
 */

// Core modules
const path = require('path');

// Public node modules.
const _ = require('lodash');

/**
 * Session hook
 */

module.exports = mwapi => {
  const hook = {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      mwapi.app.keys =
        _.get(mwapi.config.middleware.settings.session, 'secretKeys') ||
        mwapi.config.hooks.session.secretKeys;

      if (
        mwapi.config.middleware.settings.session.hasOwnProperty('client') &&
        _.isString(mwapi.config.middleware.settings.session.client) &&
        mwapi.config.middleware.settings.session.client !== 'cookie'
      ) {
        const store = hook.defineStore(mwapi.config.middleware.settings.session);

        if (!_.isEmpty(store)) {
          try {
            // Options object contains the defined store, the custom hooks configurations
            // and also the function which are located to `./config/functions/session.js`
            const options = _.assign(
              {
                store
              },
              mwapi.config.hook.session,
              mwapi.config.middleware.settings.session
            );

            mwapi.app.use(
              mwapi.koaMiddlewares.session(options, mwapi.app)
            );
            mwapi.app.use((ctx, next) => {
              ctx.state = ctx.state || {};
              ctx.state.session = ctx.session || {};

              return next();
            });
          } catch (err) {
            return cb(err);
          }
        }
      } else if (
        mwapi.config.middleware.settings.session.hasOwnProperty('client') &&
        _.isString(mwapi.config.middleware.settings.session.client) &&
        mwapi.config.middleware.settings.session.client === 'cookie'
      ) {
        try {
          const options = _.assign(
            mwapi.config.hook.session,
            mwapi.config.middleware.settings.session
          );

          mwapi.app.use(
            mwapi.koaMiddlewares.session(options, mwapi.app)
          );
          mwapi.app.use((ctx, next) => {
            ctx.state = ctx.state || {};
            ctx.state.session = ctx.session || {};

            return next();
          });
        } catch (err) {
          return cb(err);
        }
      }

      cb();
    },

    defineStore: session => {
      if (_.isEmpty(_.get(session, 'client'))) {
        return mwapi.log.error('(middleware:session) please provide a valid client to store session');
      } else if (_.isEmpty(_.get(session, 'connection'))) {
        return mwapi.log.error('(middleware:session) please provide connection for the session store');
      } else if (!_.get(mwapi, `config.currentEnvironment.database.connections.${session.connection}`)) {
        return mwapi.log.error('(middleware:session) please provide a valid connection for the session store');
      }

      session.settings = _.get(mwapi, `config.currentEnvironment.database.connections.${session.connection}`);

      // Define correct store name to avoid require to failed.
      switch (session.client.toLowerCase()) {
        case 'redis': {
          const store = hook.requireStore('redis');

          session.settings.db = session.settings.database;

          return store(session.settings);
        }
        case 'mysql': {
          const Store = hook.requireStore('mysql-session');

          return new Store(session.settings);
        }
        case 'mongo': {
          const Store = hook.requireStore('generic-session-mongo');

          session.settings.db = session.settings.database;

          return new Store(session.settings);
        }
        case 'postgresql': {
          const Store = hook.requireStore('pg-session');

          return new Store(session.settings, session.options);
        }
        case 'rethink': {
          const Store = hook.requireStore('generic-session-rethinkdb');

          session.settings.dbName = session.settings.database;
          session.settings.tableName = session.settings.table;

          const sessionStore = new Store({
            connection: session.settings
          });

          // Create the DB, tables and indexes to store sessions.
          sessionStore.setup();

          return sessionStore;
        }
        case 'sqlite': {
          const Store = hook.requireStore('sqlite3-session');

          return new Store(session.fileName, session.options);
        }
        case 'sequelize': {
          const Store = hook.requireStore('generic-session-sequelize');

          // Sequelize needs to be instantiated.
          if (!_.isObject(mwapi.sequelize)) {
            return null;
          }

          return new Store(mwapi.sequelize, session.options);
        }
        default: {
          return null;
        }
      }
    },

    requireStore: store => {
      try {
        return require(path.resolve(
          mwapi.config.appPath,
          'node_modules',
          'koa-' + store
        ));
      } catch (err) {
        throw err;
      }
    }
  };

  return hook;
};
