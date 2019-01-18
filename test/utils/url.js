const test = require('ava');
const urlutils = require('../../lib/utils/url');

test('`match` should able to match pattern', (t) => {
  let result = null;

  // True assertions
  result = urlutils.match('/', '/');
  t.true(result.isMatch);

  result = urlutils.match('/posts', '/posts');
  t.true(result.isMatch);

  result = urlutils.match('/posts/1', '/posts/:id');
  t.true(result.isMatch);
  t.is(result.params.id, '1');

  result = urlutils.match('/posts/1/comments', '/posts/:id/comments');
  t.true(result.isMatch);
  t.is(result.params.id, '1');

  result = urlutils.match('/posts/1/comments/2', '/posts/:id/comments/:commentId');
  t.true(result.isMatch);
  t.is(result.params.id, '1');
  t.is(result.params.commentId, '2');

  // false assertions
  result = urlutils.match('/', '/hello');
  t.false(result.isMatch);

  result = urlutils.match('/posts/1', '/posts');
  t.false(result.isMatch);

  result = urlutils.match('/posts/1/comment', '/posts/:id');
  t.false(result.isMatch);
});

test('`trim` should remove trailing slash', (t) => {
  t.is(urlutils.trim('/foo/'), '/foo');
  t.is(urlutils.trim('/foo'), '/foo');
});
