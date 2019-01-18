const url = require('url');
const http = require('http');

const requtils = require('./utils/request');
const logutils = require('./utils/logging');
const urlutils = require('./utils/url');

function Router () {
  this.routes = {
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {},
  };

  this.defaultHandler = (request, response) => {
    response.writeHead(404);
    response.end('Not found');
  };

  this.server = http.createServer((request, response) => {
    this.request = request;
    this.response = response;

    this.handle();
  });
}

Router.prototype.addHandler = function ({ method, path, handler }) {
  this.routes[method][path] = handler;
};

Router.prototype.get = function (path, handler) {
  this.addHandler({
    method: 'get',
    path,
    handler,
  });
};

Router.prototype.post = function (path, handler) {
  this.addHandler({
    method: 'post',
    path,
    handler,
  });
};

Router.prototype.delete = function (path, handler) {
  this.addHandler({
    method: 'delete',
    path,
    handler,
  });
};

Router.prototype.getHandler = function ({ method, path }) {
  const patterns = Object.keys(this.routes[method])
  let result = null
  let matchPattern = null

  for (let pattern of patterns) {
    const res = urlutils.match(path, pattern)

    if (res.isMatch) {
      result = res
      matchPattern = pattern
      break
    }
  }

  const defaultResult = {
    handler: this.defaultHandler,
    params: {},
  }

  const handler = this.routes[method][matchPattern]

  return handler ?
    { handler, params: result.params }
    : defaultResult
};

Router.prototype.handle = function () {
  const parsedUrl = url.parse(this.request.url, true);
  const path = urlutils.trim(parsedUrl.pathname);
  const method = this.request.method.toLowerCase();

  const { params, handler } = this.getHandler({ method, path });

  requtils.parseBody(this.request, (error, data) => {
    if (error) throw error;
    if (data) this.request.data = data;
    this.request.query = parsedUrl.query
    this.request.params = params

    handler(this.request, this.response);

    logutils.log({
      method,
      path,
      qs: parsedUrl.query,
      status: this.response.statusCode
    });
  });
};

Router.prototype.listen = function (port, callback = () => {}) {
  this.server.listen(port, callback);
};

module.exports = Router;
