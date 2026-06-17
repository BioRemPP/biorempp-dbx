import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  fetchJson: mockFetchJson,
}));

import {
  __resetMetaApiSessionCacheForTests,
  getPathwayOptions,
  getUniqueCompoundClasses,
  getUniqueGenes,
  getUniquePathways,
  getUniqueReferenceAGs,
} from '@/features/meta/api';

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

describe('meta api session cache', () => {
  beforeEach(() => {
    __resetMetaApiSessionCacheForTests();
    mockFetchJson.mockReset();
  });

  it('caches each metadata catalog after the first successful fetch', async () => {
    mockFetchJson.mockImplementation((url: string) => {
      switch (url) {
        case '/api/meta/compound-classes':
          return Promise.resolve(['Nitrogen-containing']);
        case '/api/meta/reference-ags':
          return Promise.resolve(['ATSDR']);
        case '/api/meta/genes':
          return Promise.resolve(['nahA']);
        case '/api/meta/pathways':
          return Promise.resolve(['Benzoate degradation']);
        case '/api/meta/pathways/grouped':
          return Promise.resolve([{ pathway: 'Benzoate degradation', source: 'KEGG' }]);
        default:
          throw new Error(`Unexpected URL: ${url}`);
      }
    });

    await expect(getUniqueCompoundClasses()).resolves.toEqual(['Nitrogen-containing']);
    await expect(getUniqueCompoundClasses()).resolves.toEqual(['Nitrogen-containing']);
    await expect(getUniqueReferenceAGs()).resolves.toEqual(['ATSDR']);
    await expect(getUniqueReferenceAGs()).resolves.toEqual(['ATSDR']);
    await expect(getUniqueGenes()).resolves.toEqual(['nahA']);
    await expect(getUniqueGenes()).resolves.toEqual(['nahA']);
    await expect(getUniquePathways()).resolves.toEqual(['Benzoate degradation']);
    await expect(getUniquePathways()).resolves.toEqual(['Benzoate degradation']);
    await expect(getPathwayOptions()).resolves.toEqual([{ pathway: 'Benzoate degradation', source: 'KEGG' }]);
    await expect(getPathwayOptions()).resolves.toEqual([{ pathway: 'Benzoate degradation', source: 'KEGG' }]);

    expect(mockFetchJson).toHaveBeenCalledTimes(5);
  });

  it('deduplicates concurrent requests while one metadata call is in flight', async () => {
    const deferred = createDeferred<string[]>();
    mockFetchJson.mockReturnValue(deferred.promise);

    const firstCall = getUniqueCompoundClasses();
    const secondCall = getUniqueCompoundClasses();

    expect(mockFetchJson).toHaveBeenCalledTimes(1);

    deferred.resolve(['Nitrogen-containing']);

    await expect(firstCall).resolves.toEqual(['Nitrogen-containing']);
    await expect(secondCall).resolves.toEqual(['Nitrogen-containing']);
  });

  it('does not cache failed metadata requests and retries on the next call', async () => {
    mockFetchJson
      .mockRejectedValueOnce(new Error('metadata unavailable'))
      .mockResolvedValueOnce(['Nitrogen-containing']);

    await expect(getUniqueCompoundClasses()).rejects.toThrow('metadata unavailable');
    await expect(getUniqueCompoundClasses()).resolves.toEqual(['Nitrogen-containing']);

    expect(mockFetchJson).toHaveBeenCalledTimes(2);
  });
});
