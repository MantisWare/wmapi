// Node.js core.
const REPL = require('repl');
const cluster = require('cluster');
const path = require('path');

// Public node modules.
const _ = require('lodash');
const { logger } = require('mwapi-utils');

module.exports = function () {
  try {
    // Now load up the mwapi framework for real.
    const mwapi = function () {
      try {
        return require(path.resolve(process.cwd(), 'node_modules', 'mwapi'));
      } catch (e) {
        return require('mwapi');
      }
    }();

    // Only log if the process is a master.
    if (cluster.isMaster) {
      mwapi.log.info('Starting the application in interactive mode...');
    }

    mwapi.start({}, function (err) {

      // Log and exit the REPL in case there is an error
      // while we were trying to start the server.
      if (err) {
        mwapi.log.error('Could not load the mwapi framework.');
        mwapi.log.error('Are you using the latest stable version?');
        process.exit(1);
      }

      // Open the Node.js REPL.
      if ((cluster.isMaster && _.isEmpty(cluster.workers)) || cluster.worker.id === 1) {
        const repl = REPL.start(mwapi.config.info.name + ' > ' || 'mwapi > ');

        repl.on('exit', function (err) {

          // Log and exit the REPL in case there is an error
          // while we were trying to open the REPL.
          if (err) {
            mwapi.log.error(err);
            process.exit(1);
          }

          mwapi.stop();
        });
      }
    });
  } catch (e) {
    logger.error(e);
  }
};
