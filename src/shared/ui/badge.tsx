/**
 * @packageDocumentation
 *
 * Shared badge component and variant definitions used for status and label callouts.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

/**
 * Variant map for badge styling across the application.
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-white',
        secondary: 'border-slate-200 bg-slate-100 text-slate-700',
        subtle: 'border-blue-200 bg-blue-50 text-blue-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        danger: 'border-rose-200 bg-rose-50 text-rose-700',
        outline: 'border-slate-300 bg-white text-slate-700',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
);

/**
 * Props accepted by the shared badge component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

/**
 * Renders a compact badge using the shared variant palette.
 *
 * @param props Native div attributes plus the selected badge variant.
 * @returns A styled badge container.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
