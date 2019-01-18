const { StringDecoder } = require('string_decoder');

/**
 * @param  {object} request
 * @param  {string} buffer
 * @return {object|string}
 */
function parseBuffer (request, buffer) {
  if (request.method.toLowerCase() === 'get') {
    return buffer
  }

  if (request.headers['content-type'] === 'application/json') {
    return JSON.parse(buffer);
  }

  return buffer
}

/**
 * @param  {object}   request
 * @param  {function} callback
 * @return {void}
 */
function parseBody (request, callback = () => {}) {
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  request.on('data', (data) => {
    buffer += decoder.write(data);
  });

  request.on('end', () => {
    buffer += decoder.end();

    // Send the response
    callback(null, parseBuffer(request, buffer));
  });
}

module.exports = {
  parseBody,
};
