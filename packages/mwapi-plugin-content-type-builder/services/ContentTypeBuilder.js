'use strict';

const path = require('path')
const fs = require('fs');
const _ = require('lodash');
const generator = require('mwapi-generate');

module.exports = {
  getModels: () => {
    const models = [];

    _.forEach(mwapi.models, (model, name) => {
      if (name === 'core_store') {
        return true;
      }

      models.push({
        icon: 'fa-cube',
        name: _.get(model, 'info.name', 'model.name.missing'),
        description: _.get(model, 'info.description', 'model.description.missing'),
        fields: _.keys(model.attributes).length
      });
    });

    const pluginModels = Object.keys(mwapi.plugins).reduce((acc, current) => {
      _.forEach(mwapi.plugins[current].models, (model, name) => {
        acc.push({
          icon: 'fa-cube',
          name: _.get(model, 'info.name', 'model.name.missing'),
          description: _.get(model, 'info.description', 'model.description.missing'),
          fields: _.keys(model.attributes).length,
          source: current,
        });
      });

      return acc;
    }, []);

    return models.concat(pluginModels);
  },

  getModel: (name, source) => {
    name = _.toLower(name);

    const model = source ? _.get(mwapi.plugins, [source, 'models', name]) : _.get(mwapi.models, name);

    const attributes = [];
    _.forEach(model.attributes, (params, name) => {
      const relation = _.find(model.associations, { alias: name });

      if (relation &&  !_.isArray(_.get(relation, relation.alias))) {
        if (params.plugin === 'upload' && relation.model || relation.collection === 'file') {
          params = {
            type: 'media',
            multiple: params.collection ? true : false
          };
        } else {
          params = _.omit(params, ['collection', 'model', 'via']);
          params.target = relation.model || relation.collection;
          params.key = relation.via;
          params.nature = relation.nature;
          params.targetColumnName = _.get((params.plugin ? mwapi.plugins[params.plugin].models : mwapi.models )[params.target].attributes[params.key], 'columnName', '');
        }
      }

      attributes.push({
        name,
        params
      });
    });

    return {
      name: _.get(model, 'info.name', 'model.name.missing'),
      description: _.get(model, 'info.description', 'model.description.missing'),
      connection: model.connection,
      collectionName: model.collectionName,
      attributes: attributes
    };
  },

  getConnections: () => {
    return _.keys(mwapi.config.currentEnvironment.database.connections);
  },

  generateAPI: (name, description, connection, collectionName, attributes) => {
    const template = _.get(mwapi.config.currentEnvironment, `database.connections.${connection}.connector`, 'mwapi-mongoose').split('-')[1];

    return new Promise((resolve, reject) => {
      const scope = {
        generatorType: 'api',
        id: name.toLowerCase(),
        rootPath: mwapi.config.appPath,
        args: {
          api: name,
          description: _.replace(description, /\"/g, '\\"'),
          attributes,
          connection,
          collectionName: !_.isEmpty(collectionName) ? collectionName : undefined,
          tpl: template
        }
      };

      generator(scope, {
        success: () => {
          resolve();
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  },

  getModelPath: (model, plugin) => {
    // Retrieve where is located the model.
    // Note: The target is not found when we are creating a new API. That's why, we are returning the lowercased model.
    const target = Object.keys((plugin ? mwapi.plugins : mwapi.api) || {})
      .filter(x => _.includes(Object.keys(_.get((plugin ? mwapi.plugins : mwapi.api)[x], 'models', [])), model.toLowerCase()))[0] || model.toLowerCase();

    // Retrieve the filename of the model.
    const filename = fs.readdirSync(plugin ? path.join(mwapi.config.appPath, 'plugins', target, 'models') : path.join(mwapi.config.appPath, 'api', target, 'models'))
      .filter(x => x[0] !== '.')
      .filter(x => x.split('.settings.json')[0].toLowerCase() === model.toLowerCase())[0];

    return plugin ?
      path.resolve(mwapi.config.appPath, 'plugins', target, 'models', filename):
      path.resolve(mwapi.config.appPath, 'api', target, 'models', filename);
  },

  formatAttributes: (attributes, name, plugin) => {
    const errors = [];
    const attrs = {};

    const target = Object.keys((plugin ? mwapi.plugins : mwapi.api) || {})
      .filter(x => _.includes(Object.keys(_.get((plugin ? mwapi.plugins : mwapi.api)[x], 'models', [])), name))[0] || name.toLowerCase();

    const model = (plugin ? _.get(mwapi.plugins, [target, 'models', name]) : _.get(mwapi.api, [target, 'models', name])) || {};

    // Only select configurable attributes.
    const attributesConfigurable = attributes.filter(attribute => _.get(model, ['attributes', attribute.name, 'configurable'], true) !== false);
    const attributesNotConfigurable = Object.keys(model.attributes || {})
      .filter(attribute => _.get(model, ['attributes', attribute, 'configurable'], true) === false)
      .reduce((acc, attribute) => {
        acc[attribute] = model.attributes[attribute];

        return acc;
      }, {});

    _.forEach(attributesConfigurable, attribute => {
      if (_.has(attribute, 'params.type')) {
        attrs[attribute.name] = attribute.params;

        if (attribute.params.type === 'media') {
          const via = _.findKey(mwapi.plugins.upload.models.file.attributes, {collection: '*'});

          attrs[attribute.name] = {
            [attribute.params.multiple ? 'collection' : 'model']: 'file',
            via,
            plugin: 'upload'
          }
        }
      } else if (_.has(attribute, 'params.target')) {
        const relation = attribute.params;
        const attr = {
          required: relation.required,
          columnName: relation.columnName,
          unique: relation.unique
        };

        switch (relation.nature) {
          case 'oneToOne':
          case 'manyToOne':
            attr.model = relation.target;
            break;
          case 'manyToMany':
          case 'oneToMany':
            attr.collection = relation.target;
            break;
          default:
        }

        attr.via = relation.key;
        attr.dominant = relation.dominant;
        attr.plugin = relation.pluginValue;

        attrs[attribute.name] = attr;
      }

      if (!_.isNaN(parseFloat(attribute.name[0])) || !_.isNaN(parseFloat(_.get(attribute, 'params.key'), NaN))) {
        errors.push({
          id: 'request.error.attribute.values',
          params: {
            attribute
          }
        });
      }
    });

    Object.assign(attributesNotConfigurable, attrs);

    return [attributesNotConfigurable, errors];
  },

  clearRelations: (model, source) => {
    const errors = [];
    const structure = {
      models: mwapi.models,
      plugins: Object.keys(mwapi.plugins).reduce((acc, current) => {
        acc[current] = {
          models: mwapi.plugins[current].models
        };

        return acc;
      }, {})
    };

    // Method to delete the association of the models.
    const deleteAssociations = (models, plugin) => {
      Object.keys(models).forEach(name => {
        const relationsToDelete = _.get(plugin ? mwapi.plugins[plugin].models[name] : mwapi.models[name], 'associations', []).filter(association => {
          if (source) {
            return association[association.type] === model && association.plugin === source;
          }

          return association[association.type] === model;
        });

        if (!_.isEmpty(relationsToDelete)) {
          // Retrieve where is located the model.
          const target = Object.keys((plugin ? mwapi.plugins : mwapi.api) || {})
            .filter(x => _.includes(Object.keys(_.get((plugin ? mwapi.plugins : mwapi.api)[x], 'models', [])), name))[0];

          // Retrieve the filename of the model.
          const filename = fs.readdirSync(plugin ? path.join(mwapi.config.appPath, 'plugins', target, 'models') : path.join(mwapi.config.appPath, 'api', target, 'models'))
            .filter(x => x[0] !== '.')
            .filter(x => x.split('.settings.json')[0].toLowerCase() === name)[0];

          // Path to access to the model.
          const pathToModel = plugin ?
            path.resolve(mwapi.config.appPath, 'plugins', target, 'models', filename):
            path.resolve(mwapi.config.appPath, 'api', target, 'models', filename);

          // Require the model.
          const modelJSON = require(pathToModel);

          _.forEach(relationsToDelete, relation => {
            modelJSON.attributes[relation.alias] = undefined;
          });

          try {
            fs.writeFileSync(pathToModel, JSON.stringify(modelJSON, null, 2), 'utf8');
          } catch (e) {
            errors.push({
              id: 'request.error.model.write',
              params: {
                filePath: pathToModel
              }
            });
          }
        }
      });
    };

    // Update `./api` models.
    deleteAssociations(structure.models);

    Object.keys(structure.plugins).forEach(name => {
      // Update `./plugins/${name}` models.
      deleteAssociations(structure.plugins[name].models, name);
    });

    return errors;
  },

  createRelations: (model, attributes, source) => {
    const errors = [];
    const structure = {
      models: mwapi.models,
      plugins: Object.keys(mwapi.plugins).reduce((acc, current) => {
        acc[current] = {
          models: mwapi.plugins[current].models
        };

        return acc;
      }, {})
    };

    // Method to update the model
    const update = (models, plugin) => {
      Object.keys(models).forEach(name => {
        const relationsToCreate = attributes.filter(attribute => {
          if (plugin) {
            return _.get(attribute, 'params.target') === name && _.get(attribute, 'params.pluginValue') === plugin;
          }

          return _.get(attribute, 'params.target') === name && _.isEmpty(_.get(attribute, 'params.pluginValue', ''));
        });

        if (!_.isEmpty(relationsToCreate)) {
          // Retrieve where is located the model.
          const target = Object.keys((plugin ? mwapi.plugins : mwapi.api) || {})
            .filter(x => _.includes(Object.keys(_.get((plugin ? mwapi.plugins : mwapi.api)[x], 'models', [])), name))[0];

          // Retrieve the filename of the model.
          const filename = fs.readdirSync(plugin ? path.join(mwapi.config.appPath, 'plugins', target, 'models') : path.join(mwapi.config.appPath, 'api', target, 'models'))
            .filter(x => x[0] !== '.')
            .filter(x => x.split('.settings.json')[0].toLowerCase() === name)[0];

          // Path to access to the model.
          const pathToModel = plugin ?
            path.resolve(mwapi.config.appPath, 'plugins', target, 'models', filename):
            path.resolve(mwapi.config.appPath, 'api', target, 'models', filename);

          const modelJSON = require(pathToModel);

          _.forEach(relationsToCreate, ({ name, params }) => {
            const attr = {};

            switch (params.nature) {
              case 'oneToOne':
              case 'oneToMany':
                attr.model = model.toLowerCase();
                break;
              case 'manyToOne':
              case 'manyToMany':
                attr.collection = model.toLowerCase();
                break;
              default:
            }

            attr.via = name;
            attr.columnName = params.targetColumnName;
            attr.plugin = source;

            modelJSON.attributes[params.key] = attr;

            try {
              fs.writeFileSync(pathToModel, JSON.stringify(modelJSON, null, 2), 'utf8');
            } catch (e) {
              errors.push({
                id: 'request.error.model.write',
                params: {
                  filePath: pathToModel
                }
              });
            }
          });
        }
      });
    };

    // Update `./api` models.
    update(structure.models);

    Object.keys(structure.plugins).forEach(name => {
      // Update `./plugins/${name}` models.
      update(structure.plugins[name].models, name);
    });

    return errors;
  },

  removeModel: model => {
    model = _.toLower(model);

    const errors = [];
    const apiPath = path.join(mwapi.config.appPath, 'api');

    const deleteModelFile = (parentPath, fileName) => {
      const filePath = path.join(parentPath, fileName);

      if (_.startsWith(`${_.toLower(fileName)}.`, `${model}.`)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          errors.push({
            id: 'request.error.file.unlink',
            params: {
              filePath
            }
          });
        }
      }

      if (fileName === 'routes.json') {
        const routesJSON = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        _.remove(routesJSON.routes, function(route) {
          return _.startsWith(_.toLower(route.handler), model);
        });

        if (_.isEmpty(routesJSON.routes)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            errors.push({
              id: 'request.error.route.unlink',
              params: {
                filePath
              }
            });
          }
        } else {
          try {
            fs.writeFileSync(filePath, JSON.stringify(routesJSON, null, 2), 'utf8');
          } catch (e) {
            errors.push({
              id: 'request.error.route.write',
              params: {
                filePath
              }
            });
          }
        }
      }
    }

    const recurciveDeleteFiles = folderPath => {
      try {
        const items = fs.readdirSync(folderPath).filter(x => x[0] !== '.');

        _.forEach(items, item => {
          const itemPath = path.join(folderPath, item);

          if (fs.lstatSync(itemPath).isDirectory()) {
            recurciveDeleteFiles(itemPath);
          } else {
            deleteModelFile(folderPath, item);
          }
        });

        if (_.isEmpty(fs.readdirSync(folderPath).filter(x => x[0] !== '.'))) {
          try {
            fs.rmdirSync(folderPath);
          } catch (e) {
            errors.push({
              id: 'request.error.folder.unlink',
              params: {
                folderPath
              }
            });
          }
        }
      } catch (e) {
        errors.push({
          id: 'request.error.folder.read',
          params: {
            folderPath
          }
        });
      }
    }

    recurciveDeleteFiles(apiPath);

    return errors;
  }
};
