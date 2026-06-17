/**
 * @packageDocumentation
 *
 * Shared card shell for visualization sections with title, subtitle, and optional header action.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

/**
 * Props accepted by the shared visualization card shell.
 */
interface VisualizationCardShellProps {
  /** Title shown in the card header. */
  title: string;
  /** Optional subtitle shown below the title. */
  subtitle?: string;
  /** Optional action rendered on the right side of the header. */
  headerAction?: ReactNode;
  /** Visualization content rendered inside the card body. */
  children: ReactNode;
  /** Optional className forwarded to the card container. */
  className?: string;
  /** Optional className forwarded to the card content section. */
  contentClassName?: string;
}

/**
 * Renders a shared card shell for visualization content.
 *
 * @param props Header content, optional action, body content, and styling overrides.
 * @returns A shared visualization card container.
 */
export function VisualizationCardShell({
  title,
  subtitle,
  headerAction,
  children,
  className,
  contentClassName,
}: VisualizationCardShellProps) {
  return (
    <Card className={cn('min-w-0 overflow-hidden', className)}>
      <CardHeader className="gap-3 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-sm">{title}</CardTitle>
            {subtitle ? (
              <CardDescription className="text-xs text-slate-500">
                {subtitle}
              </CardDescription>
            ) : null}
          </div>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn('space-y-3 px-5 pb-5', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
