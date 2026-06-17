/**
 * @packageDocumentation
 *
 * Shared status panel used by detail pages for loading, error, and not-found states.
 */
import type { ReactNode } from 'react';
import { EmptyState, ErrorState, LoadingState } from '@/shared/feedback';
import { Button } from '@/shared/ui/button';

/**
 * Props accepted by the detail status panel.
 */
interface DetailStatusPanelProps {
  /** Status variant to render for the detail view. */
  status: 'loading' | 'error' | 'not-found';
  /** Optional heading passed to the selected feedback component. */
  title?: ReactNode;
  /** Optional message passed to the selected feedback component. */
  message?: ReactNode;
  /** Optional back-navigation callback for not-found and fallback error actions. */
  onBack?: () => void;
  /** Label used for the back action when it is rendered. */
  backLabel?: string;
  /** Optional retry callback used by the error state. */
  onRetry?: () => void;
  /** Label used for the retry action. */
  retryLabel?: string;
  /** Optional className forwarded to the selected feedback component. */
  className?: string;
}

/**
 * Renders the appropriate feedback state for a detail page.
 *
 * @param props Status, optional messaging, and retry or back-navigation callbacks.
 * @returns A loading, error, or empty-state panel depending on the status value.
 * @remarks
 * When both `onRetry` and `onBack` are provided for the error state, retry takes precedence as
 * the primary action.
 */
export function DetailStatusPanel({
  status,
  title,
  message,
  onBack,
  backLabel = 'Go back',
  onRetry,
  retryLabel = 'Try again',
  className,
}: DetailStatusPanelProps) {
  if (status === 'loading') {
    return <LoadingState title={title} message={message} className={className} />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title={title}
        message={message}
        actionLabel={onRetry ? retryLabel : onBack ? backLabel : undefined}
        onAction={onRetry || onBack}
        className={className}
      />
    );
  }

  return (
    <EmptyState
      title={title}
      message={message}
      action={
        onBack ? (
          <Button variant="outline" onClick={onBack}>
            {backLabel}
          </Button>
        ) : undefined
      }
      className={className}
    />
  );
}
