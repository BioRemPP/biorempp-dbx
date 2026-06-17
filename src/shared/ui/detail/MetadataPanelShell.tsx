/**
 * @packageDocumentation
 *
 * Shared shell for metadata panels with optional heading and description text.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the metadata panel shell.
 */
interface MetadataPanelShellProps {
  /** Optional panel title rendered above the content. */
  title?: ReactNode;
  /** Optional panel description rendered below the title. */
  description?: ReactNode;
  /** Metadata content rendered inside the panel shell. */
  children: ReactNode;
  /** Optional className merged into the outer section wrapper. */
  className?: string;
}

/**
 * Renders a lightweight metadata panel wrapper for detail subsections.
 *
 * @param props Optional heading content, children, and styling overrides.
 * @returns A vertically spaced metadata section wrapper.
 */
export function MetadataPanelShell({
  title,
  description,
  children,
  className,
}: MetadataPanelShellProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {title || description ? (
        <div className="space-y-1">
          {title ? <h3 className="text-base font-semibold text-slate-950">{title}</h3> : null}
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
