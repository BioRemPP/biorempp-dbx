/**
 * @packageDocumentation
 *
 * Panel wrapper for guided filter controls and dependent-option warning state.
 */
import { GuidedFiltersBar } from '@/features/guided-analysis/components/GuidedFiltersBar';
import type {
  GuidedFilterOption,
  GuidedFilterState,
  GuidedFilterValue,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';
import { Card, CardContent } from '@/shared/ui';
import { GuidedStatusBanner } from '@/features/guided-analysis/components/GuidedStatusBanner';

/**
 * Props accepted by the guided filters panel.
 */
interface GuidedFiltersPanelProps {
  /** Guided query that defines the available filter controls. */
  query: GuidedQueryDefinition;
  /** Current guided filter values keyed by filter identifier. */
  values: GuidedFilterState;
  /** Available options keyed by filter identifier. */
  optionsByFilter: Record<string, GuidedFilterOption[]>;
  /** User-facing error string from dependent option loading. */
  optionsError: string | null;
  /** Callback invoked when one filter value changes. */
  onChange: (filterId: string, value: GuidedFilterValue) => void;
  /** Callback that restores the current query defaults. */
  onReset: () => void;
}

/**
 * Renders guided filters inside a card and surfaces option-refresh warnings when necessary.
 *
 * @param props Query definition, current values, option sets, and filter callbacks.
 * @returns A filter panel containing the guided filters bar and any option warning banner.
 */
export function GuidedFiltersPanel({
  query,
  values,
  optionsByFilter,
  optionsError,
  onChange,
  onReset,
}: GuidedFiltersPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        {optionsError ? (
          <GuidedStatusBanner tone="warning">
            Unable to refresh dependent filter options. Current filters remain available.
          </GuidedStatusBanner>
        ) : null}

        <GuidedFiltersBar
          filters={query.filters}
          values={values}
          optionsByFilter={optionsByFilter}
          onChange={onChange}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
}
