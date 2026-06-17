import type { GuidedSummaryCardResult } from '@/features/guided-analysis/types';

const METRIC_LABEL_OVERRIDES: Record<string, string> = {
  ko_count: 'KO Count',
  gene_count: 'Gene Count',
  compound_count: 'Compound Count',
  pathway_count: 'Pathway Count',
  reference_count: 'Reference Count',
  toxicity_risk_mean: 'Mean Toxicity Risk',
};

function toTitleCaseLabel(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((token) => {
      if (token.toUpperCase() === 'KO') {
        return 'KO';
      }

      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(' ');
}

function formatThresholdLabel(value: string) {
  const match = /^x\(P75\)=([^,]+), y\(P75\)=(.+)$/.exec(value);
  if (!match) {
    return value;
  }

  return `Potential P75: ${match[1]} | Risk P75: ${match[2]}`;
}

export function getGuidedMethodsButtonLabel() {
  return 'How it works';
}

export function getGuidedRecipesButtonLabel() {
  return 'Query Logic';
}

export function formatGuidedSummaryCardValue(
  _queryId: string,
  card: GuidedSummaryCardResult
): GuidedSummaryCardResult['value'] {
  if (card.id === 'ranked_metric' && typeof card.value === 'string') {
    return METRIC_LABEL_OVERRIDES[card.value] ?? toTitleCaseLabel(card.value);
  }

  if (card.id === 'p75_thresholds' && typeof card.value === 'string') {
    return formatThresholdLabel(card.value);
  }

  return card.value;
}
