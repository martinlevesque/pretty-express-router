
const helpers = require("./lib")
const express = require("express");

function prettyExpressRouter(app, routeConfigs, currentContext = "/") {
  const router = express.Router();

  // middlewares at the context level:
  if (routeConfigs["middlewares"]) {
    for (const middleware of routeConfigs["middlewares"]) {
      app.use(middleware)
    }
  }

  for (const routeConfig of Object.keys(routeConfigs)) {
    const decodedRoute = helpers.decodeRoute(routeConfig);

    if (decodedRoute) {
      helpers.addDecodedRoute(router, decodedRoute, routeConfigs[routeConfig]);
    } else {
      prettyExpressRouter(router, routeConfigs[routeConfig], `/${routeConfig}/`);
    }
  }

  app.use(currentContext, router)
}

module.exports = prettyExpressRouter
