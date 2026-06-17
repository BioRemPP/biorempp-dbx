/**
 * @packageDocumentation
 *
 * Base-path helpers for deployments served from a URL subpath.
 *
 * These utilities keep route parsing, navigation, and asset resolution consistent when the
 * application runs either at the domain root or inside an institutional path prefix.
 */
import { ensureLeadingSlash, normalizeBasePath as normalizeSharedBasePath } from '../../shared/basePath.mjs';

/**
 * Normalizes a configured base path into a canonical form with a leading and trailing slash.
 *
 * @param value Raw base path value from configuration or runtime environment.
 * @returns The normalized base path, or `/` when no subpath is configured.
 *
 * @remarks
 * Non-root base paths are always returned in slash-wrapped form such as `/dbx/` so downstream
 * helpers can compose and compare prefixes without handling multiple representations.
 */
export function normalizeBasePath(value?: string | null) {
  return normalizeSharedBasePath(value);
}

/**
 * Removes a normalized deployment base path from a pathname.
 *
 * @param pathname Browser pathname or application-relative path to normalize.
 * @param basePath Configured application base path.
 * @returns The pathname without the deployment base path prefix.
 *
 * @remarks
 * Repeated prefixes are stripped defensively to tolerate paths that were prefixed more than once.
 */
export function stripBasePath(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const rawPath = pathname || '/';
  const normalizedPath = ensureLeadingSlash(rawPath.replace(/\/+$/, '') || '/');

  if (normalizedBasePath === '/') {
    return normalizedPath;
  }

  const withoutTrailing = normalizedBasePath.replace(/\/$/, '');
  if (normalizedPath === withoutTrailing || normalizedPath === normalizedBasePath) {
    return '/';
  }

  let strippedPath = normalizedPath;
  while (strippedPath.startsWith(normalizedBasePath)) {
    const next = strippedPath.slice(normalizedBasePath.length - 1) || '/';
    if (next === strippedPath) {
      break;
    }
    strippedPath = ensureLeadingSlash(next);
    if (strippedPath === withoutTrailing || strippedPath === normalizedBasePath) {
      return '/';
    }
  }

  return strippedPath;
}

/**
 * Prefixes a pathname with the configured deployment base path exactly once.
 *
 * @param pathname Application-relative pathname to prefix.
 * @param basePath Configured application base path.
 * @returns The pathname resolved under the configured deployment base path.
 *
 * @remarks
 * The helper first strips any existing base-path prefix before reapplying it, which avoids
 * duplicating path segments when routes or assets are normalized more than once.
 */
export function withBasePath(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPath = ensureLeadingSlash((pathname || '/').trim() || '/');

  if (normalizedBasePath === '/') {
    return normalizedPath;
  }

  const withoutBasePrefix = stripBasePath(normalizedPath, normalizedBasePath);
  const withoutTrailing = normalizedBasePath.replace(/\/$/, '');
  if (withoutBasePrefix === '/') {
    return normalizedBasePath;
  }

  return `${withoutTrailing}${withoutBasePrefix}`;
}

/**
 * Resolves the client-side base path from Vite environment configuration.
 *
 * @returns The normalized base path derived from `VITE_BIOREMPP_URL_BASE_PATH` or `BASE_URL`.
 *
 * @remarks
 * `VITE_BIOREMPP_URL_BASE_PATH` takes precedence over Vite's `BASE_URL` when both are present.
 */
export function getClientBasePath() {
  const fromVite = (import.meta.env.VITE_BIOREMPP_URL_BASE_PATH as string | undefined) || import.meta.env.BASE_URL;
  return normalizeBasePath(fromVite || '/');
}
