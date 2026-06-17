import { describe, expect, it } from 'vitest';
import {
  createDevBasePathRedirectMiddleware,
  resolveDevBasePathRedirect,
} from '../../../../shared/viteDevBasePathRedirect.mjs';

describe('vite dev base-path redirect helper', () => {
  it('redirects the exact non-canonical base path to the slash-terminated path', () => {
    expect(resolveDevBasePathRedirect('/bioremppdbx', '/bioremppdbx/')).toBe('/bioremppdbx/');
  });

  it('preserves query strings when redirecting', () => {
    expect(resolveDevBasePathRedirect('/bioremppdbx?x=1', '/bioremppdbx/')).toBe('/bioremppdbx/?x=1');
  });

  it('does not redirect requests that are already canonical', () => {
    expect(resolveDevBasePathRedirect('/bioremppdbx/', '/bioremppdbx/')).toBeNull();
  });

  it('does not redirect when the base path is root', () => {
    expect(resolveDevBasePathRedirect('/anything', '/')).toBeNull();
  });

  it('returns a 302 redirect response from the middleware', () => {
    const middleware = createDevBasePathRedirectMiddleware('/bioremppdbx/');
    const headers: Record<string, string> = {};
    const response = {
      statusCode: 200,
      ended: false,
      setHeader(name: string, value: string) {
        headers[name] = value;
      },
      end() {
        this.ended = true;
      },
    };
    const next = vi.fn();

    middleware({ url: '/bioremppdbx?x=1' } as any, response as any, next);

    expect(response.statusCode).toBe(302);
    expect(headers.Location).toBe('/bioremppdbx/?x=1');
    expect(response.ended).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });
});
