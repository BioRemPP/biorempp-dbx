/**
 * @packageDocumentation
 *
 * Generic async resource hook with stale-request protection and optional eager loading.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Options accepted by the async resource hook.
 */
interface UseAsyncResourceOptions<T> {
  /** Disables automatic loading and leaves the hook idle when false. */
  enabled?: boolean;
  /** Seed value used before the first successful load completes. */
  initialData?: T | null;
  /** Starts loading immediately on mount when enabled. */
  immediate?: boolean;
}

/**
 * Loads an async resource and tracks loading, error, and reload state.
 *
 * @param loader Async function used to fetch the resource.
 * @param options Controls eager loading, enablement, and seeded data.
 * @returns Resource state plus reload and manual state setters.
 * @remarks
 * Requests are versioned so older responses cannot overwrite newer loads. Cleanup increments the
 * internal request id, which prevents state updates from stale in-flight promises after unmount or
 * dependency changes.
 */
export function useAsyncResource<T>(
  loader: () => Promise<T>,
  options: UseAsyncResourceOptions<T> = {}
) {
  const { enabled = true, initialData = null, immediate = true } = options;
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(Boolean(enabled && immediate));
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const reload = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const nextData = await loader();
      if (requestIdRef.current !== currentRequestId) {
        return null;
      }
      setData(nextData);
      return nextData;
    } catch (nextError) {
      if (requestIdRef.current === currentRequestId) {
        setError(nextError instanceof Error ? nextError.message : 'Unknown error');
      }
      return null;
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  }, [loader]);

  useEffect(() => {
    if (!enabled || !immediate) {
      setLoading(false);
      return;
    }

    void reload();

    return () => {
      requestIdRef.current += 1;
    };
  }, [enabled, immediate, reload]);

  return {
    data,
    error,
    loading,
    reload,
    setData,
  };
}
