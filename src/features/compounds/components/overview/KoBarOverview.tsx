/**
 * @packageDocumentation
 *
 * KO coverage overview chart for compound detail pages.
 */
import type { KoBarDatum } from '@/features/compounds/types';
import { toKoBarItems } from '@features/compounds/utils/overviewAdapters';
import { ChartCard } from '@shared/visualization/charts/ChartCard';
import { HorizontalBarChart } from '@shared/visualization/charts/HorizontalBarChart';

/**
 * Props accepted by the KO bar overview chart.
 */
interface KoBarOverviewProps {
  /** Ranked KO summary rows returned by the compound overview endpoint. */
  rows: KoBarDatum[];
}

/**
 * Renders a horizontal bar chart for the top KO-to-pathway relation counts of a compound.
 *
 * @param props Ranked KO overview rows for the selected compound.
 * @returns A chart card with normalized KO bar items and an empty-state fallback.
 */
export function KoBarOverview({ rows }: KoBarOverviewProps) {
  const items = toKoBarItems(rows);

  return (
    <ChartCard title="KO Coverage (Real Relations)" subtitle="Distinct KO↔Pathway relations (HADEG + KEGG)">
      <HorizontalBarChart
        items={items}
        emptyMessage="No KO distribution available."
        valueFormatter={(value) => `${value}`}
      />
    </ChartCard>
  );
}
