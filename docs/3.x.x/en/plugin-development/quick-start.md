# Quick start

To facilitate the development of a plugin, we drastically reduce the amount of commands necessary to install the entire development environment. Before getting started, you need to have Node.js (v8)  and npm (v5) installed.

## Development Environment Setup

To setup the development environment please **follow the instructions below:**

1. [Fork the repository](https://github.com/mwapi/mwapi) to your own GitHub account.
2. Clone it to your computer `git clone git@github.com:mwapi/mwapi.git`.
3. Run `npm run setup` at the root of the directory.

> Note: If the installation failed, please remove the global packages related to mwapi. The command `npm ls mwapi` will help you to find where your packages are installed globally.

## Plugin development Setup

Create a development project

1. Go to a folder on your computer `cd /path/to/my/folder`.
2. Create a new project `mwapi new myDevelopmentProject --dev`.

To generate a new plugin **run the following commands:**
1. In your project folder `cd myDevelopmentProject && mwapi generate:plugin my-plugin`.
2. Link the `mwapi-helper-plugin` dependency in your project folder `cd pathToMyProject/myDevelopmentProject/plugins/my-plugin && npm link mwapi-helper-plugin`.
3. Start the server in the admin folder `cd pathToMyProject/myDevelopmentProject/admin && npm start` and go to the following url [http://localhost:4000/admin](http://localhost:4000/admin).
4. In a new terminal window open at the root of your project launch your mwapi server `mwapi start`.


Your are now ready to develop your own plugin and live-test your updates! 
