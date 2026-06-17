/**
 * @packageDocumentation
 *
 * Shared metric card component used to present compact KPI-style values.
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { cn } from '../lib/cn';

/**
 * Props accepted by the shared metric card component.
 */
interface MetricCardProps {
  /** Metric label rendered above the value. */
  label: ReactNode;
  /** Primary metric value shown with emphasized typography. */
  value: ReactNode;
  /** Optional supporting hint displayed below the value. */
  hint?: ReactNode;
  /** Optional className merged into the outer card container. */
  className?: string;
  /** Optional className merged into the value element. */
  valueClassName?: string;
}

/**
 * Renders a compact metric card for summary dashboards and snapshot sections.
 *
 * @param props Label, value, optional hint, and styling overrides.
 * @returns A surfaced card with a single highlighted metric.
 */
export function MetricCard({ label, value, hint, className, valueClassName }: MetricCardProps) {
  return (
    <Card className={cn('rounded-2xl shadow-soft', className)}>
      <CardContent className="space-y-1 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className={cn('text-2xl font-semibold tracking-tight text-slate-950', valueClassName)}>{value}</p>
        {hint ? <p className="text-xs leading-5 text-slate-500">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
