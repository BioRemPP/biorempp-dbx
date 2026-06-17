/**
 * @packageDocumentation
 *
 * Generic filter-state hook for explorer views with active-filter counting and reset helpers.
 */
import { useCallback, useMemo, useRef, useState } from 'react';

function isActiveFilterValue(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

/**
 * Manages a mutable filter object and exposes helpers for update, replace, and reset flows.
 *
 * @param initialFilters Initial filter object used for the first render and reset operations.
 * @returns Current filters, active-filter count, and mutation helpers.
 * @remarks
 * Setting a filter to `undefined`, `null`, or an empty string removes that key from the current
 * filter object instead of storing an inactive value.
 */
export function useFilterState<TFilters extends object>(initialFilters: TFilters) {
  const initialFiltersRef = useRef(initialFilters);
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  const setFilterValue = useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K] | undefined) => {
    setFilters((currentFilters) => {
      if (!isActiveFilterValue(value)) {
        const nextFilters = { ...currentFilters } as Record<string, unknown>;
        delete nextFilters[key as string];
        return nextFilters as TFilters;
      }

      return {
        ...currentFilters,
        [key]: value,
      } as TFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFiltersRef.current);
  }, []);

  const replaceFilters = useCallback((nextFilters: TFilters) => {
    setFilters(nextFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters as Record<string, unknown>).filter(isActiveFilterValue).length;
  }, [filters]);

  return {
    activeFilterCount,
    filters,
    replaceFilters,
    resetFilters,
    setFilterValue,
    setFilters,
  };
}
