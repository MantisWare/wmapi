'use strict';

const path = require('path');
const exec = require('child_process').execSync;

/**
 * A set of functions called "actions" for `Admin`
 */

module.exports = {
  getCurrentEnvironment: async ctx => {
    try {
      ctx.send({ currentEnvironment: mwapi.app.env });
    } catch(err) {
      ctx.badRequest(null, [{ messages: [{ id: 'An error occured' }] }]);
    }
  },

  installPlugin: async ctx => {
    try {
      const { plugin, port } = ctx.request.body;
      const mwapiBin = path.join(process.cwd(), 'node_modules', 'mwapi', 'bin', 'mwapi');

      mwapi.reload.isWatching = false;

      mwapi.log.info(`Installing ${plugin}...`);

      exec(`node ${mwapiBin} install ${plugin} ${port === '4000' ? '--dev' : ''}`);

      ctx.send({ ok: true });

      mwapi.reload();
    } catch(err) {
      mwapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occured' }] }]);
    }
  },

  plugins: async ctx => {
    try {
      const plugins = Object.keys(mwapi.plugins).reduce((acc, key) => {
        acc[key] = mwapi.plugins[key].package.mwapi;

        return acc;
      }, {});

      ctx.send({ plugins });
    } catch(err) {
      ctx.badRequest(null, [{ messages: [{ id: 'An error occured' }] }]);
    }
  },

  uninstallPlugin: async ctx => {
    try {
      const { plugin } = ctx.params;
      const mwapiBin = path.join(process.cwd(), 'node_modules', 'mwapi', 'bin', 'mwapi');

      mwapi.reload.isWatching = false;

      mwapi.log.info(`Uninstalling ${plugin}...`);
      exec(`node ${mwapiBin} uninstall ${plugin}`);

      ctx.send({ ok: true });

      mwapi.reload();
    } catch(err) {
      mwapi.reload.isWatching = true;
      ctx.badRequest(null, [{ messages: [{ id: 'An error occured' }] }]);
    }
  }
};
