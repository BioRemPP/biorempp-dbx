/**
 * @packageDocumentation
 *
 * Shared empty-state card used when a section has no data to display.
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../lib/cn';

/**
 * Props accepted by the shared empty-state component.
 */
interface EmptyStateProps {
  /** Optional heading shown above the empty-state message. */
  title?: ReactNode;
  /** Optional explanatory message shown in the body. */
  message?: ReactNode;
  /** Optional action node rendered below the message. */
  action?: ReactNode;
  /** Optional className merged into the outer card container. */
  className?: string;
}

/**
 * Renders a generic empty-state surface for sections without content.
 *
 * @param props Optional heading, message, action, and styling overrides.
 * @returns A centered empty-state card.
 */
export function EmptyState({
  title = 'Nothing to display',
  message = 'There is no data available for this section yet.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('shadow-soft', className)}>
      <CardContent
        role="status"
        aria-live="polite"
        className="flex min-h-40 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
      >
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
        {action ? <div className="flex items-center justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
