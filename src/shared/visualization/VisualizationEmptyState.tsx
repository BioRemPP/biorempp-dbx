/**
 * @packageDocumentation
 *
 * Shared empty-state component used when a visualization has no renderable data.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the visualization empty-state component.
 */
interface VisualizationEmptyStateProps {
  /** Optional heading rendered above the descriptive message. */
  title?: ReactNode;
  /** Explanation shown when the visualization has no content to display. */
  message: ReactNode;
  /** Optional className merged into the outer container. */
  className?: string;
}

/**
 * Renders a shared empty-state panel for visualization cards.
 *
 * @param props Heading, descriptive message, and optional styling overrides.
 * @returns A status container that explains why no visualization is shown.
 */
export function VisualizationEmptyState({
  title = 'No visualization data available',
  message,
  className,
}: VisualizationEmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center',
        className
      )}
    >
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
