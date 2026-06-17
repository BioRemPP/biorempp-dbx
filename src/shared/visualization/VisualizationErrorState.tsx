/**
 * @packageDocumentation
 *
 * Shared error-state component used when a visualization request or render step fails.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui';

/**
 * Props accepted by the visualization error-state component.
 */
interface VisualizationErrorStateProps {
  /** Optional heading rendered above the error message. */
  title?: ReactNode;
  /** Error explanation shown to the user. */
  message: ReactNode;
  /** Optional label for a recovery action button. */
  actionLabel?: string;
  /** Optional callback invoked when the recovery action is triggered. */
  onAction?: () => void;
  /** Optional className merged into the outer container. */
  className?: string;
}

/**
 * Renders a shared error-state panel for visualization cards.
 *
 * @param props Error content, optional recovery action, and styling overrides.
 * @returns An alert container that communicates visualization failures.
 */
export function VisualizationErrorState({
  title = 'Unable to render visualization',
  message,
  actionLabel,
  onAction,
  className,
}: VisualizationErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-center',
        className
      )}
    >
      <p className="text-sm font-medium text-rose-700">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
