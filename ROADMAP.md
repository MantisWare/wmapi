# mwapi Roadmap

***This is a living document, it describes what features we should implement in priority.***

This document could be influenced by the community feedback, security issues, stability, future needs, etc.

# Origins and purposes

mwapi is a project supported by a company called mwapi Solutions. The purpose of mwapi is to provide a powerful way to manage your content across devices through an API. mwapi does not intend to be a MVC framework. mwapi will stay a free and open-source backend project with an user interface to easily manage content.

mwapi aims to be a Content Management Framework. It lets developers hack and quickly develop custom business logic while keeping an administration interface to see what's is going on in the application. mwapi has been designed to build scalable moderns apps using a service-oriented architecture. mwapi will fit with any web project that requires an API.

For more details, [please read our blog](http://blog.mwapi.io).

# ETA (v3)

### α alpha
**Expected release date: 20/12/2016**

**Note:** This version will not be ready for production use. However, we will publish it on npm to allow the community to test it and give us feedback.

`mwapi@alpha.1`
* ~~Rewrite the entire project with ES6.~~
* ~~Move to Koa2. [(see current status)](https://github.com/mwapi/mwapi/issues/41).~~
* ~~Use Mongo as main database.~~
* ~~Use Joi as validation layer.~~
* ~~Load plugins.~~
* ~~Load external hooks.~~
* ~~Build dashboard layout using React.~~
* ~~Dynamic configuration values.~~
* ~~Handle internationalization (i18n).~~

[`mwapi@alpha.2`](https://github.com/mwapi/mwapi/pull/176)
* ~~Ignore `node_modules` and `admin` folders when auto-reload is enabled.~~
* ~~Apply defaults configurations values on `mwapi.config.hooks.xxx`.~~
* ~~Handle errors with Boom.~~
* ~~Allow CLI to generate an API into another API.~~
* ~~Use ESLint instead of xo.~~
* ~~Update databases configurations to allow different connectors.~~

`mwapi@alpha.3`
_Reorganize the mono-repository. The rule to follow is to only have hooks without which mwapi cannot start or the CLI is unusable._
- ~~Move `mwapi-settings-manager` to the main repository~~
- ~~Better handling for 404~~
- ~~Update the generated API's files with async/await pattern~~

`mwapi@alpha.4`:
- ~~Improve `mwapi-bookshelf` and `mwapi-mongoose` adapters.~~
- ~~Improve the way we are injecting plugins into the dashboard.~~
- ~~Create plugin helper to share utils between plugins (`mwapi-helper-plugin`).~~
- ~~Prototype the plugins queries process to be able to use different ORMs.~~
- ~~Prototype the CLI to create, install and uninstall plugins.~~
- ~~Ensure that we are compatible with Node 8.~~

`mwapi@alpha.5`:
- ~~[Plugin] Settings Manager~~.
- ~~Update layout design~~.
- ~~Create a draft of the guidelines to follow of how to create a plugin~~.
- ~~Initialize the `docs` folder~~.
- ~~Synchronize the ORM adapters to set the same properties in the AST~~.
- ~~Rewrite the mwapi core to improve performances and startup time~~.
- ~~Freeze (make immutable) the AST~~.
- ~~Remove global variable `mwapi` and use the module pattern instead~~.
- ~~Use Bootstrap v4@alpha.6~~.
- ~~Use i18n in the notifications messages~~.
- ~~Remove old/deprecated folders (test, website)~~.
- ~~Use Pino as logger~~.

`mwapi@alpha.6` *(expected release date: 21/09/2017)*:
- ~~[Admin] Reduce number of steps to be able to contribute~~.
- ~~[Admin] Reduce bundle size by sharing commons dependencies~~.
- ~~[Admin] Update `mwapi-helper-plugin` and `mwapi-admin` dependencies to the latest version~~.
- ~~[Plugin] Content Manager~~.
- ~~[Plugin] Content Type Builder~~.
- ~~[Plugin] Finalize the query process to be able to use different ORMs~~.
- ~~[Plugin] Execute `bootstrap` function before mounting~~.
- ~~[Plugin] Execute `requirement` function to allow or not rendering~~.
- ~~[Framework] Support filters parameters~~.
- ~~Write new documentation~~.

`mwapi@alpha.7` *(expected release date: 24/11/2017)*:
- ~~[Admin] Define push area into the plugins~~.
- ~~[Admin] Harmonise sharing components between plugins~~.
- ~~[Admin] `List plugins` page~~.
- ~~[Admin] Use latest available version of Bootstrap~~.
- ~~[Plugin] Email~~.
- ~~[Plugin] Users & groups (with full authentication process)~~.
- ~~Improve generated APIs (especially the relation part)~~.

`mwapi@alpha.8` *(expected release date: 22/12/2017)*:
- ~~[Admin] Install plugins directly from the interface~~.
- ~~Ask database settings during the project creation~~.
- ~~Ping database before generating the project~~.
- ~~Allow associations between app's models and plugins' models~~.

`mwapi@alpha.9` *(expected release date: 12/01/2018)*:
- ~~[Plugin] Analytics (homepage only)~~.
- ~~[Plugin - Users & Permissions] Integrate providers authentication, email templates and advanced settings~~.

`mwapi@alpha.10` *(expected release date: 15/02/2018)*:
- ~~[Framework] New core API to manage settings in database~~.
- ~~[Admin] Refactor the Input component to make it more extensible~~.

`mwapi@alpha.11` *(expected release date: 09/03/2018)*:
- ~~[Plugin] Upload~~.

Please read our blog to be aware of the roadmap updates:

- [Roadmap Update #1 - File Upload, Rich Text Editor, GraphQL](https://blog.mwapi.io/roadmap-update-1-upload-rich-text-editor-graphql/)