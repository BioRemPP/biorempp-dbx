/**
 * @packageDocumentation
 *
 * Formatting helpers shared by visualization components for labels and endpoint presentation.
 */
import type { CompoundSummary } from '@/features/compounds/types';

/**
 * Truncates a label to the requested maximum length.
 *
 * @param value Label to truncate.
 * @param max Maximum allowed length before truncation.
 * @returns The original label when it already fits, or an ellipsis-truncated variant.
 */
export function shortLabel(value: string, max = 24) {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, Math.max(0, max - 3))}...`;
}

/**
 * Formats a raw toxicity endpoint identifier into a human-readable label.
 *
 * @param endpoint Raw endpoint identifier from backend payloads or config.
 * @returns A human-readable endpoint label with selected acronym normalization.
 */
export function formatEndpoint(endpoint: string) {
  const normalized = endpoint
    .replace(/^toxicity:/, '')
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const titled = normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  return titled
    .replace(/\bHerg\b/g, 'hERG')
    .replace(/\bNr\b/g, 'NR')
    .replace(/\bSr\b/g, 'SR')
    .replace(/\bI\b/g, 'I')
    .replace(/\bIi\b/g, 'II');
}

/**
 * Resolves the preferred display label for a compound summary record.
 *
 * @param compound Compound summary record.
 * @returns The compound name when available, otherwise the compound identifier.
 */
export function getCompoundLabel(compound: CompoundSummary) {
  return compound.compoundname || compound.cpd;
}
