/**
 * @packageDocumentation
 *
 * Hook for tracking the currently selected guided query within a loaded catalog.
 */
import { useEffect, useMemo, useState } from 'react';
import type {
  GuidedCatalogResponse,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';

/**
 * Result contract returned by the guided query selection hook.
 */
interface UseGuidedQuerySelectionResult {
  /** Identifier of the currently selected guided query. */
  selectedQueryId: string;
  /** Updates the currently selected guided query identifier. */
  setSelectedQueryId: (queryId: string) => void;
  /** Resolved guided query definition for the current selection. */
  selectedQuery: GuidedQueryDefinition | null;
}

/**
 * Tracks query selection and keeps it valid against the current catalog.
 *
 * @param catalog Guided analysis catalog returned by the backend.
 * @returns Selected query identifier, setter, and resolved query definition.
 *
 * @remarks
 * When the catalog changes, the hook preserves the current selection if possible and otherwise
 * falls back to the first available query in catalog order.
 */
export function useGuidedQuerySelection(
  catalog: GuidedCatalogResponse | null
): UseGuidedQuerySelectionResult {
  const [selectedQueryId, setSelectedQueryId] = useState('');

  const selectedQuery = useMemo(
    () => catalog?.queries.find((query) => query.id === selectedQueryId) || null,
    [catalog, selectedQueryId]
  );

  useEffect(() => {
    if (!catalog?.queries.length) {
      setSelectedQueryId('');
      return;
    }

    setSelectedQueryId((current) => {
      if (catalog.queries.some((query) => query.id === current)) {
        return current;
      }

      return catalog.queries[0]?.id || '';
    });
  }, [catalog]);

  return {
    selectedQueryId,
    setSelectedQueryId,
    selectedQuery,
  };
}
