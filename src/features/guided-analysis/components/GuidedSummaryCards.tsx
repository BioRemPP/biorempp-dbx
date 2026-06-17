/**
 * @packageDocumentation
 *
 * Compact summary-card renderer for guided analysis execution results.
 */
import type { GuidedSummaryCardResult } from '@/features/guided-analysis/types';
import { formatGuidedSummaryCardValue } from '@/features/guided-analysis/presentation';

/**
 * Props accepted by the guided summary cards component.
 */
interface GuidedSummaryCardsProps {
  /** Resolved summary card results returned by the current guided execution. */
  cards: GuidedSummaryCardResult[];
  /** Active guided query identifier, used for view-specific presentation tweaks. */
  queryId?: string;
}

function formatValue(value: GuidedSummaryCardResult['value']) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return value;
}

/**
 * Renders compact summary cards for the current guided execution.
 *
 * @param props Resolved summary cards returned by the backend.
 * @returns A responsive summary-card grid, or `null` when no cards are present.
 */
export function GuidedSummaryCards({ cards, queryId }: GuidedSummaryCardsProps) {
  if (!cards.length) {
    return null;
  }

  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
      {cards.map((card) => {
        const resolvedValue = queryId ? formatGuidedSummaryCardValue(queryId, card) : card.value;

        return (
        <div key={card.id} className="rounded border border-gray-200 px-3 py-2 min-h-[84px] flex flex-col justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
          <p className="text-lg font-semibold text-gray-900">{formatValue(resolvedValue)}</p>
          {card.hint ? <p className="text-xs text-gray-500 mt-1">{card.hint}</p> : null}
        </div>
        );
      })}
    </div>
  );
}
