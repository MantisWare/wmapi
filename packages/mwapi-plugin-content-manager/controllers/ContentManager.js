'use strict';

const _ = require('lodash');

/**
 * A set of functions called "actions" for `ContentManager`
 */

module.exports = {
  models: async ctx => {
    const pickData = (model) => _.pick(model, [
      'info',
      'connection',
      'collectionName',
      'attributes',
      'identity',
      'globalId',
      'globalName',
      'orm',
      'loadedModel',
      'primaryKey',
      'associations'
    ]);

    const models = _.mapValues(mwapi.models, pickData);
    delete models['core_store'];

    ctx.body = {
      models,
      plugins: Object.keys(mwapi.plugins).reduce((acc, current) => {
        acc[current] = {
          models: _.mapValues(mwapi.plugins[current].models, pickData)
        };

        return acc;
      }, {})
    };
  },

  find: async ctx => {
    ctx.body = await mwapi.plugins['content-manager'].services['contentmanager'].fetchAll(ctx.params, ctx.request.query);
  },

  count: async ctx => {
    const { source } = ctx.request.query;

    // Count using `queries` system
    const count = await mwapi.plugins['content-manager'].services['contentmanager'].count(ctx.params, source);

    ctx.body = {
      count: _.isNumber(count) ? count : _.toNumber(count)
    };
  },

  findOne: async ctx => {
    const { source } = ctx.request.query;

    // Find an entry using `queries` system
    const entry = await mwapi.plugins['content-manager'].services['contentmanager'].fetch(ctx.params, source);

    // Entry not found
    if (!entry) {
      return (ctx.notFound('Entry not found'));
    }

    ctx.body = entry;
  },

  create: async ctx => {
    const { source } = ctx.request.query;

    try {
      // Create an entry using `queries` system
      ctx.body = await mwapi.plugins['content-manager'].services['contentmanager'].add(ctx.params, ctx.request.body, source);
    } catch(error) {
      mwapi.log.error(error);
      ctx.badRequest(null, ctx.request.admin ? [{ messages: [{ id: error.message, field: error.field }] }] : error.message);
    }
  },

  update: async ctx => {
    const { source } = ctx.request.query;

    try {
      // Return the last one which is the current model.
      ctx.body = await mwapi.plugins['content-manager'].services['contentmanager'].edit(ctx.params, ctx.request.body, source);
    } catch(error) {
      // TODO handle error update
      mwapi.log.error(error);
      ctx.badRequest(null, ctx.request.admin ? [{ messages: [{ id: error.message, field: error.field }] }] : error.message);
    }
  },

  delete: async ctx => {
    ctx.body = await mwapi.plugins['content-manager'].services['contentmanager'].delete(ctx.params, ctx.request.query);
  },
};
