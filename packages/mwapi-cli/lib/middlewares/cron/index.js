'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const cron = require('node-schedule');

/**
 * CRON hook
 */

module.exports = mwapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      _.forEach(_.keys(mwapi.config.functions.cron), task => {
        cron.scheduleJob(task, mwapi.config.functions.cron[task]);
      });

      cb();
    }
  };
};
