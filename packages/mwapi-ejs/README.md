# mwapi-ejs

[![npm version](https://img.shields.io/npm/v/mwapi-ejs.svg)](https://www.npmjs.org/package/mwapi-ejs)
[![npm downloads](https://img.shields.io/npm/dm/mwapi-ejs.svg)](https://www.npmjs.org/package/mwapi-ejs)
[![npm dependencies](https://david-dm.org/mwapi/mwapi-ejs.svg)](https://david-dm.org/mwapi/mwapi-ejs)
[![Build status](https://travis-ci.org/mwapi/mwapi-ejs.svg?branch=master)](https://travis-ci.org/mwapi/mwapi)
[![Slack status](http://mwapi-slack.herokuapp.com/badge.svg)](http://slack.mwapi.io)

This built-in hook allows you to use the EJS template engine with custom options.

# How To use

To configure your hook with custom options, you need to edit your `./config/hooks.json` file in your mwapi app.
```javascript
{
  hooks: {
    ...
    websockets: true,
    ejs: {
      layout: layout, // Global layout file (default: layout)(set false to disable layout)
      viewExt: ejs, // View file extension (default: ejs)
      cache: true, // Cache compiled templates (default: true).
      debug: true // Debug flag (default: false)
    }
    ...
  }
}
```

## Resources

- [MIT License](LICENSE.md)

## Links

- [mwapi website](http://mwapi.io/)
- [mwapi community on Slack](http://slack.mwapi.io)
- [mwapi news on Twitter](https://twitter.com/mwapijs)
