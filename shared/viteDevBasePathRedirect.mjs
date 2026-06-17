import { normalizeBasePath } from './basePath.mjs';

function parseRequestUrl(requestUrl) {
  try {
    return new URL(requestUrl || '/', 'http://vite-dev.local');
  } catch {
    return null;
  }
}

/**
 * Resolves the canonical dev-server redirect target for requests that omit the trailing slash from
 * a configured non-root Vite base path.
 *
 * @param {string | undefined} requestUrl
 * @param {string | null | undefined} basePath
 * @returns {string | null}
 */
export function resolveDevBasePathRedirect(requestUrl, basePath) {
  const normalizedBasePath = normalizeBasePath(basePath);
  if (normalizedBasePath === '/') {
    return null;
  }

  const parsedUrl = parseRequestUrl(requestUrl);
  if (!parsedUrl) {
    return null;
  }

  const withoutTrailingSlash = normalizedBasePath.slice(0, -1);
  if (parsedUrl.pathname !== withoutTrailingSlash) {
    return null;
  }

  return `${normalizedBasePath}${parsedUrl.search}`;
}

/**
 * Creates a Vite dev-server middleware that redirects requests from the non-canonical base path
 * without a trailing slash to the canonical slash-terminated base path.
 *
 * @param {string | null | undefined} basePath
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => void}
 */
export function createDevBasePathRedirectMiddleware(basePath) {
  return (req, res, next) => {
    const redirectLocation = resolveDevBasePathRedirect(req.url, basePath);
    if (!redirectLocation) {
      next();
      return;
    }

    res.statusCode = 302;
    res.setHeader('Location', redirectLocation);
    res.end();
  };
}
