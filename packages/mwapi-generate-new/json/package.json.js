'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const uuid = require('uuid/v4');

/**
 * Expose main package JSON of the application
 * with basic info, dependencies, etc.
 */

module.exports = scope => {
  const cliPkg = scope.mwapiPackageJSON || {};

  // Finally, return the JSON.
  return _.merge(scope.appPackageJSON || {}, {
    'name': scope.name,
    'private': true,
    'version': '0.1.0',
    'description': 'A mwapi application.',
    'main': './server.js',
    'scripts': {
      'setup': 'cd admin && npm run setup', // Ready to deploy setup
      'start': 'node server.js',
      'mwapi': 'node_modules/mwapi/bin/mwapi.js', // Allow to use `npm run mwapi` CLI,
      'lint': 'node_modules/.bin/eslint api/**/*.js config/**/*.js plugins/**/*.js',
      'postinstall': 'node node_modules/mwapi/lib/utils/post-install.js'
    },
    'devDependencies': {
      'babel-eslint': '^7.1.1',
      'eslint': '^3.12.2',
      'eslint-config-airbnb': '^13.0.0',
      'eslint-plugin-import': '^2.2.0',
      'eslint-plugin-react': '^6.8.0'
    },
    'dependencies': {
      'lodash': '4.x.x',
      'mwapi': getDependencyVersion(cliPkg, 'mwapi'),
      [scope.client.connector]: getDependencyVersion(cliPkg, 'mwapi'),
      [scope.client.module]: scope.client.version
    },
    'author': {
      'name': scope.author || 'A mwapi developer',
      'email': scope.email || '',
      'url': scope.website || ''
    },
    'maintainers': [{
      'name': scope.author || 'A mwapi developer',
      'email': scope.email || '',
      'url': scope.website || ''
    }],
    'mwapi': {
      'uuid': uuid()
    },
    'engines': {
      'node': '>= 7.0.0',
      'npm': '>= 3.0.0'
    },
    'license': scope.license || 'MIT'
  });
};

/**
 * Get dependencies version
 */

function getDependencyVersion(packageJSON, module) {
  return module === packageJSON.name ? packageJSON.version : packageJSON.dependencies && packageJSON.dependencies[module];
}
