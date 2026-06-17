/**
 * @packageDocumentation
 *
 * Lightweight tooltip wrapper for visualizations that rely on the browser `title` attribute.
 */
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the lightweight chart tooltip wrapper.
 */
interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip text forwarded to the native `title` attribute. */
  content: string;
  /** Optional children rendered inside the tooltip wrapper. */
  children?: ReactNode;
}

/**
 * Wraps visualization content with a native-title tooltip surface.
 *
 * @param props Tooltip text, children, className, and native div attributes.
 * @returns A `div` that exposes tooltip content through the `title` attribute.
 */
export function ChartTooltip({
  content,
  children,
  className,
  ...props
}: ChartTooltipProps) {
  return (
    <div title={content} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
