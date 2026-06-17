/**
 * @packageDocumentation
 *
 * Shared tab panel wrapper that resolves lazy hook state into feedback or content.
 */
import type { ReactNode } from 'react';
import { EmptyState, ErrorState, LoadingState } from '@/shared/feedback';
import type { LazyTabDataState } from '@/shared/hooks/useLazyTabData';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the lazy tab panel component.
 */
interface LazyTabPanelProps<T> {
  /** Lazy hook state backing the current tab content. */
  state: LazyTabDataState<T>;
  /** Renderer invoked once data is available. */
  children: (data: T) => ReactNode;
  /** Optional predicate that decides whether loaded data should be treated as empty. */
  isEmpty?: (data: T) => boolean;
  /** Optional loading-state title override. */
  loadingTitle?: ReactNode;
  /** Optional loading-state message override. */
  loadingMessage?: ReactNode;
  /** Optional empty-state title override. */
  emptyTitle?: ReactNode;
  /** Optional empty-state message override. */
  emptyMessage?: ReactNode;
  /** Optional error-state title override. */
  errorTitle?: ReactNode;
  /** Label used for the retry action when an error occurs. */
  retryLabel?: string;
  /** Optional className merged into the rendered panel wrapper. */
  className?: string;
}

/**
 * Renders lazy tab content with built-in loading, error, and empty-state handling.
 *
 * @param props Hook state, render callback, and optional feedback overrides.
 * @returns A feedback component or the rendered tab content.
 */
export function LazyTabPanel<T>({
  state,
  children,
  isEmpty,
  loadingTitle,
  loadingMessage,
  emptyTitle,
  emptyMessage,
  errorTitle,
  retryLabel = 'Try again',
  className,
}: LazyTabPanelProps<T>) {
  if (state.loading && !state.data) {
    return <LoadingState title={loadingTitle} message={loadingMessage} className={className} />;
  }

  if (state.error && !state.data) {
    return (
      <ErrorState
        title={errorTitle}
        message={state.error}
        actionLabel={retryLabel}
        onAction={state.reload}
        className={className}
      />
    );
  }

  if (!state.data || (isEmpty ? isEmpty(state.data) : false)) {
    return <EmptyState title={emptyTitle} message={emptyMessage} className={className} />;
  }

  return <div className={cn('space-y-4', className)}>{children(state.data)}</div>;
}
