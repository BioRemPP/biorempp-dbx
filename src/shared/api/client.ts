/**
 * @packageDocumentation
 *
 * Shared HTTP client helpers used by feature-level API wrappers.
 *
 * This module centralizes client-side URL resolution, query-string serialization, and JSON fetch
 * behavior so every feature wrapper applies the same base-path and error-handling rules.
 */
import { getClientBasePath, withBasePath } from '@/utils/basePath';

/**
 * Normalized deployment base path used by all client-side API requests.
 *
 * @defaultValue The normalized value of `VITE_BIOREMPP_URL_BASE_PATH` or `/`.
 */
export const CLIENT_BASE_PATH = getClientBasePath();

/**
 * Absolute application-relative prefix for internal API routes.
 *
 * @remarks
 * Feature-level wrappers should prefer this constant indirectly through {@link apiUrl} unless they
 * need to assemble a custom `fetch` request manually.
 */
export const API_BASE_PATH = withBasePath('/api', CLIENT_BASE_PATH);

/**
 * Resolves an application or API-relative path under the configured client base path.
 *
 * @param path Relative path or API route to resolve.
 * @returns A pathname that is safe to pass to `fetch`.
 *
 * @remarks
 * Routes under `/api` are always rewritten to the internal API base path so frontend calls work
 * both at root deployments and under institutional subpaths.
 */
export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === '/api') {
    return API_BASE_PATH;
  }
  if (normalizedPath.startsWith('/api/')) {
    return `${API_BASE_PATH}${normalizedPath.slice('/api'.length)}`;
  }
  return withBasePath(normalizedPath, CLIENT_BASE_PATH);
}

/**
 * Serializes query parameters while omitting empty values.
 *
 * @param params Query parameter values keyed by parameter name.
 * @returns A leading-`?` query string or an empty string when no values are present.
 *
 * @remarks
 * `undefined`, `null`, and empty-string values are omitted from the serialized output.
 * All remaining values are stringified with `String(...)` before they are added to the URL.
 */
export function buildQuery(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    searchParams.set(key, String(value));
  }
  const encoded = searchParams.toString();
  return encoded ? `?${encoded}` : '';
}

/**
 * Fetches JSON from an internal application route and throws on non-success responses.
 *
 * @typeParam T Expected JSON payload shape.
 * @param url Application-relative or API-relative URL.
 * @returns The parsed JSON response body.
 * @throws Error When the HTTP response is not successful.
 *
 * @remarks
 * Error messages prefer the raw response body when one is available, which helps feature-level UIs
 * surface backend validation or failure text without duplicating fetch logic in every module.
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(apiUrl(url));
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
