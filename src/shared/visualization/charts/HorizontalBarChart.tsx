/**
 * @packageDocumentation
 *
 * Shared horizontal bar chart for ranked categorical values.
 */
/**
 * One ranked item rendered by the shared horizontal bar chart.
 */
export interface HorizontalBarItem {
  /** Stable item identifier. */
  id: string;
  /** Human-readable label shown beside the bar. */
  label: string;
  /** Numeric value used for bar width and display. */
  value: number;
  /** Optional tooltip shown on the item container. */
  tooltip?: string;
  /** Optional explicit bar color override. */
  color?: string;
}

/**
 * Props accepted by the shared horizontal bar chart.
 */
interface HorizontalBarChartProps {
  /** Ranked bar items to render. */
  items: HorizontalBarItem[];
  /** Message shown when the chart has no items. */
  emptyMessage: string;
  /** Optional formatter used for the numeric value labels. */
  valueFormatter?: (value: number) => string;
}

/**
 * Renders a ranked horizontal bar chart with proportional bar widths.
 *
 * @param props Bar items, empty-state message, and optional value formatter.
 * @returns A vertical list of horizontal bars, or an empty-state message when no items are available.
 */
export function HorizontalBarChart({
  items,
  emptyMessage,
  valueFormatter = (value) => String(value),
}: HorizontalBarChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const width = `${Math.max(2, (item.value / maxValue) * 100)}%`;
        return (
          <div key={item.id} className="space-y-1" title={item.tooltip}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-700 truncate">{item.label}</span>
              <span className="text-gray-900 font-medium">{valueFormatter(item.value)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded h-2">
              <div
                className="h-2 rounded"
                style={{ width, backgroundColor: item.color || '#2563eb' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
