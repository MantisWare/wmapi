#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Master of ceremonies for generators.
const generate = require('mwapi-generate');

// Local mwapi dependencies.
const packageJSON = require('../package.json');

// Logger.
const { cli, logger } = require('mwapi-utils');

/**
 * `$ mwapi generate`
 *
 * Scaffolding for the application in our working directory.
 */

module.exports = function (id, cliArguments) {
  // Build initial scope.
  const scope = {
    rootPath: process.cwd(),
    mwapiRoot: path.resolve(__dirname, '..'),
    id: id,
    args: cliArguments,
    mwapiPackageJSON: packageJSON
  };

  // Register the generator type.
  // It can be a controller, model, service, etc.
  scope.generatorType = process.argv[2].split(':')[1];

  // Check that we're in a valid mwapi project.
  if (scope.generatorType !== 'new' || scope.generatorType !== 'generator' || scope.generatorType !== 'hook') {
    if (!cli.ismwapiApp()) {
      return logger.error('This command can only be used inside a mwapi project.');
    }
  }

  // Show usage if no generator type is defined.
  if (!scope.generatorType) {
    return logger.error('Write `$ mwapi generate:something` instead.');
  }

  // Return the scope and the response (`error` or `success`).
  return generate(scope, {

    // Log and exit the REPL in case there is an error
    // while we were trying to generate the requested generator.
    error: function returnError(msg) {
      logger.error(msg);
      process.exit(1);
    },

    // Log and exit the REPL in case of success
    // but first make sure we have all the info we need.
    success: function returnSuccess() {
      if (!scope.outputPath && scope.filename && scope.destDir) {
        scope.outputPath = scope.destDir + scope.filename;
      }

      if (scope.generatorType !== 'new') {
        logger.info('Generated a new ' + scope.generatorType + ' `' + scope.humanizeId + '` at ' + scope.humanizedPath + '.');
      }

      process.exit(0);
    }
  });
};
