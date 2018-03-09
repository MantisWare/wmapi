'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

/**
 * Check that we're in a valid mwapi project.
 *
 * @returns {boolean}
 */

const ismwapiApp = () => {
  const pathToPackageJSON = path.resolve(process.cwd(), 'package.json');
  let validPackageJSON = true;

  try {
    require(pathToPackageJSON);
  } catch (e) {
    validPackageJSON = false;
  }

  return validPackageJSON;
};

module.exports = {
  ismwapiApp
};
