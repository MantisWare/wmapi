/**
 * app.js
 *
 * This is the entry file for the application,
 * only setup and plugin code.
 */
import './public-path.js'; // eslint-disabled-line

import React from 'react';
import { Provider } from 'react-redux';

import App from 'containers/App'; // eslint-disable-line

import configureStore from './store';
import { translationMessages } from './i18n';

const tryRequireRoot = (source) => {
  try {
    return require('../../../../admin/src/' + source + '.js').default;
  } catch(err) {
    return null;
  }
};

const bootstrap = tryRequireRoot('bootstrap');
const pluginRequirements = tryRequireRoot('requirements');

const layout = (() => {
  try {
    return require('../../../../config/layout.js');
  } catch(err) {
    return null;
  }
})();

const injectedComponents = (() => {
  try {
    return require('injectedComponents').default;
  } catch(err) {
    return [];
  }
});

// Plugin identifier based on the package.json `name` value
const pluginPkg = require('../../../../package.json');
const pluginId = pluginPkg.name.replace(
  /^mwapi-plugin-/i,
  ''
);
const pluginName = pluginPkg.mwapi.name;
const pluginDescription = pluginPkg.mwapi.description || pluginPkg.description;
const apiUrl = `${mwapi.backendURL}/${pluginId}`;
const router = mwapi.router;

// Create redux store with mwapi admin history
const store = configureStore({}, mwapi.router, pluginName);

// Define the plugin root component
function Comp(props) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    if (mwapi) {
      System.import('./i18n').then(result => {
        const translationMessagesUpdated = result.translationMessages;
        mwapi
          .refresh(pluginId)
          .translationMessages(translationMessagesUpdated);
      });
    }
  });
}

// Register the plugin.
mwapi.registerPlugin({
  blockerComponent: null,
  blockerComponentProps: {},
  bootstrap,
  description: pluginDescription,
  icon: pluginPkg.mwapi.icon,
  id: pluginId,
  injectedComponents,
  layout,
  leftMenuLinks: [],
  mainComponent: Comp,
  name: pluginPkg.mwapi.name,
  pluginRequirements,
  preventComponentRendering: false,
  translationMessages,
});

// Export store
export { store, apiUrl, pluginId, pluginName, pluginDescription, router };
