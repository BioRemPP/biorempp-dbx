/**
 * @packageDocumentation
 *
 * Shared section header component for page sections with optional eyebrow text and actions.
 */
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Props accepted by the shared section header component.
 */
interface SectionHeaderProps {
  /** Primary heading rendered for the section. */
  title: ReactNode;
  /** Optional descriptive copy shown under the title. */
  description?: ReactNode;
  /** Optional eyebrow label shown above the title. */
  eyebrow?: ReactNode;
  /** Optional action area rendered beside the heading content. */
  action?: ReactNode;
  /** Optional className merged into the outer wrapper. */
  className?: string;
  /** Optional className merged into the text content wrapper. */
  contentClassName?: string;
  /** Optional className merged into the description paragraph. */
  descriptionClassName?: string;
}

/**
 * Renders a consistent section heading block for major page sections.
 *
 * @param props Text content, optional action node, and styling overrides.
 * @returns A responsive section header layout.
 */
export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  className,
  contentClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className={cn('space-y-2', contentClassName)}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
          {description ? (
            <p className={cn('max-w-3xl text-sm leading-6 text-slate-600', descriptionClassName)}>{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
