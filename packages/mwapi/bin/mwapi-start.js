#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const cp = require('child_process');
const path = require('path');
const cluster = require('cluster');

// Public dependencies
const _ = require('lodash');
const fs = require('fs');
const semver = require('semver')

// Logger.
const { cli, logger } = require('mwapi-utils');

/**
 * `$ mwapi start`
 *
 * Expose method which starts the appropriate instance of mwapi
 * (fire up the application in our working directory).
 */

module.exports = function() {
  try {
    const mwapi = function () {
      try {
        return require(path.resolve(process.cwd(), 'node_modules', 'mwapi'));
      } catch (e) {
        return require('mwapi');
      }
    }();

    // Set NODE_ENV
    if (_.isEmpty(process.env.NODE_ENV)) {
      process.env.NODE_ENV = 'development';
    }

    // Require server configurations
    const server = require(path.resolve(
      process.cwd(),
      'config',
      'environments',
      'development',
      'server.json'
    ));

    if (process.env.NODE_ENV === 'development' && _.get(server, 'autoReload.enabled') === true) {
      const restart = path => {
        if (mwapi.reload.isWatching && cluster.isWorker && !mwapi.reload.isReloading) {
          mwapi.reload.isReloading = true;
          mwapi.log.info(`File changed: ${path}`);
          mwapi.reload();
        }
      };

      const setFilesToWatch = (src) => {
        var files = fs.readdirSync(src);
        _.forEach(files, file => {
          if (
            _.startsWith(file, '.') ||
            file === 'node_modules' ||
            file === 'plugins.json' ||
            file === 'index.html'   ||
            file === 'public'
          ) {
            return;
          }

          const filePath = `${src}/${file}`;
          if (fs.statSync(filePath).isDirectory()) setFilesToWatch(filePath);
          else fs.watchFile(filePath, (evt, path) => restart(filePath));
        });
      };

      setFilesToWatch(process.cwd());



      if (cluster.isMaster) {
        cluster.on('message', (worker, message) => {
          switch (message) {
            case 'reload':
              mwapi.log.info('The server is restarting\n');

              _.forEach(cluster.workers, worker => worker.send('isKilled'));
              break;
            case 'kill':
              _.forEach(cluster.workers, worker => worker.kill());

              cluster.fork();
              break;
            case 'stop':
              _.forEach(cluster.workers, worker => worker.kill());

              process.exit(0);
              break;
            default:
              return;
          }
        });

        cluster.fork();
      }

      if (cluster.isWorker) {
        process.on('message', (message) => {
          switch (message) {
            case 'isKilled':
              mwapi.server.destroy(() => {
                process.send('kill');
              });
              break;
            default:
             // Do nothing.
          }
        });

        return mwapi.start(afterwards);
      } else {
        return;
      }
    }

    // Otherwise, if no workable local `mwapi` module exists,
    // run the application using the currently running version
    // of `mwapi`. This is probably always the global install.
    mwapi.start(afterwards);
  } catch (e) {
    logger.error(e);
    process.exit(0);
  }
};

function afterwards(err, mwapi) {
  if (err) {
    logger.error(err.stack ? err.stack : err);

    mwapi ? mwapi.stop() : process.exit(1);
  }
}
