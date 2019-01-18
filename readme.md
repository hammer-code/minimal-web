# minimal-web-lib

A very minimal web library. This library is created for hammercode nodejs class learning materials.

## API

### Creating new instance

```js
const Router = require('minimal-web');

const router  = new Router();
```

### Defining Routes

```js
// Defining GET Route
router.get('/hello', (request, response) => {
  // request and response callback params are
  // node http-server request, response objects
  response.end('Helloo')
});

// Defining GET Route
router.get('/posts/:id/comments', (request, response) => {
  // Getting url param data { id: <string> }
  console.log(request.params)

  response.setHeader('content-type', 'application/json')
  response.end(JSON.strigify({
    message: 'Hey there'
  }))
});

// Defining POST Route
router.post('/posts/:id/comments:/:commentId', (request, response) => {
  // Getting body request
  console.log(request.data)
  // Getting url param data { id: <string>, commentId: <string> }
  console.log(request.params)

  response.setHeader('content-type', 'application/json')
  response.end(JSON.strigify({
    message: 'Hey there'
  }))
});

// Defining other routes
router.put('/a/path', callback);
router.patch('/a/path', callback);
router.delete('/a/path', callback);
```

## Lisence
MIT
