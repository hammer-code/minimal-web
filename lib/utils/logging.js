const querystring = require('querystring');

/**
 * @param  {object}  arg
 * @param  {string}  arg.method
 * @param  {string}  arg.path
 * @param  {object?} arg.qs
 * @return {void}
 */
function log ({ method, path, qs, status }) {
  let logStr = `${status} - ${method.toUpperCase().padEnd(6)} ${path}`;
  qs = querystring.stringify(qs);

  if (qs) logStr += `?${qs}`;

  console.log(logStr);
}

module.exports = {
  log,
};
