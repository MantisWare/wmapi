'use strict';

/**
 * Upload.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const toArray = require('stream-to-array');
const uuid = require('uuid/v4');

module.exports = {
  bufferize: async files => {
    if (_.isEmpty(files) === 0) {
      throw 'Missing files.';
    }

    // files is always an array to map on
    files = _.isArray(files) ? files : [files];

    // transform all files in buffer
    return Promise.all(
      files.map(async stream => {
        const parts = await toArray(fs.createReadStream(stream.path));
        const buffers = parts.map(
          part => _.isBuffer(part) ? part : Buffer.from(part)
        );

        return {
          name: stream.name,
          hash: uuid().replace(/-/g, ''),
          ext: stream.name.split('.').length > 1 ? `.${_.last(stream.name.split('.'))}` : '',
          buffer: Buffer.concat(buffers),
          mime: stream.type,
          size: (stream.size / 1000).toFixed(2)
        };
      })
    );
  },

  upload: async (files, config) => {
    // Get upload provider settings to configure the provider to use.
    const provider = _.find(mwapi.plugins.upload.config.providers, { provider: config.provider });

    if (!provider) {
      throw new Error(`The provider package isn't installed. Please run \`npm install mwapi-upload-${config.provider}\``);
    }

    const actions = provider.init(config);

    // Execute upload function of the provider for all files.
    return Promise.all(
      files.map(async file => {
        await actions.upload(file);

        // Remove buffer to don't save it.
        delete file.buffer;

        file.provider = provider.provider;

        return await mwapi.plugins['upload'].services.upload.add(file);
      })
    );
  },

  add: async (values) => {
    // Use Content Manager business logic to handle relation.
    if (mwapi.plugins['content-manager']) {
      return await mwapi.plugins['content-manager'].services['contentmanager'].add({
        model: 'file'
      }, values, 'upload');
    }

    return mwapi.query('file', 'upload').create(values);
  },

  edit: async (params, values) => {
    // Use Content Manager business logic to handle relation.
    if (mwapi.plugins['content-manager']) {
      params.model = 'file';
      params.id = (params._id || params.id);

      return await mwapi.plugins['content-manager'].services['contentmanager'].edit(params, values, 'upload');
    }

    return mwapi.query('file', 'upload').update(_.assign(params, values));
  },

  fetch: (params) => {
    return mwapi.query('file', 'upload').findOne(_.pick(params, ['_id', 'id']));
  },

  fetchAll: (params) => {
    return mwapi.query('file', 'upload').find(mwapi.utils.models.convertParams('file', params));
  },

  count: async (params, source) => {
    return await mwapi.query('file', 'upload').count();
  },

  remove: async (params, config) => {
    const file = await mwapi.plugins['upload'].services.upload.fetch(params);

    // get upload provider settings to configure the provider to use
    const provider = _.cloneDeep(_.find(mwapi.plugins.upload.config.providers, {provider: config.provider}));
    _.assign(provider, config);
    const actions = provider.init(config);

    // execute delete function of the provider
    if (file.provider === provider.provider) {
      await actions.delete(file);
    }

    // Use Content Manager business logic to handle relation.
    if (mwapi.plugins['content-manager']) {
      params.model = 'file';
      params.id = (params._id || params.id);

      await mwapi.plugins['content-manager'].services['contentmanager'].delete(params, {source: 'upload'});
    }

    return mwapi.query('file', 'upload').delete(params);
  },

  uploadToEntity: async function (params, files, source) {
    // Retrieve provider settings from database.
    const config = await mwapi.store({
      environment: mwapi.config.environment,
      type: 'plugin',
      name: 'upload'
    }).get({ key: 'provider' });

    const model = source && source !== 'content-manager' ?
      mwapi.plugins[source].models[params.model]:
      mwapi.models[params.model];

    // Asynchronous upload.
    await Promise.all(
      Object.keys(files)
        .map(async attribute => {
          // Bufferize files per attribute.
          const buffers = await this.bufferize(files[attribute]);
          const enhancedFiles = buffers.map(file => {
            const details = model.attributes[attribute];

            // Add related information to be able to make
            // the relationships later.
            file[details.via] = [{
              refId: params.id,
              ref: params.model,
              source,
              field: attribute,
            }];

            return file;
          });

          // Make upload async.
          return this.upload(enhancedFiles, config);
        })
    );
  }
};
