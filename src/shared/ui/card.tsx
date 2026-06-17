/**
 * @packageDocumentation
 *
 * Shared card layout primitives used to compose surfaced panels throughout the application.
 */
import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Base card container with the shared surface styling.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-3xl border border-slate-200/80 bg-white shadow-panel', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * Header region used for card titles, descriptions, and actions.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 px-6 py-5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * Title primitive for card headers.
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold tracking-tight text-slate-950', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * Description primitive for supplemental card header text.
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-6 text-slate-600', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * Body region used for the main card content.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('px-6 pb-6', className)} {...props} />
);
CardContent.displayName = 'CardContent';

/**
 * Footer region used for summary actions and closing metadata.
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 px-6 py-5', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
