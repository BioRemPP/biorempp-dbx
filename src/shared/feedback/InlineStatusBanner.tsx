/**
 * @packageDocumentation
 *
 * Shared inline banner used for lightweight status and notice messaging inside page content.
 */
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Supported visual tones for the inline status banner.
 */
type BannerTone = 'info' | 'success' | 'warning' | 'error';

const toneClassMap: Record<BannerTone, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
};

/**
 * Props accepted by the inline status banner component.
 */
interface InlineStatusBannerProps {
  /** Visual tone that drives semantics and color treatment. */
  tone?: BannerTone;
  /** Banner content rendered inside the inline callout. */
  children: ReactNode;
  /** Optional className merged into the outer banner wrapper. */
  className?: string;
}

/**
 * Renders a lightweight inline status banner for contextual notices.
 *
 * @param props Tone, content, and styling overrides.
 * @returns An inline status or alert banner.
 */
export function InlineStatusBanner({ tone = 'info', children, className }: InlineStatusBannerProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={cn('rounded-2xl border px-4 py-3 text-sm leading-6', toneClassMap[tone], className)}
    >
      {children}
    </div>
  );
}
