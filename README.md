# pretty-express-router
[![NPM](https://nodei.co/npm/pretty-express-router.png)](https://nodei.co/npm/pretty-express-router/)

[![Build status](https://travis-ci.org/martinlevesque/pretty-express-router.svg?branch=master)](https://travis-ci.org/martinlevesque/pretty-express-router)

This package allows to generate express routers with a convenient routing file defining all routes.

## Installation

```
npm install pretty-express-router
```

## Usage Example

```
// app.js:
const expressRouter = require("pretty-express-router");
const express = require("express");
const routes = require("./routes");

// <your> express application:
const app = express();

expressRouter(app, routes);
```

where *routes.js* is defined as follows:

```
// routes.js:

function inlineRoute(req, res) {
  res.json({});
}

module.exports = {
  '* /': require('./testRoutes').allMethods,   // all HTTP methods resquested to /
  'get *': require('./testRoutes').allGet,     // get requests to all paths
  'get /inline': inlineRoute,                  
  'get /login': require('./testRoutes').login,
  categories: {                                 // defines a context "/categories/"
    'get *': require('./categories/index').all, // all get requests to /categories/
    'get /what': require('./categories/index').what,
    "insubcat": {                               // /categories/insubcat
      "get /whatsub": require('./categories/insubcat/index').whatsub
    }
  }
};
```

*testRoutes* in this example is:

```
// testRoutes.js:
function allGet(req, res, next) {
  console.log(`all get...`)
  next();
}

function allMethods(req, res, next) {
  console.log(`all methods...`)
  next();
}

function login(req, res, next) {
  res.json({auth: "valid"})
}

module.exports = {
  login,
  allMethods,
  allGet
}

```

## API

```
expressRouter(appOrRouter, routes)
```

*appOrRouter* can be either an express application or an express router.
*routes* are the routes definitions, an hash object (see the example).


## License

ISC
