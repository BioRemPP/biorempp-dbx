/**
 * @packageDocumentation
 *
 * Adapter helpers that map pathway overview payloads into shared visualization inputs.
 */
import type {
  PathwayEcClassDistributionDatum,
  PathwayGeneDistributionDatum,
  PathwayKoDistributionDatum,
} from '@/features/pathways/types';
import type { DonutSlice } from '@shared/visualization/charts/DonutChart';
import type { HorizontalBarItem } from '@shared/visualization/charts/HorizontalBarChart';

const EC_CLASS_COLORS: Record<string, string> = {
  '1.x.x.x': '#2563eb',
  '2.x.x.x': '#22c55e',
  '3.x.x.x': '#f59e0b',
  '4.x.x.x': '#a78bfa',
  '5.x.x.x': '#06b6d4',
  '6.x.x.x': '#ef4444',
  '7.x.x.x': '#64748b',
  Other: '#94a3b8',
};

/**
 * Converts pathway KO distribution rows into horizontal bar chart items.
 *
 * @param rows KO distribution rows returned by the pathway overview payload.
 * @returns Bar items ready for the shared horizontal bar chart.
 */
export function toPathwayKoBarItems(rows: PathwayKoDistributionDatum[]): HorizontalBarItem[] {
  return rows.map((row) => ({
    id: row.ko,
    label: row.ko,
    value: row.count,
    tooltip: `${row.ko}: ${row.count} gene associations`,
    color: '#2563eb',
  }));
}

/**
 * Converts pathway gene distribution rows into horizontal bar chart items.
 *
 * @param rows Gene distribution rows returned by the pathway overview payload.
 * @returns Bar items ready for the shared horizontal bar chart.
 */
export function toPathwayGeneBarItems(rows: PathwayGeneDistributionDatum[]): HorizontalBarItem[] {
  return rows.map((row) => ({
    id: row.gene,
    label: row.gene,
    value: row.count,
    tooltip: `${row.gene}: ${row.count} KO links in this pathway`,
    color: '#22c55e',
  }));
}

/**
 * Converts pathway EC class rows into donut-chart slices.
 *
 * @param rows EC class distribution rows returned by the pathway overview payload.
 * @returns Donut slices ready for the shared donut chart component.
 */
export function toPathwayEcDonutSlices(rows: PathwayEcClassDistributionDatum[]): DonutSlice[] {
  return rows.map((row) => ({
    id: row.ec_class,
    label: row.ec_class,
    value: row.count,
    color: EC_CLASS_COLORS[row.ec_class] || EC_CLASS_COLORS.Other,
  }));
}
