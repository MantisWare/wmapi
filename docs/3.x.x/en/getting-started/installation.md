# Installation

Installation is very easy and only takes a few seconds.

## Requirements

Please make sure your computer/server meets the following requirements:
 - [Node.js](https://nodejs.org) >= 9: Node.js is a server platform which runs JavaScript. Installation guide [here](https://nodejs.org/en/download/).
 - [MongoDB](https://www.mongodb.com/): MongoDB is a powerful document store. Installation guide [here](https://www.mongodb.com/download-center?j#community).

## Setup

Time to install mwapi!

```bash
npm install mwapi -g
```

Note: if you encounter npm permissions issues, [change the permissions to npm default directory](https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-1-change-the-permission-to-npms-default-directory).

It takes about 20 seconds with a good Internet connection. You can take a coffee ☕️  if you have a slow one.

Having troubles during the installation? Check if someone already had the same issue https://github.com/mwapi/mwapi/issues. If not, you can [post one](https://github.com/mwapi/mwapi/issues/new), or ask for help https://mwapi.io/support.

## Check installation

Once completed, please check that the installation went well, by running:

```bash
mwapi -v
```

That should print `3.0.0-alpha.x`.

mwapi is installed globally on your computer. Type `mwapi` in your terminal you will have access to every available command lines.

***

Congrats! Now that mwapi is installed you can [create your first API](quick-start.md).
