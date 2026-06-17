/**
 * @packageDocumentation
 *
 * Hook for initializing, updating, and resetting guided filter state for the selected query.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  GuidedFilterState,
  GuidedFilterValue,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';
import { buildDefaultFilterState } from '@/features/guided-analysis/utils';

/**
 * Options accepted by the guided filter state hook.
 */
interface UseGuidedFilterStateOptions {
  /** Guided query whose defaults should seed the local filter state. */
  query: GuidedQueryDefinition | null;
}

/**
 * Result contract returned by the guided filter state hook.
 */
interface UseGuidedFilterStateResult {
  /** Current guided filter state keyed by filter identifier. */
  filters: GuidedFilterState;
  /** Whether the local state has been initialized for the current query. */
  isReady: boolean;
  /** Replaces the entire filter state with a normalized next value. */
  replaceFilters: (nextFilters: GuidedFilterState) => void;
  /** Updates one filter value in the current state. */
  handleFilterChange: (filterId: string, value: GuidedFilterValue) => void;
  /** Restores the current query defaults. */
  handleResetFilters: () => void;
}

/**
 * Manages client-side guided filter state for the currently selected query.
 *
 * @param options Selected query whose filter defaults should drive the local state.
 * @returns The current filter state plus helpers for mutation, replacement, and reset.
 *
 * @remarks
 * The hook rebuilds its local state whenever the query changes so stale defaults do not leak
 * across use cases.
 */
export function useGuidedFilterState({
  query,
}: UseGuidedFilterStateOptions): UseGuidedFilterStateResult {
  const queryId = query?.id || '';
  const [filters, setFilters] = useState<GuidedFilterState>({});
  const [initializedQueryId, setInitializedQueryId] = useState('');

  const defaultFilters = useMemo(() => buildDefaultFilterState(query), [query]);

  useEffect(() => {
    setFilters(defaultFilters);
    setInitializedQueryId(queryId);
  }, [defaultFilters, queryId]);

  function handleFilterChange(filterId: string, value: GuidedFilterValue) {
    setFilters((current) => ({
      ...current,
      [filterId]: value,
    }));
  }

  const replaceFilters = useCallback((nextFilters: GuidedFilterState) => {
    setFilters(nextFilters);
  }, []);

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  return {
    filters,
    isReady: !query || initializedQueryId === queryId,
    replaceFilters,
    handleFilterChange,
    handleResetFilters,
  };
}
