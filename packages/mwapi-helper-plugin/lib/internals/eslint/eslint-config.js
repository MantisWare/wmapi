const config = require('./.eslintrc.json');

// Update the eslint configuration for `mwapi-helper-plugin` module
if (process.env.IS_HELPER) {
  config.settings['import/resolver'].webpack.config = './lib/internals/webpack/webpack.test.babel.js'
}

module.exports = config;
