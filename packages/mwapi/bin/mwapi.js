#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

// Local mwapi dependencies.
const packageJSON = require('../package.json');

// mwapi utilities.
const program = require('mwapi-utils').commander;

/**
 * Normalize version argument
 *
 * `$ mwapi -v`
 * `$ mwapi -V`
 * `$ mwapi --version`
 * `$ mwapi version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return (arg === '-V') ? '-v' : arg;
});

// `$ mwapi version` (--version synonym)
program
  .command('version')
  .description('output your version of mwapi')
  .action(program.versionInformation);


// `$ mwapi console`
program
  .command('console')
  .description('open the mwapi framework console')
  .action(require('./mwapi-console'));

// `$ mwapi new`
program
  .command('new')
  .option('-d, --dev', 'Development mode')
  .option('--dbclient <dbclient>', 'Database client')
  .option('--dbhost <dbhost>', 'Database host')
  .option('--dbport <dbport>', 'Database port')
  .option('--dbname <dbname>', 'Database name')
  .option('--dbusername <dbusername>', 'Database username')
  .option('--dbpassword <dbpassword>', 'Database password')
  .description('create a new application')
  .action(require('./mwapi-new'));

// `$ mwapi start`
program
  .command('start')
  .description('start your mwapi application')
  .action(require('./mwapi-start'));

// `$ mwapi generate:api`
program
  .command('generate:api <id> [attributes...]')
  .option('-t, --tpl <template>', 'template name')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <plugin>', 'plugin name to generate a sub API')
  .description('generate a basic API')
  .action((id, attributes, cliArguments) => {
    cliArguments.attributes = attributes;
    require('./mwapi-generate')(id, cliArguments);
  });

// `$ mwapi generate:controller`
program
  .command('generate:controller <id>')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a controller for an API')
  .action(require('./mwapi-generate'));

// `$ mwapi generate:model`
program
  .command('generate:model <id> [attributes...]')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a model for an API')
  .action((id, attributes, cliArguments) => {
    cliArguments.attributes = attributes;
    require('./mwapi-generate')(id, cliArguments);
  });

// `$ mwapi generate:policy`
program
  .command('generate:policy <id>')
  .option('-a, --api <api>', 'API name')
  .option('-p, --plugin <api>', 'plugin name')
  .description('generate a policy for an API')
  .action(require('./mwapi-generate'));

// `$ mwapi generate:service`
program
  .command('generate:service <id>')
  .option('-a, --api <api>', 'API name')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a service for an API')
  .action(require('./mwapi-generate'));

// `$ mwapi generate:plugin`
program
  .command('generate:plugin <id>')
  .option('-n, --name <name>', 'Plugin name')
  .description('generate a basic plugin')
    .action(require('./mwapi-generate'));

// `$ mwapi install`
program
  .command('install <plugin>')
  .option('-d, --dev', 'Development mode')
  .description('install a mwapi plugin')
  .action(require('./mwapi-install'));

// `$ mwapi uninstall`
program
  .command('uninstall <plugin>')
  .description('uninstall a mwapi plugin')
  .action(require('./mwapi-uninstall'));

/**
 * Normalize help argument
 */

// `$ mwapi help` (--help synonym)
program
  .command('help')
  .description('output the help')
  .action(program.usageMinusWildcard);

// `$ mwapi <unrecognized_cmd>`
// Mask the '*' in `help`.
program
  .command('*')
  .action(program.usageMinusWildcard);

// Don't balk at unknown options.

/**
 * `$ mwapi`
 */

program.parse(process.argv);
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.usageMinusWildcard();
}
