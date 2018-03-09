'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

module.exports = mwapi => {
  const routerChecker = require('./routerChecker')(mwapi);

  return (value, plugin, router) => cb => {
    if (_.isEmpty(_.get(value, 'method')) || _.isEmpty(_.get(value, 'path'))) {
      return;
    }

    const endpoint = `${value.method} ${value.path}`;

    try {
      const { policies, action, validate } = routerChecker(value, endpoint, plugin);

      if (_.isUndefined(action) || !_.isFunction(action)) {
        return mwapi.log.warn(`Ignored attempt to bind route '${endpoint}' to unknown controller/action.`);
      }

      router.route(
        _.omitBy(
          {
            method: value.method,
            path: value.path,
            handler: _.remove(
              [mwapi.koaMiddlewares.compose(policies), action],
              o => _.isFunction(o)
            ),
            validate
          },
          _.isEmpty
        )
      );
    } catch (err) {
      cb(err);
    }
  }
}
