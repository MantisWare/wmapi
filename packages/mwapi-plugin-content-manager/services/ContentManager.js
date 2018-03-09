'use strict';

const _ = require('lodash');

/**
 * A set of functions called "actions" for `ContentManager`
 */

module.exports = {
  fetchAll: async (params, query) => {
    const { limit, skip = 0, sort, query : request, queryAttribute, source, page } = query;

    // Find entries using `queries` system
    return await mwapi.query(params.model, source).find({
      limit,
      skip,
      sort,
      query: request,
      queryAttribute
    });
  },

  count: async (params, source) => {
    return await mwapi.query(params.model, source).count();
  },

  fetch: async (params, source) => {
    return await mwapi.query(params.model, source).findOne({
      id: params.id
    });
  },

  add: async (params, values, source) => {
    // Multipart/form-data.
    if (values.hasOwnProperty('fields') && values.hasOwnProperty('files')) {
      // Silent recursive parser.
      const parser = (value) => {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Silent.
        }

        return _.isArray(value) ? value.map(obj => parser(obj)) : value;
      };

      const files = values.files;

      // Parse stringify JSON data.
      values = Object.keys(values.fields).reduce((acc, current) => {
        acc[current] = parser(values.fields[current]);

        return acc;
      }, {});

      // Update JSON fields.
      const entry = await mwapi.query(params.model, source).create({
        values
      });

      // Then, request plugin upload.
      if (mwapi.plugins.upload) {
        // Upload new files and attach them to this entity.
        await mwapi.plugins.upload.services.upload.uploadToEntity({
          id: entry.id || entry._id,
          model: params.model
        }, files, source);
      }

      return mwapi.query(params.model, source).findOne({
        id: entry.id || entry._id
      });
    }

    // Create an entry using `queries` system
    return await mwapi.query(params.model, source).create({
      values
    });
  },

  edit: async (params, values, source) => {
    // Multipart/form-data.
    if (values.hasOwnProperty('fields') && values.hasOwnProperty('files')) {
      // Silent recursive parser.
      const parser = (value) => {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Silent.
        }

        return _.isArray(value) ? value.map(obj => parser(obj)) : value;
      };

      const files = values.files;

      // Parse stringify JSON data.
      values = Object.keys(values.fields).reduce((acc, current) => {
        acc[current] = parser(values.fields[current]);

        return acc;
      }, {});

      // Update JSON fields.
      await mwapi.query(params.model, source).update({
        id: params.id,
        values
      });

      // Then, request plugin upload.
      if (mwapi.plugins.upload) {
        // Upload new files and attach them to this entity.
        await mwapi.plugins.upload.services.upload.uploadToEntity(params, files, source);
      }

      return mwapi.query(params.model, source).findOne({
        id: params.id
      });
    }

    // Raw JSON.
    return mwapi.query(params.model, source).update({
      id: params.id,
      values
    });
  },

  delete: async (params, { source }) => {
    const response = await mwapi.query(params.model, source).findOne({
      id: params.id
    });

    params.values = Object.keys(JSON.parse(JSON.stringify(response))).reduce((acc, current) => {
      const association = (mwapi.models[params.model] || mwapi.plugins[source].models[params.model]).associations.filter(x => x.alias === current)[0];

      // Remove relationships.
      if (association) {
        acc[current] = _.isArray(response[current]) ? [] : null;
      }

      return acc;
    }, {});

    if (!_.isEmpty(params.values)) {
      // Run update to remove all relationships.
      await mwapi.query(params.model, source).update(params);
    }

    // Delete an entry using `queries` system
    return await mwapi.query(params.model, source).delete({
      id: params.id
    });
  },
};
