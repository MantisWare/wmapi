const shell = require('shelljs');

// Store installation start date.
const silent = process.env.npm_config_debug !== 'true';
const installationStartDate = new Date();
const watcher = (label, cmd, withSuccess = true) => {
  if (label.length > 0) {
    shell.echo(label);
  }

  const data = shell.exec(cmd, {
    silent
  });

  if (data.stderr && data.code !== 0) {
    console.error(data.stderr);
    process.exit(1);
  }

  if (label.length > 0 && withSuccess) {
    shell.echo('✅  Success');
    shell.echo('');
  }
};

shell.echo('');
shell.echo('🕓  The setup process can take few minutes.');
shell.echo('');

// Remove existing binary.
shell.rm('-f', '/usr/local/bin/mwapi.js');

shell.cd('packages/mwapi-utils');
watcher('📦  Linking mwapi-utils...', 'npm link');

shell.cd('../mwapi-generate');
watcher('', 'npm install ../mwapi-utils');
watcher('📦  Linking mwapi-generate...', 'npm link');

shell.cd('../mwapi-generate-api');
watcher('📦  Linking mwapi-generate-api...', 'npm link');

shell.cd('../mwapi-helper-plugin');
watcher('📦  Linking mwapi-helper-plugin...', 'npm link');

shell.cd('../mwapi-admin');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
watcher('', 'npm install ../mwapi-utils --no-optional');
shell.rm('-f', 'package-lock.json');

// Without these line Travis failed.
if (shell.test('-e', 'admin/src/config/plugins.json') === false) {
  shell.config.silent = silent;
  shell.cd('admin/src/config/');
  shell.ShellString('[]').to('plugins.json');
  shell.cd('../../../');
}

watcher('📦  Linking mwapi-admin', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

shell.cd('../mwapi-generate-admin');
watcher('', 'npm install ../mwapi-admin');
watcher('📦  Linking mwapi-generate-admin...', 'npm link');

shell.cd('../mwapi-generate-new');
watcher('', 'npm install ../mwapi-utils');
watcher('📦  Linking mwapi-generate-new', 'npm link');

shell.cd('../mwapi-mongoose');
watcher('', 'npm install ../mwapi-utils');
watcher('📦  Linking mwapi-mongoose...', 'npm link');

shell.cd('../mwapi');
watcher('', 'npm install ../mwapi-generate ../mwapi-generate-admin ../mwapi-generate-api ../mwapi-generate-new ../mwapi-generate-plugin ../mwapi-generate-policy ../mwapi-generate-service ../mwapi-utils');
watcher('📦  Linking mwapi...', 'npm link');

shell.cd('../mwapi-plugin-email');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-email...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

shell.cd('../mwapi-plugin-users-permissions');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-users-permissions...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

shell.cd('../mwapi-plugin-content-manager');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-content-manager...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

shell.cd('../mwapi-plugin-settings-manager');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-settings-manager...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');


shell.cd('../mwapi-upload-local');
watcher('📦  Linking mwapi-upload-local...', 'npm link --no-optional', false);
shell.cd('../mwapi-upload-aws-s3');
watcher('📦  Linking mwapi-upload-aws-s3...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-upload');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
watcher('', 'npm install ../mwapi-upload-local --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-upload...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

shell.cd('../mwapi-plugin-content-type-builder');
watcher('', 'npm install ../mwapi-helper-plugin --no-optional');
watcher('', 'npm install ../mwapi-generate --no-optional');
watcher('', 'npm install ../mwapi-generate-api --no-optional');
shell.rm('-f', 'package-lock.json');
watcher('📦  Linking mwapi-plugin-content-type-builder...', 'npm link --no-optional', false);
watcher('🏗  Building...', 'npm run build');

// Log installation duration.
const installationEndDate = new Date();
const duration = (installationEndDate.getTime() - installationStartDate.getTime()) / 1000;
shell.echo('✅  mwapi has been succesfully installed.');
shell.echo(`⏳  The installation took ${Math.floor(duration / 60) > 0 ? `${Math.floor(duration / 60)} minutes and ` : ''}${Math.floor(duration % 60)} seconds.`);
