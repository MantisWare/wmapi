'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Service = require('../services/ContentTypeBuilder');

module.exports = {
  getModels: async ctx => {
    ctx.send({ models: Service.getModels() });
  },

  getModel: async ctx => {
    const Service = mwapi.plugins['content-type-builder'].services.contenttypebuilder;
    const { source } = ctx.request.query;

    let { model } = ctx.params;

    model = _.toLower(model);

    if (!source && !_.get(mwapi.models, model)) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.unknow' }] }]);

    if (source && !_.get(mwapi.plugins, [source, 'models', model])) {
      return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.unknow' }] }]);
    }

    ctx.send({ model: Service.getModel(model, source) });
  },

  getConnections: async ctx => {
    ctx.send({ connections: Service.getConnections() });
  },

  createModel: async ctx => {
    const { name, description, connection, collectionName, attributes = [], plugin } = ctx.request.body;

    if (!name) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.name.missing' }] }]);
    if (!_.includes(Service.getConnections(), connection)) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.connection.unknow' }] }]);
    if (mwapi.models[name]) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.exist' }] }]);
    if (!_.isNaN(parseFloat(name[0]))) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.name' }] }]);

    const [formatedAttributes, attributesErrors] = Service.formatAttributes(attributes, name, plugin);

    if (!_.isEmpty(attributesErrors)) {
      return ctx.badRequest(null, [{ messages: attributesErrors }]);
    }

    mwapi.reload.isWatching = false;

    await Service.generateAPI(name, description, connection, collectionName, []);

    const modelFilePath = Service.getModelPath(name, plugin);

    try {
      const modelJSON = _.cloneDeep(require(modelFilePath));

      modelJSON.attributes = formatedAttributes;

      const clearRelationsErrors = Service.clearRelations(name, plugin);

      if (!_.isEmpty(clearRelationsErrors)) {
        return ctx.badRequest(null, [{ messages: clearRelationsErrors }]);
      }

      const createRelationsErrors = Service.createRelations(name, attributes, plugin);

      if (!_.isEmpty(createRelationsErrors)) {
        return ctx.badRequest(null, [{ messages: createRelationsErrors }]);
      }

      try {
        fs.writeFileSync(modelFilePath, JSON.stringify(modelJSON, null, 2), 'utf8');

        ctx.send({ ok: true });

        mwapi.reload();
      } catch (e) {
        return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.write' }] }]);
      }
    } catch (e) {
      return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.read' }] }]);
    }
  },

  updateModel: async ctx => {
    const { model } = ctx.params;
    const { name, description, connection, collectionName, attributes = [], plugin } = ctx.request.body;

    if (!name) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.name.missing' }] }]);
    if (!_.includes(Service.getConnections(), connection)) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.connection.unknow' }] }]);
    if (mwapi.models[_.toLower(name)] && name !== model) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.exist' }] }]);
    if (!mwapi.models[_.toLower(model)] && plugin && !mwapi.plugins[_.toLower(plugin)].models[_.toLower(model)]) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.unknow' }] }]);
    if (!_.isNaN(parseFloat(name[0]))) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.name' }] }]);
    if (plugin && !mwapi.plugins[_.toLower(plugin)]) return ctx.badRequest(null, [{ message: [{ id: 'request.error.plugin.name' }] }]);

    const [formatedAttributes, attributesErrors] = Service.formatAttributes(attributes, name.toLowerCase(), plugin);

    if (!_.isEmpty(attributesErrors)) {
      return ctx.badRequest(null, [{ messages: attributesErrors }]);
    }

    let modelFilePath = Service.getModelPath(model, plugin);

    mwapi.reload.isWatching = false;

    if (name !== model) {
      await Service.generateAPI(name, description, connection, collectionName, []);
    }

    try {
      const modelJSON = _.cloneDeep(require(modelFilePath));

      modelJSON.attributes = formatedAttributes;
      modelJSON.info = {
        name,
        description
      };
      modelJSON.connection = connection;
      modelJSON.collectionName = collectionName;

      const clearRelationsErrors = Service.clearRelations(model, plugin);

      if (!_.isEmpty(clearRelationsErrors)) {
        return ctx.badRequest(null, [{ messages: clearRelationsErrors }]);
      }

      const createRelationsErrors = Service.createRelations(name, attributes, plugin);

      if (!_.isEmpty(createRelationsErrors)) {
        return ctx.badRequest(null, [{ messages: createRelationsErrors }]);
      }

      if (name !== model) {
        const removeModelErrors = Service.removeModel(model);

        if (!_.isEmpty(removeModelErrors)) {
          return ctx.badRequest(null, [{ messages: removeModelErrors }]);
        }

        modelFilePath = Service.getModelPath(name, plugin);
      }

      try {
        fs.writeFileSync(modelFilePath, JSON.stringify(modelJSON, null, 2), 'utf8');

        ctx.send({ ok: true });

        mwapi.reload();
      } catch (e) {
        return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.write' }] }]);
      }
    } catch (e) {
      return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.read' }] }]);
    }
  },

  deleteModel: async ctx => {
    const { model } = ctx.params;

    if (!_.get(mwapi.models, model)) return ctx.badRequest(null, [{ messages: [{ id: 'request.error.model.unknow' }] }]);

    mwapi.reload.isWatching = false;

    const clearRelationsErrors = Service.clearRelations(model);

    if (!_.isEmpty(clearRelationsErrors)) {
      return ctx.badRequest(null, [{ messages: clearRelationsErrors }]);
    }

    const removeModelErrors = Service.removeModel(model);

    if (!_.isEmpty(removeModelErrors)) {
      return ctx.badRequest(null, [{ messages: removeModelErrors }]);
    }

    ctx.send({ ok: true });

    mwapi.reload();
  },

  autoReload: async ctx => {
    ctx.send({
      autoReload: _.get(mwapi.config.environments, 'development.server.autoReload', false),
    });
  },

  checkTableExists: async ctx => {
    // Get connection
    const { connection } = ctx.params;

    const connector = _.get(mwapi.config.currentEnvironment.database.connections, [connection, 'connector']);
    const model = _.toLower(ctx.params.model);

    if (!model) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Model is required' }] }]);
    }

    if (!connector) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Connection doesn\'t exist' }] }]);
    }

    if (connector === 'mwapi-bookshelf') {
      try {
        const tableExists = await mwapi.connections[connection].schema.hasTable(model);

        return ctx.send({ tableExists });
      } catch(error) {
        return ctx.badRequest(null, [{ messages: [{ id: 'Not found' }] }]);
      }
    }

    ctx.send({ tableExists: true })
  }
};
