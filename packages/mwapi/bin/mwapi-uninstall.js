#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Logger.
const { cli, logger } = require('mwapi-utils');

/**
 * `$ mwapi uninstall`
 *
 * Uninstall a mwapi plugin.
 */

module.exports = function (plugin) {
  // Define variables.
  const pluginPath = `./plugins/${plugin}`;

  // Check that we're in a valid mwapi project.
  if (!cli.ismwapiApp()) {
    return logger.error('This command can only be used inside a mwapi project.');
  }

  // Check that the plugin is installed.
  if (!fs.existsSync(pluginPath)) {
    logger.error(`It looks like this plugin is not installed. Please check that \`${pluginPath}\` folder exists.`);
    process.exit(1);
  }

  // Delete the plugin folder.
  rimraf(pluginPath, (err) => {
    if (err) {
      logger.error('An error occurred during plugin uninstallation.');
      process.exit(1);
    }

    // Success.
    logger.info('The plugin has been successfully uninstalled.');
    process.exit(0);
  });
};
