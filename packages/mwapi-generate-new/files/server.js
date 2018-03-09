'use strict';

/**
 * Use `server.js` to run your application without `$ mwapi start`.
 * To start the server, run: `$ npm start`.
 *
 * This is handy in situations where the mwapi CLI is not relevant or useful.
 */

process.chdir(__dirname);

(() => {
  const mwapi = require('mwapi');
  mwapi.start();
})();
