/**
 * @packageDocumentation
 *
 * Shared loading-state card used while section data is being prepared.
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../lib/cn';

/**
 * Props accepted by the shared loading-state component.
 */
interface LoadingStateProps {
  /** Optional heading shown above the loading message. */
  title?: ReactNode;
  /** Optional explanatory message shown below the spinner. */
  message?: ReactNode;
  /** Optional className merged into the outer card container. */
  className?: string;
}

/**
 * Renders a generic loading-state surface for async sections.
 *
 * @param props Optional heading, message, and styling overrides.
 * @returns A centered loading-state card with a spinner affordance.
 */
export function LoadingState({
  title = 'Loading content',
  message = 'Please wait while the page data is prepared.',
  className,
}: LoadingStateProps) {
  return (
    <Card className={cn('shadow-soft', className)}>
      <CardContent
        role="status"
        aria-live="polite"
        className="flex min-h-40 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-accent" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
