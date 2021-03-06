'use strict';

/**
 * Upload.js controller
 *
 * @description: A set of functions called "actions" of the `upload` plugin.
 */

const _ = require('lodash');

module.exports = {
  upload: async (ctx) => {
    // Retrieve provider configuration.
    const config = await mwapi.store({
      environment: mwapi.config.environment,
      type: 'plugin',
      name: 'upload'
    }).get({ key: 'provider' });

    // Verify if the file upload is enable.
    if (config.enabled === false) {
      mwapi.log.error('File upload is disabled');
      return ctx.badRequest(null, ctx.request.admin ? [{ messages: [{ id: 'Upload.status.disabled' }] }] : 'File upload is disabled');
    }

    // Extract optional relational data.
    const { refId, ref, source, field } = ctx.request.body.fields;
    const { files = {} } = ctx.request.body.files;

    if (_.isEmpty(files)) {
      return ctx.send(true);
    }

    // Transform stream files to buffer
    const buffers = await mwapi.plugins.upload.services.upload.bufferize(ctx.request.body.files.files);
    const enhancedFiles = buffers.map(file => {
        if (file.size > config.sizeLimit) {
          return ctx.badRequest(null, ctx.request.admin ? [{ messages: [{ id: 'Upload.status.sizeLimit', values: {file: file.name} }] }] : `${file.name} file is bigger than limit size!`);
        }

        // Add details to the file to be able to create the relationships.
        if (refId && ref && field) {
          Object.assign(file, {
            related: [{
              refId,
              ref,
              source,
              field
            }]
          });
        }

        return file;
      });

    // Something is wrong (size limit)...
    if (ctx.status === 400) {
      return;
    }

    const uploadedFiles = await mwapi.plugins.upload.services.upload.upload(enhancedFiles, config);

    // Send 200 `ok`
    ctx.send(uploadedFiles.map((file) => {
      // If is local server upload, add backend host as prefix
      if (file.url && file.url[0] === '/') {
        file.url = mwapi.config.url + file.url;
      }

      if (_.isArray(file.related)) {
        file.related = file.related.map(obj => obj.ref || obj);
      }

      return file;
    }));
  },

  getEnvironments: async (ctx) => {
    const environments =  _.map(_.keys(mwapi.config.environments), environment => {
      return {
        name: environment,
        active: (mwapi.config.environment === environment)
      };
    });

    ctx.send({ environments });
  },

  getSettings: async (ctx) => {
    const config = await mwapi.store({
      environment: ctx.params.environment,
      type: 'plugin',
      name: 'upload'
    }).get({key: 'provider'});

    ctx.send({
      providers: mwapi.plugins.upload.config.providers,
      config
    });
  },

  updateSettings: async (ctx) => {
    await mwapi.store({
      environment: ctx.params.environment,
      type: 'plugin',
      name: 'upload'
    }).set({key: 'provider', value: ctx.request.body});

    ctx.send({ok: true});
  },

  find: async (ctx) => {
    const data = await mwapi.plugins['upload'].services.upload.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data.map((file) => {
      // if is local server upload, add backend host as prefix
      if (file.url[0] === '/') {
        file.url = mwapi.config.url + file.url;
      }

      return file;
    }));
  },

  count: async (ctx, next) => {
    const data = await mwapi.plugins['upload'].services.upload.count(ctx.query);

    // Send 200 `ok`
    ctx.send({
      count: data
    });
  },

  destroy: async (ctx, next) => {
    const config = await mwapi.store({
      environment: mwapi.config.environment,
      type: 'plugin',
      name: 'upload'
    }).get({key: 'provider'});

    const data = await mwapi.plugins['upload'].services.upload.remove(ctx.params, config);

    // Send 200 `ok`
    ctx.send(data);
  },

  search: async (ctx) => {
    const data = await mwapi.query('file', 'upload').search(ctx.params);

    ctx.send(data);
  },
};
