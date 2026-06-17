/**
 * @packageDocumentation
 *
 * Client-side API wrappers for toxicity explorer rows and toxicity-specific metadata options.
 *
 * This module combines the paginated toxicity table endpoint with the selector metadata used to
 * populate endpoint and label filters in the toxicity explorer.
 */
import { buildQuery, fetchJson } from '@/shared/api/client';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';
import type { ToxicityEndpoint, ToxicityFilters } from '@/features/toxicity/types';

function createSessionCachedLoader<T>(loader: () => Promise<T>) {
  let cachedData: T | undefined;
  let inFlight: Promise<T> | null = null;

  return {
    async load() {
      if (cachedData !== undefined) {
        return cachedData;
      }

      if (inFlight) {
        return inFlight;
      }

      inFlight = loader()
        .then((result) => {
          cachedData = result;
          return result;
        })
        .finally(() => {
          inFlight = null;
        });

      return inFlight;
    },
    reset() {
      cachedData = undefined;
      inFlight = null;
    },
  };
}

const toxicityEndpointsLoader = createSessionCachedLoader(() => fetchJson<string[]>('/api/meta/toxicity/endpoints'));
const toxicityLabelsCache = new Map<string, string[]>();
const toxicityLabelsInFlight = new Map<string, Promise<string[]>>();

function getToxicityLabelsCacheKey(endpoint?: string) {
  return endpoint ?? '__all__';
}

/**
 * Fetches a paginated list of toxicity endpoint rows.
 *
 * @param filters Toxicity filters forwarded to the backend.
 * @param pagination Requested page and page size.
 * @returns A paginated toxicity response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default request loads the first page with `50` rows, matching the standard explorer page
 * size used by the toxicity table.
 */
export async function getToxicityData(
  filters: ToxicityFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 50 }
): Promise<PaginatedResponse<ToxicityEndpoint>> {
  return fetchJson(
    `/api/toxicity${buildQuery({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches the list of toxicity endpoints exposed by the metadata API.
 *
 * @returns A list of endpoint names.
 * @throws Error When the backend request fails.
 */
export async function getToxicityEndpoints(): Promise<string[]> {
  return toxicityEndpointsLoader.load();
}

/**
 * Fetches toxicity labels, optionally scoped to a specific endpoint.
 *
 * @param endpoint Optional endpoint name used to narrow the returned labels.
 * @returns A list of toxicity labels.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * When `endpoint` is omitted, the backend returns the broader label set exposed by the metadata
 * route instead of the labels for one endpoint only.
 */
export async function getToxicityLabels(endpoint?: string): Promise<string[]> {
  const cacheKey = getToxicityLabelsCacheKey(endpoint);
  const cached = toxicityLabelsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = toxicityLabelsInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const request = fetchJson<string[]>(`/api/meta/toxicity/labels${buildQuery({ endpoint })}`)
    .then((result) => {
      toxicityLabelsCache.set(cacheKey, result);
      return result;
    })
    .finally(() => {
      toxicityLabelsInFlight.delete(cacheKey);
    });

  toxicityLabelsInFlight.set(cacheKey, request);
  return request;
}

/**
 * Resets module-level toxicity API session caches.
 *
 * @remarks
 * This helper exists only to keep unit tests isolated when validating cache behavior.
 */
export function __resetToxicityApiSessionCacheForTests() {
  toxicityEndpointsLoader.reset();
  toxicityLabelsCache.clear();
  toxicityLabelsInFlight.clear();
}
