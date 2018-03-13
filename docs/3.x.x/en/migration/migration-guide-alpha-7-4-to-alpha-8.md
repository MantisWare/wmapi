# Migrating from 3.0.0-alpha.7.3 to 3.0.0-alpha.8

**Here are the major changes:**

- Fix deployment process
- Setup database connection on project creation
- Helper for table creation for SQL database

> Feel free to [join us on Slack](http://slack.#) and ask questions about the migration process.

## Getting started

Install mwapi globally on your computer. To do so run `npm install mwapi-cli -g`.

When it's done, generate a new empty project `mwapi new myNewProject` (don't pay attention to the database configuration).

## Configurations

You will have to update just 1 file: `package.json`

- Edit the scripts section: (only the `setup` line has changed)

```json
{
  "scripts": {
    "setup": "cd admin && npm run setup",
    "start": "node server.js",
    "mwapi": "node_modules/mwapi/bin/mwapi.js",
    "lint": "node_modules/.bin/eslint api/**/*.js config/**/*.js plugins/**/*.js",
    "postinstall": "node node_modules/mwapi/lib/utils/post-install.js"
  }
}
```

- Edit the mwapi's dependencies version: (move mwapi's dependencies to `3.0.0-alpha.8` version)

```json
{
  "dependencies": {
    "lodash": "4.x.x",
    "mwapi": "3.0.0-alpha.8",
    "mwapi-mongoose": "3.0.0-alpha.8"
  }
}
```

## Update the Admin

Delete your old admin folder and replace by the new one.

## Update the Plugins

Copy these 3 files `/plugins/users-permissions/config/jwt.json`, `/plugins/users-permissions/config/roles.json` and `/plugins/users-permissions/models/User.settings.json` **from your old project** and paste them in the corresponding ones in your new project. It is important to save these files.

Then, delete your old `plugins` folder and replace it by the new one.

That's all, you have now upgraded to mwapi `alpha.8`.
