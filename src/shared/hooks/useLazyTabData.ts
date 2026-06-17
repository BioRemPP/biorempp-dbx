/**
 * @packageDocumentation
 *
 * Lazy tab-loading hook that fetches data only when a tab becomes active or is explicitly reloaded.
 */
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Options accepted by the lazy tab data hook.
 */
interface UseLazyTabDataOptions<T> {
  /** Indicates whether the associated tab is currently active. */
  isActive: boolean;
  /** Async function used to fetch the tab payload. */
  fetcher: () => Promise<T>;
  /** Dependency-like values that reset the cached tab state when they change. */
  resetKeys?: unknown[];
}

/**
 * Public state returned by the lazy tab data hook.
 */
export interface LazyTabDataState<T> {
  /** Loaded tab payload, or `null` before a successful fetch. */
  data: T | null;
  /** Indicates whether a fetch is currently in progress. */
  loading: boolean;
  /** Error message from the most recent failed fetch, if any. */
  error: string | null;
  /** Indicates whether the current tab payload has been loaded successfully at least once. */
  hasLoaded: boolean;
  /** Triggers a fresh load even after the tab has already been resolved once. */
  reload: () => void;
}

/**
 * Lazily fetches tab content the first time a tab becomes active and caches the result.
 *
 * @param options Active-state, fetcher, and reset controls for the tab payload.
 * @returns Cached tab state with loading, error, and reload helpers.
 * @remarks
 * The hook resets cached state whenever the serialized `resetKeys` signature changes. It also
 * guards against late async completions by ignoring updates after cancellation.
 */
export function useLazyTabData<T>({
  isActive,
  fetcher,
  resetKeys = [],
}: UseLazyTabDataOptions<T>): LazyTabDataState<T> {
  const fetcherRef = useRef(fetcher);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [loadedVersion, setLoadedVersion] = useState<number | null>(null);

  const resetSignature = useMemo(() => JSON.stringify(resetKeys), [resetKeys]);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setHasLoaded(false);
    setLoadedVersion(null);
  }, [resetSignature]);

  useEffect(() => {
    if (!isActive || (hasLoaded && loadedVersion === reloadVersion)) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetcherRef.current();
        if (cancelled) {
          return;
        }
        setData(response);
        setHasLoaded(true);
        setLoadedVersion(reloadVersion);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setData(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load tab content.');
        setHasLoaded(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [hasLoaded, isActive, loadedVersion, reloadVersion, resetSignature]);

  function reload() {
    setHasLoaded(false);
    setLoadedVersion(null);
    setReloadVersion((current) => current + 1);
  }

  return {
    data,
    loading,
    error,
    hasLoaded,
    reload,
  };
}
