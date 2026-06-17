/**
 * @packageDocumentation
 *
 * Helpers for normalizing guided filter defaults, validating option-backed fields, and
 * serializing request payloads.
 */
import type {
  GuidedFilterDefinition,
  GuidedFilterOption,
  GuidedFilterState,
  GuidedFilterValue,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';

function toNumberRangeValue(rawValue: unknown): { min?: number; max?: number } {
  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {};
  }

  const rawRange = rawValue as { min?: unknown; max?: unknown };
  const min = typeof rawRange.min === 'number' ? rawRange.min : undefined;
  const max = typeof rawRange.max === 'number' ? rawRange.max : undefined;

  return { min, max };
}

/**
 * Converts a raw default value into the client-side value shape expected by a guided filter.
 *
 * @param filter Guided filter definition that determines the target value shape.
 * @param rawValue Raw default value loaded from the query definition.
 * @returns A normalized filter value compatible with the filter type.
 *
 * @remarks
 * Toggle filters accept common boolean-like primitives, range filters keep only numeric `min` and `max` values,
 * and other filters fall back to an empty string when the raw value is not a string.
 */
export function toDefaultFilterValue(
  filter: GuidedFilterDefinition,
  rawValue: unknown
): GuidedFilterValue {
  if (filter.type === 'toggle') {
    return rawValue === true || rawValue === 'true' || rawValue === 1 || rawValue === '1';
  }

  if (filter.type === 'number_range') {
    return toNumberRangeValue(rawValue);
  }

  if (typeof rawValue === 'string') {
    return rawValue;
  }

  return '';
}

/**
 * Builds the initial guided filter state for a query definition.
 *
 * @param query Guided query definition whose defaults should seed the state.
 * @returns A normalized filter state keyed by filter identifier.
 *
 * @remarks
 * Missing queries return an empty object. Missing filter defaults are normalized according to each filter type.
 */
export function buildDefaultFilterState(query: GuidedQueryDefinition | null): GuidedFilterState {
  if (!query) {
    return {};
  }

  const defaults = (query.defaults?.filters || {}) as Record<string, unknown>;
  const state: GuidedFilterState = {};

  for (const filter of query.filters) {
    state[filter.id] = toDefaultFilterValue(filter, defaults[filter.id]);
  }

  return state;
}

/**
 * Resolves the default result page size declared by a guided query.
 *
 * @param query Guided query definition whose default page size should be read.
 * @returns A positive page size capped to the range supported by the client.
 *
 * @remarks
 * The function falls back to `10` when the query is missing or when `defaults.page_size` is absent, non-numeric,
 * or not greater than zero. Valid values are truncated to integers and clamped to the inclusive range `1..200`.
 */
export function getGuidedQueryPageSize(query: GuidedQueryDefinition | null): number {
  if (!query) {
    return 10;
  }

  const fromDefaults = Number(query.defaults?.page_size);
  if (!Number.isFinite(fromDefaults) || fromDefaults <= 0) {
    return 10;
  }

  return Math.min(200, Math.max(1, Math.trunc(fromDefaults)));
}

/**
 * Serializes the current filter state for option-loading endpoints.
 *
 * @param filters Client-side guided filter state.
 * @returns A string-only payload containing non-empty string values and explicit boolean selections.
 *
 * @remarks
 * Number-range values are omitted because option endpoints only consume simple scalar filters in the current client.
 * String values are trimmed before they are forwarded.
 */
export function serializeFiltersForOptions(filters: GuidedFilterState): Record<string, string> {
  const serialized: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string' && value.trim() !== '') {
      serialized[key] = value.trim();
      continue;
    }

    if (typeof value === 'boolean') {
      serialized[key] = value ? 'true' : 'false';
    }
  }

  return serialized;
}

/**
 * Serializes the current filter state for guided query execution requests.
 *
 * @param filters Client-side guided filter state.
 * @returns A payload containing trimmed strings, `true` boolean toggles, and populated numeric ranges.
 *
 * @remarks
 * Empty strings, `false` booleans, and empty numeric ranges are omitted from the resulting payload.
 */
export function serializeFiltersForExecute(filters: GuidedFilterState): Record<string, unknown> {
  const serialized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string') {
      if (value.trim() !== '') {
        serialized[key] = value.trim();
      }
      continue;
    }

    if (typeof value === 'boolean') {
      if (value) {
        serialized[key] = value;
      }
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const min = typeof value.min === 'number' ? value.min : undefined;
      const max = typeof value.max === 'number' ? value.max : undefined;

      if (min !== undefined || max !== undefined) {
        serialized[key] = { min, max };
      }
    }
  }

  return serialized;
}

/**
 * Determines whether a filter's current value should be validated against an option list.
 *
 * @param filter Guided filter definition to inspect.
 * @returns `true` for filter types backed by explicit option lists.
 */
export function shouldValidateOptions(filter: GuidedFilterDefinition): boolean {
  return filter.type === 'select' || filter.type === 'dependent_select';
}

/**
 * Reconciles the current filter state with the latest available options.
 *
 * @param query Guided query definition that owns the filters.
 * @param current Current client-side filter state.
 * @param optionsByFilter Latest option sets keyed by filter identifier.
 * @returns The original state when nothing changes, or a cloned state with invalid selections removed.
 *
 * @remarks
 * Only `select` and `dependent_select` filters are validated. Invalid `select` values are cleared to an empty
 * string, while invalid `dependent_select` values fall back to the first available option when one exists.
 */
export function sanitizeFilterStateForOptions(
  query: GuidedQueryDefinition | null,
  current: GuidedFilterState,
  optionsByFilter: Record<string, GuidedFilterOption[]>
): GuidedFilterState {
  if (!query) {
    return current;
  }

  let changed = false;
  const next: GuidedFilterState = { ...current };

  for (const filter of query.filters) {
    if (!shouldValidateOptions(filter)) {
      continue;
    }

    const options = optionsByFilter[filter.id];
    if (!options || options.length === 0) {
      continue;
    }

    const currentValue = typeof current[filter.id] === 'string' ? current[filter.id] : '';
    if (!currentValue) {
      continue;
    }

    const exists = options.some((option) => option.value === currentValue);
    if (exists) {
      continue;
    }

    next[filter.id] = filter.type === 'dependent_select' ? options[0]?.value || '' : '';
    changed = true;
  }

  return changed ? next : current;
}
