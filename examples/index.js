/**
 * Main file. Program kickoff here
 */

const Router = require('../lib/index');

const router = new Router();

router.get('/', (request, response) => {
  response.end('It\'s working!');
});

router.get('/articles', (request, response) => {
  const filter = request.query.filter || 'all';

  response.end(`Getting all articles with filter ${filter}!`);
});

router.get('/articles/:id', (request, response) => {
  const name = request.query.name || 'John';
  response.end(`Getting article with ID: ${request.params.id}!`);
});

router.post('/articles', (request, response) => {
  response.writeHead(201);
  response.end('Creating new article');
});

router.delete('/articles/:id', (request, response) => {
  response.setHeader('content-type', 'application/json');
  response.writeHead(200);
  response.end(JSON.stringify({
    message: `Removing article with ID ${request.params.id}`
  }));
});

// Start the server, and have it listen to port 3000
router.listen(3000, () => {
  console.log(`The server listening on port 3000`);
});
