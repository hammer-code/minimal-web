/**
 * @param  {string} path
 * @return {string}
 */
function trim (path) {
  return '/' + path.replace(/^\/+|\/+$/g, '');
}

function hasParams (pathPattern) {
  const regex = /:(\w+)/g;

  return Boolean(pathPattern.match(regex));
}

function getParamsMeta(pathPattern) {
  const regex = /:(\w+)/g;

  const match = pathPattern.match(regex);

  if (!match) return null;

  return match.map(paramPattern => ({
    paramName: paramPattern.slice(1),
    paramPattern
  }));
}

function createRegex(pathPattern, metas) {
  let regexstr = pathPattern;

  for (let meta of metas) {
    regexstr = regexstr.replace(meta.paramPattern, '(\\w+)');
  }

  return new RegExp(regexstr);
}

function resultToParams (result, metas) {
  return result
    .map((el, i) => ({
      param: metas[i].paramName,
      value: el
    }))
    .reduce(
      (acc, item) => Object.assign(acc, { [item.param]: item.value }),
      {}
    )
}

function getFragments (path) {
  return path.split('/')
}

/**
 * @typedef MatchResult
 * @property {boolean} isMatch
 * @property {string}  path
 * @property {object?} params
 */

/**
 * Match a path with a pattern.
 *
 * @param  {string} path
 * @param  {string} pathPattern
 * @return {MatchResult}
 */
function match(path, pathPattern) {
  if (!hasParams(pathPattern)) {
    return {
      path,
      isMatch: pathPattern === path,
      params: {}
    }
  }

  const isFragmentCountMatch = getFragments(path).length === getFragments(pathPattern).length

  const metas = getParamsMeta(pathPattern) || [];
  const regex = createRegex(pathPattern, metas);
  const result = (regex.exec(path) ||  []).slice(1);

  const isParamsCountMatch = result.length === metas.length;

  const isMatch = isFragmentCountMatch && isParamsCountMatch

  if (!isMatch) return { isMatch: false };

  return {
    path,
    isMatch,
    params: resultToParams(result, metas)
  };
}

module.exports = {
  trim,
  match,
}
