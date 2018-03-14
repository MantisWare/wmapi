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
shell.echo('🕓  Linking process started.');
shell.echo('');

shell.cd('mwapi-generate');
watcher('📦  Linking mwapi-generate...', 'npm link');

shell.cd('../mwapi-generate-api');
watcher('📦  Linking mwapi-generate-api...', 'npm link');

shell.cd('../mwapi-helper-plugin');
watcher('📦  Linking mwapi-helper-plugin...', 'npm link');

shell.cd('../mwapi-admin');
watcher('📦  Linking mwapi-admin', 'npm link --no-optional', false);

shell.cd('../mwapi-generate-admin');
watcher('📦  Linking mwapi-generate-admin...', 'npm link');

shell.cd('../mwapi-generate-new');
watcher('📦  Linking mwapi-generate-new', 'npm link');

shell.cd('../mwapi-mongoose');
watcher('📦  Linking mwapi-mongoose...', 'npm link');

shell.cd('../mwapi-cli');
watcher('📦  Linking mwapi-cli...', 'npm link');

shell.cd('../mwapi-plugin-email');
watcher('📦  Linking mwapi-plugin-email...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-users-permissions');
watcher('📦  Linking mwapi-plugin-users-permissions...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-content-manager');
watcher('📦  Linking mwapi-plugin-content-manager...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-settings-manager');
watcher('📦  Linking mwapi-plugin-settings-manager...', 'npm link --no-optional', false);

shell.cd('../mwapi-upload-local');
watcher('📦  Linking mwapi-upload-local...', 'npm link --no-optional', false);

shell.cd('../mwapi-upload-aws-s3');
watcher('📦  Linking mwapi-upload-aws-s3...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-upload');
watcher('📦  Linking mwapi-plugin-upload...', 'npm link --no-optional', false);

shell.cd('../mwapi-plugin-content-type-builder');
watcher('📦  Linking mwapi-plugin-content-type-builder...', 'npm link --no-optional', false);