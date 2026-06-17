/**
 * @packageDocumentation
 *
 * Shared no-results state used when a search or filtered list returns no matches.
 */
import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

/**
 * Props accepted by the no-results state component.
 */
interface NoResultsStateProps {
  /** Optional heading shown above the no-results message. */
  title?: ReactNode;
  /** Optional explanatory message shown in the body. */
  message?: ReactNode;
  /** Optional action node rendered below the message. */
  action?: ReactNode;
  /** Optional className forwarded to the shared empty state. */
  className?: string;
}

/**
 * Renders a specialized empty state for filter and search results.
 *
 * @param props Optional heading, message, action, and styling overrides.
 * @returns A no-results surface backed by the shared empty-state component.
 */
export function NoResultsState({
  title = 'No matching results',
  message = 'Try broader filters or different search terms.',
  action,
  className,
}: NoResultsStateProps) {
  return <EmptyState title={title} message={message} action={action} className={className} />;
}
