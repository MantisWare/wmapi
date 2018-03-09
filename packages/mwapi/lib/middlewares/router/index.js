'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const Boom = require('boom');

/**
 * Router hook
 */

module.exports = mwapi => {
  const composeEndpoint = require('./utils/composeEndpoint')(mwapi);

  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      _.forEach(mwapi.config.routes, value => {
        composeEndpoint(value, null, mwapi.router)(cb);
      });

      mwapi.router.prefix(_.get(mwapi.config, 'currentEnvironment.request.router.prefix', ''));

      if (!_.isEmpty(_.get(mwapi.admin, 'config.routes', false))) {
        // Create router for admin.
        // Prefix router with the admin's name.
        const router = mwapi.koaMiddlewares.routerJoi();

        _.forEach(mwapi.admin.config.routes, value => {
          composeEndpoint(value, null, router)(cb);
        });

        // router.prefix(mwapi.config.admin.path || `/${mwapi.config.paths.admin}`);
        router.prefix('/admin');

        // TODO:
        // - Mount on main router `mwapi.router.use(routerAdmin.middleware());`

        // Mount admin router on mwapi router
        mwapi.app.use(router.middleware());
      }

      if (mwapi.plugins) {
        // Parse each plugin's routes.
        _.forEach(mwapi.plugins, (plugin, name) => {
          const router = mwapi.koaMiddlewares.routerJoi();

          // Exclude routes with prefix.
          const excludedRoutes = _.omitBy(plugin.config.routes, o => !o.config.hasOwnProperty('prefix'));

          _.forEach(_.omit(plugin.config.routes, _.keys(excludedRoutes)), value => {
            composeEndpoint(value, name, router)(cb);
          });

          router.prefix('/' + name);

          // /!\ Could override main router's routes.
          if (!_.isEmpty(excludedRoutes)) {
            _.forEach(excludedRoutes, value => {
              composeEndpoint(value, name, mwapi.router)(cb)
            });
          }

          // TODO:
          // - Mount on main router `mwapi.router.use(router.middleware());`

          // Mount plugin router
          mwapi.app.use(router.middleware());
        });
      }

      // Let the router use our routes and allowed methods.
      mwapi.app.use(mwapi.router.middleware());

      cb();
    }
  };
};
