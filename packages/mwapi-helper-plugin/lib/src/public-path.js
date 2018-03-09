const pluginPkg = require('../../../../package.json');
const pluginId = pluginPkg.name.replace(/^mwapi-plugin-/i, '');
const publicPath = `plugins/${pluginId}/`;

__webpack_public_path__ = (() => {
  if (window.location.port === '4000') {
    return `${window.location.origin}/`;
  } else if (mwapi.mode === 'backend') {
    return `${mwapi.backendURL}/${publicPath}`;
  }

  return `${(mwapi.remoteURL).replace(window.location.origin, '')}/${publicPath}`;
})();
