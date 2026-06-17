import { afterEach, describe, expect, it } from 'vitest';
import { normalizeBasePath as normalizeSharedBasePath } from '../../../../shared/basePath.mjs';
import { getClientBasePath, normalizeBasePath, stripBasePath, withBasePath } from '../../../utils/basePath';

const env = import.meta.env as Record<string, string | undefined>;
const originalBaseUrl = env.BASE_URL;
const originalViteBasePath = env.VITE_BIOREMPP_URL_BASE_PATH;

afterEach(() => {
  if (originalBaseUrl === undefined) {
    delete env.BASE_URL;
  } else {
    env.BASE_URL = originalBaseUrl;
  }

  if (originalViteBasePath === undefined) {
    delete env.VITE_BIOREMPP_URL_BASE_PATH;
  } else {
    env.VITE_BIOREMPP_URL_BASE_PATH = originalViteBasePath;
  }
});

describe('basePath helpers', () => {
  it('normalizes base paths consistently in the shared helper and client wrapper', () => {
    const samples: Array<[string | null | undefined, string]> = [
      [undefined, '/'],
      [null, '/'],
      ['', '/'],
      ['   ', '/'],
      ['/', '/'],
      ['bioremppdbx', '/bioremppdbx/'],
      ['/bioremppdbx', '/bioremppdbx/'],
      ['bioremppdbx/', '/bioremppdbx/'],
      ['//bioremppdbx//', '/bioremppdbx/'],
      [' /nested/path/ ', '/nested/path/'],
    ];

    for (const [input, expected] of samples) {
      expect(normalizeSharedBasePath(input)).toBe(expected);
      expect(normalizeBasePath(input)).toBe(expected);
    }
  });

  it('strips and reapplies base paths without changing current client semantics', () => {
    expect(stripBasePath('/bioremppdbx/genes', '/bioremppdbx/')).toBe('/genes');
    expect(stripBasePath('/bioremppdbx/bioremppdbx/genes', '/bioremppdbx/')).toBe('/genes');
    expect(stripBasePath('/bioremppdbx', '/bioremppdbx/')).toBe('/');
    expect(withBasePath('/genes', '/bioremppdbx/')).toBe('/bioremppdbx/genes');
    expect(withBasePath('/bioremppdbx/genes', '/bioremppdbx/')).toBe('/bioremppdbx/genes');
    expect(withBasePath('/', '/bioremppdbx/')).toBe('/bioremppdbx/');
    expect(withBasePath('/genes', '/')).toBe('/genes');
  });

  it('prefers VITE_BIOREMPP_URL_BASE_PATH over BASE_URL when resolving the client base path', () => {
    env.BASE_URL = '/from-vite-base/';
    env.VITE_BIOREMPP_URL_BASE_PATH = '/from-custom-env/';
    expect(getClientBasePath()).toBe('/from-custom-env/');

    delete env.VITE_BIOREMPP_URL_BASE_PATH;
    expect(getClientBasePath()).toBe('/from-vite-base/');
  });
});
