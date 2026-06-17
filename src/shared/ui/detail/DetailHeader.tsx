/**
 * @packageDocumentation
 *
 * Shared header component for entity detail pages with back navigation and optional actions.
 */
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the shared detail header component.
 */
interface DetailHeaderProps {
  /** Primary title rendered in the detail header. */
  title: ReactNode;
  /** Optional subtitle rendered below the title. */
  subtitle?: ReactNode;
  /** Callback invoked when the back affordance is triggered. */
  onBack: () => void;
  /** Accessible label for the back button. */
  backLabel?: string;
  /** Optional action area rendered on the right side of the header. */
  action?: ReactNode;
  /** Optional media block rendered beside the title text. */
  media?: ReactNode;
  /** Optional custom content that replaces the default title and subtitle layout. */
  content?: ReactNode;
  /** Optional className merged into the outer header container. */
  className?: string;
}

/**
 * Renders a consistent header for detail views with back navigation and optional actions.
 *
 * @param props Title content, navigation callback, and optional custom layout regions.
 * @returns A responsive detail header surface.
 */
export function DetailHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Go back',
  action,
  media,
  content,
  className,
}: DetailHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label={backLabel}
          className="mt-0.5 text-slate-600 hover:text-slate-900"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {content ? (
          <div className="min-w-0 flex-1 w-full">{content}</div>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="min-w-0 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
              {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
            </div>
            {media ? <div className="shrink-0">{media}</div> : null}
          </div>
        )}
      </div>
      {action ? <div className="flex items-center gap-3 sm:justify-end">{action}</div> : null}
    </div>
  );
}
