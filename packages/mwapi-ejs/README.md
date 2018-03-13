# mwapi-ejs

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
