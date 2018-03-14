const shell = require('shelljs');

// Store installation start date.
const silent = process.env.npm_config_debug !== 'true';
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

shell.cd('packages');

shell.echo('');
shell.echo('🕓  npm Install process started.');
shell.echo('');

shell.cd('mwapi-generate');
watcher('📦  npm Install mwapi-generate...', 'npm install');

shell.cd('../mwapi-generate-api');
watcher('📦  npm Install mwapi-generate-api...', 'npm install');

shell.cd('../mwapi-helper-plugin');
watcher('📦  npm Install mwapi-helper-plugin...', 'npm install');

shell.cd('../mwapi-admin');
watcher('📦  npm Install mwapi-admin', 'npm install', false);

shell.cd('../mwapi-bookshelf');
watcher('📦  npm Install mwapi-bookshelf...', 'npm install');

shell.cd('../mwapi-generate-admin');
watcher('📦  npm Install mwapi-generate-admin...', 'npm install');

shell.cd('../mwapi-generate-plugin');
watcher('📦  npm Install mwapi-generate-plugin...', 'npm install');

shell.cd('../mwapi-generate-policy');
watcher('📦  npm Install mwapi-generate-policy...', 'npm install');

shell.cd('../mwapi-generate-service');
watcher('📦  npm Install mwapi-generate-service...', 'npm install');

shell.cd('../mwapi-generate-new');
watcher('📦  npm Install mwapi-generate-new', 'npm install');

shell.cd('../mwapi-generate-controller');
watcher('📦  npm Install mwapi-generate-controller', 'npm install');

shell.cd('../mwapi-generate-model');
watcher('📦  npm Install mwapi-generate-model', 'npm install');

shell.cd('../mwapi-generate-new');
watcher('📦  npm Install mwapi-generate-new', 'npm install');

shell.cd('../mwapi-mongoose');
watcher('📦  npm Install mwapi-mongoose...', 'npm install');

shell.cd('../mwapi-cli');
watcher('📦  npm Install mwapi-cli...', 'npm install');

shell.cd('../mwapi-ejs');
watcher('📦  npm Install mwapi-ejs...', 'npm install');

shell.cd('../mwapi-knex');
watcher('📦  npm Install mwapi-knex...', 'npm install');

shell.cd('../mwapi-redis');
watcher('📦  npm Install mwapi-redis...', 'npm install');

shell.cd('../mwapi-utils');
watcher('📦  npm Install mwapi-utils...', 'npm install');

shell.cd('../mwapi-middleware-views');
watcher('📦  npm Install mwapi-middleware-views...', 'npm install');

shell.cd('../mwapi-plugin-email');
watcher('📦  npm Install mwapi-plugin-email...', 'npm install');

shell.cd('../mwapi-plugin-users-permissions');
watcher('📦  npm Install mwapi-plugin-users-permissions...', 'npm install');

shell.cd('../mwapi-plugin-content-manager');
watcher('📦  npm Install mwapi-plugin-content-manager...', 'npm install'); 

shell.cd('../mwapi-plugin-settings-manager');
watcher('📦  npm Install mwapi-plugin-settings-manager...', 'npm install');

shell.cd('../mwapi-upload-local');
watcher('📦  npm Install mwapi-upload-local...', 'npm install');

shell.cd('../mwapi-upload-aws-s3');
watcher('📦  npm Install mwapi-upload-aws-s3...', 'npm install');

shell.cd('../mwapi-plugin-upload');
watcher('📦  npm Install mwapi-plugin-upload...', 'npm install');

shell.cd('../mwapi-plugin-content-type-builder');
watcher('📦  npm Install mwapi-plugin-content-type-builder...', 'npm install');