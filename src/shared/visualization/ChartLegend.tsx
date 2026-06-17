/**
 * @packageDocumentation
 *
 * Shared categorical legend component used by chart and heatmap visualizations.
 */
import { cn } from '@/shared/lib/cn';

/**
 * One categorical legend item.
 */
export interface ChartLegendItem {
  /** Human-readable label shown in the legend. */
  label: string;
  /** Color swatch shown beside the label. */
  color: string;
}

/**
 * Props accepted by the shared chart legend.
 */
interface ChartLegendProps {
  /** Ordered legend items to render. */
  items: ChartLegendItem[];
  /** Optional className forwarded to the outer legend container. */
  className?: string;
}

/**
 * Renders a compact categorical legend.
 *
 * @param props Legend items and optional container className.
 * @returns A flex-wrapped legend, or `null` when no items are available.
 */
export function ChartLegend({ items, className }: ChartLegendProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-3 text-xs text-slate-600', className)}>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-sm border border-slate-200"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
