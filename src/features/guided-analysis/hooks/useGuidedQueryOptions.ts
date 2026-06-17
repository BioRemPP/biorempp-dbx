/**
 * @packageDocumentation
 *
 * Hook for loading dependent guided filter options from the server.
 */
import { useEffect, useMemo, useState } from 'react';
import { getGuidedQueryOptions } from '@/features/guided-analysis/api';
import type {
  GuidedFilterOption,
  GuidedFilterState,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';
import { serializeFiltersForOptions } from '@/features/guided-analysis/utils';

/**
 * Result contract returned by the guided query options hook.
 */
interface UseGuidedQueryOptionsResult {
  /** Available options keyed by filter identifier. */
  optionsByFilter: Record<string, GuidedFilterOption[]>;
  /** Whether a filter-options request is currently in flight. */
  optionsLoading: boolean;
  /** User-facing error string for the latest failed options request. */
  optionsError: string | null;
  /** Query identifier whose option set is fully ready for validation and execution. */
  optionsReadyForQueryId: string;
}

/**
 * Loads dependent filter options for the currently selected guided query.
 *
 * @param query Guided query definition whose filters own the option lists.
 * @param filters Current guided filter state used to parameterize dependent option endpoints.
 * @param enabled Whether options should be loaded for the current query state.
 * @returns The current option sets plus loading, error, and readiness state.
 */
export function useGuidedQueryOptions(
  query: GuidedQueryDefinition | null,
  filters: GuidedFilterState,
  enabled = true
): UseGuidedQueryOptionsResult {
  const [optionsByFilter, setOptionsByFilter] = useState<Record<string, GuidedFilterOption[]>>({});
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [optionsReadyForQueryId, setOptionsReadyForQueryId] = useState('');

  const serializedFilters = useMemo(() => serializeFiltersForOptions(filters), [filters]);
  const serializedFiltersKey = useMemo(() => JSON.stringify(serializedFilters), [serializedFilters]);

  useEffect(() => {
    if (!query || !enabled) {
      setOptionsByFilter({});
      setOptionsLoading(false);
      setOptionsError(null);
      setOptionsReadyForQueryId(query && !enabled ? '' : query?.id || '');
      return;
    }

    const queryId = query.id;
    let cancelled = false;

    setOptionsLoading(true);
    setOptionsError(null);
    setOptionsReadyForQueryId('');

    async function loadOptions() {
      try {
        const response = await getGuidedQueryOptions(queryId, serializedFilters);
        if (cancelled) {
          return;
        }
        setOptionsByFilter(response.options);
      } catch (error) {
        if (cancelled) {
          return;
        }
        setOptionsByFilter({});
        setOptionsError(error instanceof Error ? error.message : 'Unable to load filter options.');
      } finally {
        if (!cancelled) {
          setOptionsLoading(false);
          setOptionsReadyForQueryId(queryId);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [enabled, query, serializedFilters, serializedFiltersKey]);

  return {
    optionsByFilter,
    optionsLoading,
    optionsError,
    optionsReadyForQueryId,
  };
}
