/**
 * @packageDocumentation
 *
 * Shared categorical heatmap table for visualization payloads that map numeric values onto a
 * discrete x/y label grid.
 */
import { ChartTooltip, VisualizationEmptyState } from '@/shared/visualization';
import { useMemo } from 'react';

/**
 * One normalized heatmap cell keyed by x and y categorical labels.
 */
export interface HeatmapCell {
  /** Column label key. */
  x: string;
  /** Row label key. */
  y: string;
  /** Numeric value used for color scaling. */
  value: number;
  /** Optional tooltip override shown on hover. */
  tooltip?: string;
  /** Optional semantic color key preserved for custom renderers. */
  colorKey?: string;
  /** Optional preformatted display value rendered inside the cell. */
  displayValue?: string;
}

/**
 * Props accepted by the categorical heatmap component.
 */
interface CategoricalHeatmapProps {
  /** Ordered x-axis labels rendered as columns. */
  xLabels: string[];
  /** Ordered y-axis labels rendered as rows. */
  yLabels: string[];
  /** Sparse heatmap cells keyed by x and y labels. */
  cells: HeatmapCell[];
  /** Message shown when the heatmap has no labels or cells. */
  emptyMessage: string;
  /** Whether to render formatted values inside each heatmap cell. */
  showValues?: boolean;
  /** Formatter used for cell values and fallback tooltip text. */
  valueFormatter?: (value: number) => string;
  /** Optional cell-color resolver that receives the normalized value. */
  getCellColor?: (cell: HeatmapCell, normalizedValue: number) => string;
}

function defaultCellColor(_cell: HeatmapCell, normalizedValue: number) {
  const clamped = Math.max(0, Math.min(1, normalizedValue));
  const lightness = 96 - clamped * 42;
  return `hsl(214, 82%, ${lightness}%)`;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/**
 * Renders a categorical heatmap with tooltip-enabled cells and normalized color scaling.
 *
 * @param props Labels, cells, empty-state message, and optional formatting controls.
 * @returns A heatmap table, or an empty-state message when the input grid is empty.
 */
export function CategoricalHeatmap({
  xLabels,
  yLabels,
  cells,
  emptyMessage,
  showValues = false,
  valueFormatter = (value) => value.toFixed(2),
  getCellColor = defaultCellColor,
}: CategoricalHeatmapProps) {
  if (xLabels.length === 0 || yLabels.length === 0 || cells.length === 0) {
    return <VisualizationEmptyState message={emptyMessage} />;
  }

  const { cellMap, min, span } = useMemo(() => {
    const minValue = Math.min(...cells.map((cell) => cell.value));
    const maxValue = Math.max(...cells.map((cell) => cell.value));

    return {
      cellMap: new Map(cells.map((cell) => [`${cell.y}|${cell.x}`, cell] as const)),
      min: minValue,
      span: Math.max(1e-9, maxValue - minValue),
    };
  }, [cells]);

  const tableRows = useMemo(
    () =>
      yLabels.map((yLabel) => ({
        cells: xLabels.map((xLabel) => {
          const cell = cellMap.get(`${yLabel}|${xLabel}`) || {
            x: xLabel,
            y: yLabel,
            value: 0,
          };
          const normalized = clamp01((cell.value - min) / span);

          return {
            color: getCellColor(cell, normalized),
            displayValue: showValues ? cell.displayValue || valueFormatter(cell.value) : null,
            key: `${yLabel}|${xLabel}`,
            tooltip: cell.tooltip || `${yLabel} x ${xLabel}: ${valueFormatter(cell.value)}`,
          };
        }),
        yLabel,
      })),
    [cellMap, getCellColor, min, showValues, span, valueFormatter, xLabels, yLabels]
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-[11px] text-gray-500 font-medium pr-2"></th>
            {xLabels.map((label) => (
              <th key={label} className="text-[10px] text-gray-500 font-medium text-left min-w-[72px]">
                <span className="block truncate" title={label}>
                  {label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.yLabel}>
              <th className="text-[11px] text-gray-700 font-medium text-left pr-2 align-middle whitespace-nowrap">
                <span className="block truncate max-w-[120px]" title={row.yLabel}>
                  {row.yLabel}
                </span>
              </th>
              {row.cells.map((entry) => {
                return (
                  <td key={entry.key} className="p-0">
                    <ChartTooltip
                      content={entry.tooltip}
                      className="h-7 rounded border border-gray-100 text-[10px] text-gray-800 px-1 flex items-center justify-center"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.displayValue}
                    </ChartTooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
