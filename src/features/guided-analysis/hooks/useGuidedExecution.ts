/**
 * @packageDocumentation
 *
 * Hook for executing guided analysis queries with scope-aware pagination and stale-request
 * protection.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { executeGuidedQuery, GuidedApiError } from '@/features/guided-analysis/api';
import type {
  GuidedExecutionResponse,
  GuidedFilterState,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';
import {
  getGuidedQueryPageSize,
  serializeFiltersForExecute,
} from '@/features/guided-analysis/utils';

const EXECUTION_DEBOUNCE_MS = 350;
const EXECUTION_CACHE_TTL_MS = 1_500;

const inFlightExecutionRequests = new Map<string, Promise<GuidedExecutionResponse>>();
const recentExecutionCache = new Map<string, { response: GuidedExecutionResponse; expiresAt: number }>();
let guidedExecutionBlockedUntilMs = 0;

/**
 * Resets module-scoped guided execution state used for request coalescing and cooldown handling.
 *
 * @remarks
 * This helper exists for deterministic unit tests. Runtime code should not call it.
 */
export function __resetGuidedExecutionTestState() {
  inFlightExecutionRequests.clear();
  recentExecutionCache.clear();
  guidedExecutionBlockedUntilMs = 0;
}

function pruneExecutionCache(now = Date.now()) {
  for (const [key, value] of recentExecutionCache.entries()) {
    if (value.expiresAt <= now) {
      recentExecutionCache.delete(key);
    }
  }
}

function getCachedExecution(requestKey: string) {
  pruneExecutionCache();
  const cached = recentExecutionCache.get(requestKey);
  if (!cached || cached.expiresAt <= Date.now()) {
    if (cached) {
      recentExecutionCache.delete(requestKey);
    }
    return null;
  }
  return cached.response;
}

function setCachedExecution(requestKey: string, response: GuidedExecutionResponse) {
  recentExecutionCache.set(requestKey, {
    response,
    expiresAt: Date.now() + EXECUTION_CACHE_TTL_MS,
  });
}

function resolveRetryAfterSeconds(error: unknown) {
  if (error instanceof GuidedApiError && error.status === 429) {
    return error.retryAfterSeconds ?? 60;
  }
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    (error as { status?: unknown }).status === 429
  ) {
    const retryAfterSeconds = (error as { retryAfterSeconds?: unknown }).retryAfterSeconds;
    return typeof retryAfterSeconds === 'number' && Number.isFinite(retryAfterSeconds)
      ? retryAfterSeconds
      : 60;
  }
  return null;
}

function formatExecutionError(error: unknown) {
  const retryAfterSeconds = resolveRetryAfterSeconds(error);
  if (retryAfterSeconds !== null) {
    return `Guided Analysis rate limit reached. Try again in ${retryAfterSeconds}s.`;
  }
  return error instanceof Error ? error.message : 'Unable to execute guided query.';
}

/**
 * Pagination state tracked per query-and-filter scope.
 */
interface PageState {
  /** Compound scope key derived from the selected query and serialized filters. */
  scopeKey: string;
  /** One-based page number requested for the current scope. */
  page: number;
}

/**
 * Result contract returned by the guided execution hook.
 */
interface UseGuidedExecutionResult {
  /** Latest execution payload returned by the backend. */
  execution: GuidedExecutionResponse | null;
  /** Whether an execution request is currently in flight. */
  executionLoading: boolean;
  /** User-facing error string for the latest failed execution. */
  executionError: string | null;
  /** One-based page currently requested for the active scope. */
  page: number;
  /** Updates the requested page for the active query-and-filter scope. */
  setPage: (page: number) => void;
}

/**
 * Executes the selected guided query whenever its effective scope changes.
 *
 * @param query Guided query definition currently selected by the user.
 * @param filters Effective filter state to serialize into the execution payload.
 * @param enabled Whether execution is allowed for the current page state.
 * @returns Execution payload, loading state, error state, and page controls.
 *
 * @remarks
 * The hook keys each request by query, serialized filters, and page number so repeated renders do
 * not trigger duplicate executions. Pagination resets automatically when the scope changes.
 */
