/**
 * @packageDocumentation
 *
 * Shared metric strip used by entity detail pages to surface summary statistics.
 */
import type { ReactNode } from 'react';
import { MetricCard } from '@/shared/ui/metric-card';
import { cn } from '@/shared/lib/cn';

/**
 * One metric card rendered inside an entity stat strip.
 */
export interface EntityStatItem {
  /** Metric label shown above the value. */
  label: ReactNode;
  /** Primary metric value shown with emphasized typography. */
  value: ReactNode;
  /** Optional supporting hint shown below the value. */
  hint?: ReactNode;
  /** Optional className merged into the metric card container. */
  className?: string;
  /** Optional className merged into the metric value element. */
  valueClassName?: string;
  /** Grid span used to widen selected metrics within the strip. */
  span?: 1 | 2 | 3 | 'full';
}

/**
 * Props accepted by the entity stat strip component.
 */
interface EntityStatStripProps {
  /** Metric items rendered in the strip. */
  items: EntityStatItem[];
  /** Optional className merged into the outer strip wrapper. */
  className?: string;
  /** Optional className merged into the inner grid container. */
  gridClassName?: string;
}

function getSpanClass(span: EntityStatItem['span']) {
  switch (span) {
    case 2:
      return 'sm:col-span-2';
    case 3:
      return 'xl:col-span-3';
    case 'full':
      return 'sm:col-span-2 xl:col-span-full';
    default:
      return '';
  }
}

/**
 * Renders a responsive grid of summary metrics for entity detail views.
 *
 * @param props Metric items and optional layout overrides.
 * @returns A surfaced strip of metric cards.
 */
export function EntityStatStrip({ items, className, gridClassName }: EntityStatStripProps) {
  return (
    <div className={cn('bg-slate-50/80 px-6 py-5', className)}>
      <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4', gridClassName)}>
        {items.map((item) => (
          <MetricCard
            key={String(item.label)}
            label={item.label}
            value={item.value}
            hint={item.hint}
            className={cn('rounded-2xl border-slate-200 shadow-none', getSpanClass(item.span), item.className)}
            valueClassName={item.valueClassName}
          />
        ))}
      </div>
    </div>
  );
}
