'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Public modules
const _ = require('lodash');
const Koa = require('koa');

/**
 * Public assets hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      // Serve /public index page.
      mwapi.router.route({
        method: 'GET',
        path: '/',
        handler: [
          async (ctx, next) => {
            ctx.url = path.basename(`${ctx.url}/index.html`);

            await next();
          },
          mwapi.koaMiddlewares.static(mwapi.config.middleware.settings.public.path || mwapi.config.paths.static, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      // Match every route with an extension.
      // The file without extension will not be served.
      // Note: This route could be override by the user.
      mwapi.router.route({
        method: 'GET',
        path: '/*',
        handler: [
          async (ctx, next) => {
            const parse = path.parse(ctx.url);

            ctx.url = path.join(parse.dir, parse.base);

            await next();
          },
          mwapi.koaMiddlewares.static(mwapi.config.middleware.settings.public.path || mwapi.config.paths.static, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      const basename = _.get(mwapi.config.currentEnvironment.server, 'admin.path') ?
        mwapi.config.currentEnvironment.server.admin.path :
        '/admin';

      // Serve /admin index page.
      mwapi.router.route({
        method: 'GET',
        path: basename,
        handler: [
          async (ctx, next) => {
            ctx.url = 'index.html';

            await next();
          },
          mwapi.koaMiddlewares.static(`./admin/admin/build`, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      // Allow refresh in admin page.
      mwapi.router.route({
        method: 'GET',
        path: `${basename}/*`,
        handler: [
          async (ctx, next) => {
            const parse = path.parse(ctx.url);

            if (parse.ext === '') {
              ctx.url = 'index.html';
            }

            await next();
          },
          mwapi.koaMiddlewares.static(`./admin/admin/build`, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      // Serve admin assets.
      mwapi.router.route({
        method: 'GET',
        path: `${basename}/*.*`,
        handler: [
          async (ctx, next) => {
            ctx.url = path.basename(ctx.url);

            await next();
          },
          mwapi.koaMiddlewares.static(`./admin/admin/build`, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      // Allow page refresh
      mwapi.router.route({
        method: 'GET',
        path: `${basename}/plugins/*`,
        handler: [
          async (ctx, next) => {
            const parse = path.parse(ctx.url);

            if (parse.ext === '') {
              ctx.url = 'index.html';
            }

            await next();
          },
          mwapi.koaMiddlewares.static(`./admin/admin/build`, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })
        ]
      });

      // Serve plugins assets.
      mwapi.router.route({
        method: 'GET',
        path: `${basename}/:resource/*.*`,
        handler: async (ctx, next) => {
          ctx.url = path.basename(ctx.url);

          if (Object.keys(mwapi.plugins).indexOf(ctx.params.resource) !== -1) {
            return await mwapi.koaMiddlewares.static(`./plugins/${ctx.params.resource}/admin/build`, {
              maxage: mwapi.config.middleware.settings.public.maxAge,
              defer: true
            })(ctx, next);
          }

          // Handle subfolders.
          return await mwapi.koaMiddlewares.static(`./admin/admin/build/${ctx.params.resource}`, {
            maxage: mwapi.config.middleware.settings.public.maxAge,
            defer: true
          })(ctx, next);
        }
      });

      // Plugins.
      _.forEach(mwapi.plugins, (value, plugin) => {
        mwapi.router.route({
          method: 'GET',
          path: `/plugins/${plugin}/*.*`,
          handler: [
            async (ctx, next) => {
              ctx.url = path.basename(ctx.url);

              // Try to find assets into the build first.
              return await mwapi.koaMiddlewares.static(`./plugins/${plugin}/admin/build`, {
                maxage: mwapi.config.middleware.settings.public.maxAge,
                defer: true
              })(ctx, next);
            },
            async (ctx, next) => {
              // Try to find assets in the source then.
              return await mwapi.koaMiddlewares.static(`./plugins/${plugin}/${mwapi.config.middleware.settings.public.path || mwapi.config.paths.static}`, {
                maxage: mwapi.config.middleware.settings.public.maxAge,
                defer: true
              })(ctx, next);
            },
          ]
        });

        mwapi.router.route({
          method: 'GET',
          path: `${basename}/plugins/${plugin}/*.*`,
          handler: [
            async (ctx, next) => {
              ctx.url = path.basename(ctx.url);

              // Try to find assets into the build first.
              return await mwapi.koaMiddlewares.static(`./plugins/${plugin}/admin/build`, {
                maxage: mwapi.config.middleware.settings.public.maxAge,
                defer: true
              })(ctx, next);
            },
            async (ctx, next) => {
              // Try to find assets in the source then.
              return await mwapi.koaMiddlewares.static(`./plugins/${plugin}/${mwapi.config.middleware.settings.public.path || mwapi.config.paths.static}`, {
                maxage: mwapi.config.middleware.settings.public.maxAge,
                defer: true
              })(ctx, next);
            },
          ]
        });
      });

      cb();
    }
  };
};
