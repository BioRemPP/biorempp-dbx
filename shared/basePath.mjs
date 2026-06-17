/**
 * Runtime-neutral base-path helpers shared by client, server, and Vite config code.
 */

/**
 * Prefixes a path-like value with a leading slash when one is missing.
 *
 * @param {string} value
 * @returns {string}
 */
export function ensureLeadingSlash(value) {
  return value.startsWith('/') ? value : `/${value}`;
}

/**
 * Normalizes a configured base path into a canonical slash-wrapped form.
 *
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function normalizeBasePath(value) {
  const raw = String(value || '/').trim();
  if (!raw || raw === '/') {
    return '/';
  }

  const withLeadingSlash = ensureLeadingSlash(raw);
  return `/${withLeadingSlash.replace(/^\/+|\/+$/g, '')}/`;
}
