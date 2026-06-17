/**
 * @packageDocumentation
 *
 * Client-side API wrappers for metadata-driven filter options.
 *
 * These endpoints provide the shared selector values reused across explorer filters and guided
 * analysis controls without exposing entity detail payloads directly.
 */
import { fetchJson } from '@/shared/api/client';
import type { PathwayOption } from '@/features/meta/types';

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

const compoundClassesLoader = createSessionCachedLoader(() => fetchJson<string[]>('/api/meta/compound-classes'));
const referenceAGsLoader = createSessionCachedLoader(() => fetchJson<string[]>('/api/meta/reference-ags'));
const genesLoader = createSessionCachedLoader(() => fetchJson<string[]>('/api/meta/genes'));
const pathwaysLoader = createSessionCachedLoader(() => fetchJson<string[]>('/api/meta/pathways'));
const pathwayOptionsLoader = createSessionCachedLoader(() => fetchJson<PathwayOption[]>('/api/meta/pathways/grouped'));

/**
 * Fetches the unique compound class values used by metadata-driven filters.
 *
 * @returns A list of unique compound class labels.
 * @throws Error When the backend request fails.
 */
export async function getUniqueCompoundClasses(): Promise<string[]> {
  return compoundClassesLoader.load();
}

/**
 * Fetches the unique reference agency values used by metadata-driven filters.
 *
 * @returns A list of unique reference agency labels.
 * @throws Error When the backend request fails.
 */
export async function getUniqueReferenceAGs(): Promise<string[]> {
  return referenceAGsLoader.load();
}

/**
 * Fetches the unique gene identifiers exposed by the metadata endpoints.
 *
 * @returns A list of unique gene values.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The backend currently returns flat string values, not the richer gene summary structures used by
 * the explorer API.
 */
export async function getUniqueGenes(): Promise<string[]> {
  return genesLoader.load();
}

/**
 * Fetches the unique pathway values exposed by the metadata endpoints.
 *
 * @returns A flat list of pathway values.
 * @throws Error When the backend request fails.
 */
export async function getUniquePathways(): Promise<string[]> {
  return pathwaysLoader.load();
}

/**
 * Fetches grouped pathway options for selectors that display pathway source metadata.
 *
 * @returns A list of grouped pathway options.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * This response preserves the grouped source metadata required by selectors that cannot rely on a
 * flat pathway list alone.
 */
export async function getPathwayOptions(): Promise<PathwayOption[]> {
  return pathwayOptionsLoader.load();
}

/**
 * Resets module-level metadata API session caches.
 *
 * @remarks
 * This helper exists only to keep unit tests isolated when validating cache behavior.
 */
export function __resetMetaApiSessionCacheForTests() {
  compoundClassesLoader.reset();
  referenceAGsLoader.reset();
  genesLoader.reset();
  pathwaysLoader.reset();
  pathwayOptionsLoader.reset();
}
