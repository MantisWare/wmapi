'use strict';

// Starting date
global.startedAt = Date.now();

/**
 * Instantiate and expose a mwapi singleton
 * (maintains legacy support).
 */

module.exports = function(global) {
  try {
    return global.mwapi = require('./mwapi'); // mwapi instance instanciated
  } catch (error) {
    console.log(error);
  }
}.call(this, global);
