/**
 * @packageDocumentation
 *
 * Shared error-state card used when a section fails to load or render.
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../lib/cn';

/**
 * Props accepted by the shared error-state component.
 */
interface ErrorStateProps {
  /** Optional heading shown above the error message. */
  title?: ReactNode;
  /** Optional explanatory message shown in the body. */
  message?: ReactNode;
  /** Optional label for the recovery action button. */
  actionLabel?: string;
  /** Optional callback invoked when the recovery action is triggered. */
  onAction?: () => void;
  /** Optional className merged into the outer card container. */
  className?: string;
}

/**
 * Renders a generic error-state surface with an optional recovery action.
 *
 * @param props Optional heading, message, action label, and styling overrides.
 * @returns A centered error-state card.
 */
export function ErrorState({
  title = 'Unable to load content',
  message = 'An unexpected error prevented the page from rendering correctly.',
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn('border-rose-200 shadow-soft', className)}>
      <CardContent
        role="alert"
        aria-live="assertive"
        className="flex min-h-40 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
      >
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-700">{title}</p>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
        {actionLabel && onAction ? (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
