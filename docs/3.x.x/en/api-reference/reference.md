# API Reference

  - mwapi
    - [.admin](#mwapiadmin)
    - [.app](#mwapiapp)
    - [.bootstrap()](#mwapibootstrap)
    - [.config](#mwapiconfig)
    - [.controllers](#mwapicontrollers)
    - [.hook](#mwapihook)
    - [.koaMiddlewares](#mwapikoaMiddlewares)
    - [.load()](#mwapiload)
    - [.log](#mwapilog)
    - [.middleware](#mwapimiddleware)
    - [.models](#mwapimodels)
    - [.plugins](#mwapiplugins)
    - [.query()](#mwapiquery)
    - [.reload()](#mwapireload)
    - [.router](#mwapirouter)
    - [.server](#mwapiserver)
    - [.services](#mwapiservices)
    - [.start()](#mwapistart)
    - [.stop()](#mwapistop)
    - [.utils](#mwapiutils)


## mwapi.admin

This object contains the controllers, models, services and configurations contained in the `./admin` folder.

## mwapi.app

Returns the Koa instance.

## mwapi.bootstrap

Returns a `Promise`. When resolved, it means that the `./config/functions/bootstrap.js` has been executed. Otherwise, it throws an error.

> Note: You can also access to the bootstrap function through `mwapi.config.functions.boostrap`.

## mwapi.config

Returns an object that represents the configurations of the project. Every JavaScript or JSON file located in the `./config` folder will be parsed into the `mwapi.config` object.

## mwapi.controllers

Returns an object of the controllers wich is available in the project. Every JavaScript file located in the `./api/**/controllers` folder will be parsed into the `mwapi.controllers` object. Thanks to this object, you can access to every controller's actions everywhere in the project.

> Note: This object doesn't include the admin's controllers and plugin's controllers.

## mwapi.hook

Returns an object of the hooks available in the project. Every folder that follows this pattern `mwapi-*` and located in the `./node_modules` or `/hooks` folder will be mounted into the `mwapi.hook` object.

## mwapi.koaMiddlewares

Returns an object of the Koa middlewares found in the `./node_modules` folder of the project. This reference is very useful for the mwapi's core.

## mwapi.load

Returns a function that parses the configurations, hooks, middlewares and APIs of your app. It also loads the middlewares and hooks with the previously loaded configurations. This method could be useful to update references available through the `mwapi` global variable without having to restart the server. However, without restarting the server, the new configurations will not be taken in account.

## mwapi.log

Returns the Logger (Pino) instance.

## mwapi.middleware

Returns an object of the middlewares available in the project. Every folder in the `./middlewares` folder will be also mounted into the `mwapi.middleware` object.

## mwapi.models

Returns an object of models available in the project. Every JavaScript or JSON file located in the `./api/**/models` folders will be parsed into the `mwapi.models` object. Also every `mwapi.models.**` object is merged with the model's instance returned by the ORM (Mongoose, Bookshelf). It allows to call the ORM methods through the `mwapi.models.**` object (ex: `mwapi.models.users.find()`).

## mwapi.plugins

Returns an object of plugins available in the project. Each plugin object contains the associated controllers, models, services and configurations contained in the `./plugins/**/` folder.

## mwapi.query

Returns a function that will returns the available queries for this model. This feature is only available inside the plugin's files (controllers, services, custom functions). For more details, see the [ORM queries section](../plugin-development/backend-development.md#ORM queries).

## mwapi.reload

Returns a function that reloads the entire app (with downtime).

## mwapi.router

Returns the Router (Joi router) instance.

## mwapi.server

Returns the [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) instance.

## mwapi.services

Returns an object of services available in the project. Every JavaScript file located in the `./api/**/services` folders will be parsed into the `mwapi.services` object.

## mwapi.start

Returns a function that loads the configurations, middlewares and hooks. Then, it executes the bootstrap file, freezes the global variable and listens the configured port.

## mwapi.stop

Returns a function that shuts down the server and destroys the current connections.

## mwapi.utils

Returns a set of utils.
