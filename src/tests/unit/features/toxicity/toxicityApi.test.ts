import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockBuildQuery, mockFetchJson } = vi.hoisted(() => ({
  mockBuildQuery: vi.fn((params: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }
      searchParams.set(key, String(value));
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }),
  mockFetchJson: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  buildQuery: mockBuildQuery,
  fetchJson: mockFetchJson,
}));

import {
  __resetToxicityApiSessionCacheForTests,
  getToxicityEndpoints,
  getToxicityLabels,
} from '@/features/toxicity/api';

describe('toxicity api session cache', () => {
  beforeEach(() => {
    __resetToxicityApiSessionCacheForTests();
    mockBuildQuery.mockClear();
    mockFetchJson.mockReset();
  });

  it('caches toxicity endpoints across repeated calls', async () => {
    mockFetchJson.mockResolvedValue(['nr_ar']);

    await expect(getToxicityEndpoints()).resolves.toEqual(['nr_ar']);
    await expect(getToxicityEndpoints()).resolves.toEqual(['nr_ar']);

    expect(mockFetchJson).toHaveBeenCalledTimes(1);
    expect(mockFetchJson).toHaveBeenCalledWith('/api/meta/toxicity/endpoints');
  });

  it('caches toxicity labels by endpoint key, including the unscoped label set', async () => {
    mockFetchJson.mockImplementation((url: string) => {
      switch (url) {
        case '/api/meta/toxicity/labels?endpoint=endpoint-a':
          return Promise.resolve(['High Risk']);
        case '/api/meta/toxicity/labels?endpoint=endpoint-b':
          return Promise.resolve(['Medium Risk']);
        case '/api/meta/toxicity/labels':
          return Promise.resolve(['High Risk', 'Medium Risk']);
        default:
          throw new Error(`Unexpected URL: ${url}`);
      }
    });

    await expect(getToxicityLabels('endpoint-a')).resolves.toEqual(['High Risk']);
    await expect(getToxicityLabels('endpoint-a')).resolves.toEqual(['High Risk']);
    await expect(getToxicityLabels('endpoint-b')).resolves.toEqual(['Medium Risk']);
    await expect(getToxicityLabels()).resolves.toEqual(['High Risk', 'Medium Risk']);
    await expect(getToxicityLabels()).resolves.toEqual(['High Risk', 'Medium Risk']);

    expect(mockFetchJson).toHaveBeenCalledTimes(3);
  });

  it('does not keep failed endpoint label requests cached and retries on the next call', async () => {
    mockFetchJson
      .mockRejectedValueOnce(new Error('labels unavailable'))
      .mockResolvedValueOnce(['High Risk']);

    await expect(getToxicityLabels('endpoint-a')).rejects.toThrow('labels unavailable');
    await expect(getToxicityLabels('endpoint-a')).resolves.toEqual(['High Risk']);

    expect(mockFetchJson).toHaveBeenCalledTimes(2);
  });
});