export function useGuidedExecution(
  query: GuidedQueryDefinition | null,
  filters: GuidedFilterState,
  enabled = true
): UseGuidedExecutionResult {
  const [execution, setExecution] = useState<GuidedExecutionResponse | null>(null);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>({ scopeKey: '', page: 1 });
  const [blockedUntilMs, setBlockedUntilMs] = useState(guidedExecutionBlockedUntilMs);

  const serializedFilters = useMemo(() => serializeFiltersForExecute(filters), [filters]);
  const serializedFiltersKey = useMemo(() => JSON.stringify(serializedFilters), [serializedFilters]);
  const queryId = query?.id || '';
  const scopeKey = useMemo(
    () => `${queryId}::${serializedFiltersKey}`,
    [queryId, serializedFiltersKey]
  );
  const page = pageState.scopeKey === scopeKey ? pageState.page : 1;
  const previousQueryIdRef = useRef('');
  const requestedRequestKeyRef = useRef('');
  const completedRequestKeyRef = useRef('');
  const executionRef = useRef<GuidedExecutionResponse | null>(null);
  const requestKey = `${scopeKey}::${page}`;

  useEffect(() => {
    executionRef.current = execution;
  }, [execution]);

  useEffect(() => {
    if (!queryId) {
      previousQueryIdRef.current = '';
      requestedRequestKeyRef.current = '';
      completedRequestKeyRef.current = '';
      setExecution(null);
      setExecutionLoading(false);
      setExecutionError(null);
      setBlockedUntilMs(0);
      return;
    }

    if (previousQueryIdRef.current && previousQueryIdRef.current !== queryId) {
      requestedRequestKeyRef.current = '';
      completedRequestKeyRef.current = '';
      setExecution(null);
      setExecutionLoading(false);
      setExecutionError(null);
    }

    previousQueryIdRef.current = queryId;
  }, [queryId]);

  useEffect(() => {
    if (pageState.scopeKey !== scopeKey) {
      setPageState({ scopeKey, page: 1 });
    }
  }, [pageState.scopeKey, scopeKey]);

  useEffect(() => {
    if (!blockedUntilMs) {
      return;
    }

    const remainingMs = blockedUntilMs - Date.now();
    if (remainingMs <= 0) {
      if (guidedExecutionBlockedUntilMs <= Date.now()) {
        guidedExecutionBlockedUntilMs = 0;
      }
      setBlockedUntilMs(0);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (guidedExecutionBlockedUntilMs <= Date.now()) {
        guidedExecutionBlockedUntilMs = 0;
      }
      setBlockedUntilMs(0);
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [blockedUntilMs]);

  useEffect(() => {
    if (!query) {
      setExecutionLoading(false);
      setExecutionError(null);
      setExecution(null);
      return;
    }

    if (!enabled) {
      return;
    }

    const activeBlockedUntilMs = Math.max(blockedUntilMs, guidedExecutionBlockedUntilMs);
    if (activeBlockedUntilMs > Date.now()) {
      setExecutionLoading(false);
      setExecutionError(formatExecutionError(new GuidedApiError('Too many guided analysis requests.', 429, Math.max(1, Math.ceil((activeBlockedUntilMs - Date.now()) / 1000)))));
      return;
    }

    if (
      completedRequestKeyRef.current === requestKey ||
      requestedRequestKeyRef.current === requestKey
    ) {
      return;
    }

    const cachedExecution = getCachedExecution(requestKey);
    if (cachedExecution) {
      setExecution(cachedExecution);
      setExecutionError(null);
      setExecutionLoading(false);
      completedRequestKeyRef.current = requestKey;
      return;
    }

    const activeQuery = query;
    let cancelled = false;
    const debounceTimeoutId = window.setTimeout(runExecution, EXECUTION_DEBOUNCE_MS);

    async function runExecution() {
      if (cancelled) {
        return;
      }

      const currentBlockedUntilMs = Math.max(blockedUntilMs, guidedExecutionBlockedUntilMs);
      if (currentBlockedUntilMs > Date.now()) {
        setExecutionLoading(false);
        setExecutionError(formatExecutionError(new GuidedApiError('Too many guided analysis requests.', 429, Math.max(1, Math.ceil((currentBlockedUntilMs - Date.now()) / 1000)))));
        return;
      }

      requestedRequestKeyRef.current = requestKey;
      setExecutionLoading(true);
      setExecutionError(null);

      const existingPromise = inFlightExecutionRequests.get(requestKey);
      const requestPromise = existingPromise ?? executeGuidedQuery(activeQuery.id, {
        page,
        pageSize: getGuidedQueryPageSize(activeQuery),
        filters: serializedFilters,
      });

      if (!existingPromise) {
        inFlightExecutionRequests.set(requestKey, requestPromise);
      }

      try {
        const response = await requestPromise;

        if (cancelled) {
          return;
        }

        setExecution(response);
        executionRef.current = response;
        completedRequestKeyRef.current = requestKey;
        setCachedExecution(requestKey, response);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const retryAfterSeconds = resolveRetryAfterSeconds(error);
        if (retryAfterSeconds !== null) {
          const nextBlockedUntilMs = Date.now() + retryAfterSeconds * 1000;
          guidedExecutionBlockedUntilMs = nextBlockedUntilMs;
          setBlockedUntilMs(nextBlockedUntilMs);
        }

        if (requestedRequestKeyRef.current === requestKey) {
          requestedRequestKeyRef.current = '';
        }
        setExecutionError(formatExecutionError(error));
        if (!executionRef.current) {
          setExecution(null);
        }
      } finally {
        if (inFlightExecutionRequests.get(requestKey) === requestPromise) {
          inFlightExecutionRequests.delete(requestKey);
        }
        if (!cancelled && requestedRequestKeyRef.current === requestKey) {
          requestedRequestKeyRef.current = '';
        }
        if (!cancelled) {
          setExecutionLoading(false);
        }
      }
    }

    return () => {
      cancelled = true;
      window.clearTimeout(debounceTimeoutId);
      if (requestedRequestKeyRef.current === requestKey) {
        requestedRequestKeyRef.current = '';
      }
    };
  }, [blockedUntilMs, enabled, page, query, requestKey, serializedFilters, scopeKey]);

  useEffect(() => {
    if (!execution?.table) {
      return;
    }

    if (page > execution.table.totalPages) {
      setPageState({ scopeKey, page: execution.table.totalPages });
    }
  }, [execution, page, scopeKey]);

  function setPage(nextPage: number) {
    setPageState({ scopeKey, page: nextPage });
  }

  return {
    execution,
    executionLoading,
    executionError,
    page,
    setPage,
  };
}
