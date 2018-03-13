<h3 align="center">API creation made easy, secure and fast.</h3>
<p align="center">An advanced open-source Content Management Framework to build powerful API with almost no effort.</p>

<br>

# Quick start

Web and mobile applications needed a powerful, simple to use and production-ready API-driven solution.

#### Install
This is the production-ready version of mwapi (v1). You should also consider that the migration to v3 will not be easy due to many breaking changes.
```bash
npm install mwapi -g
```

Read the [Getting started](https://mwapi.io/getting-started) page to create your first project using mwapi.

## Create your first project

Use the built-in CLI to generate your first project. Run this command and wait until the project is created.

```bash
mwapi new myProject
```

Then, enter in your project.

```bash
cd myProject
```

### Launch the server

Now, you have to use another command of the CLI to run the server. And you will be done!

> ️⚠️ Make sure that MongoDB is running on your machine before starting the server.

```bash
mwapi start
```

Open your browser and go to the administration panel (http://localhost:1450/admin) to create the first user.

# Features

- **Modern Admin Panel:**
  Elegant, entirely customizable and fully extensible admin panel.
- **Secure by default:** Reusable policies, CSRF, CORS, P3P, Xframe, XSS, and more.
- **Plugins Oriented:** Install auth system, content management, custom plugins, and more, in seconds.
- **Blazing Fast:** Built on top of Node.js, mwapi delivers amazing performances.
- **Front-end Agnostic:** Use any front-end frameworks (React, Vue, Angular, etc.), mobile apps or even IoT.
- **Powerful CLI:** Scaffold projects and APIs on the fly.
- **SQL & NoSQL databases:** Work with Mongo as a main database, also supports Postgres, MySQL, etc.

## Philosophy

Web and mobile applications needed a powerful, simple to use and production-ready API-driven solution. That's why we created mwapi, an open-source Content Management Framework (CMF) for exposing your content (data, media) accross multi-devices.

Halfway between a CMS and a framework, mwapi takes advantages of both worlds. A powerful dashboard to easily manage your content with a flexible framework layer to develop and integrate specific features.

## License

[MIT License](LICENSE.md) Copyright (c) 2015-2018.