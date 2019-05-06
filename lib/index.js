

function methodToRouterFunctionName(method) {
  const downcasedMethod = method.toLowerCase();

  if ( ! ["*", "get", "post", "delete", "put", "patch"].includes(downcasedMethod)) {
    throw new Error(`Invalid routing method: ${downcasedMethod}`);
  }

  if (downcasedMethod === "*") {
    return "all";
  }

  return downcasedMethod;
}

// routeConfigEntry, example: "get /testEndpoint"
function decodeRoute(routeConfigEntry) {
  if (typeof routeConfigEntry !== "string") {
    return null;
  }

  const parts = routeConfigEntry.split(" ");

  if ( ! parts || parts.length !== 2) {
    return null;
  }

  const [ method, path ] = parts;
  const normalizedMethod = methodToRouterFunctionName(method);

  return {
    method: normalizedMethod,
    path
  }
}

function addDecodedRoute(router, decodedRoute, routeFunction) {
  if ( ! routeFunction) {
    throw new Error(`Can't find the route function.`)
  }

  router[decodedRoute.method](decodedRoute.path, routeFunction);
}

module.exports = {
  addDecodedRoute,
  decodeRoute,
  methodToRouterFunctionName
}
