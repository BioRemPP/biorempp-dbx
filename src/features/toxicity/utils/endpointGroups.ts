/**
 * @packageDocumentation
 *
 * Utilities and group definitions used to organize toxicity endpoints into stable UI facets.
 */
import type { ToxicityHeatmapDatum } from '@/features/toxicity/types';
import { formatEndpoint, shortLabel } from '@shared/visualization/utils/visualizationData';
/**
 * Stable group keys used to classify toxicity endpoints in explorer and detail views.
 */
export type ToxicityEndpointGroupKey =
  | 'ecotoxicity'
  | 'genotoxicity_carcinogenicity'
  | 'nuclear_receptors'
  | 'stress_response'
  | 'organ_irritation'
  | 'other';

/**
 * Endpoint row normalized for grouped toxicity facet rendering.
 */
export interface ToxicityFacetEndpoint {
  /** Raw endpoint identifier preserved from the backend payload. */
  endpoint: string;
  /** Short label used in compact facet layouts. */
  shortLabel: string;
  /** Human-readable endpoint label derived for display. */
  fullLabel: string;
  /** Numeric toxicity prediction value for the endpoint. */
  predictionValue: number | null;
  /** Risk bucket assigned to the endpoint value. */
  riskBucket: ToxicityHeatmapDatum['risk_bucket'];
  /** Optional backend-provided label associated with the risk bucket. */
  riskLabel: string | null;
}

/**
 * Grouped toxicity facet returned to views that render endpoint sections.
 */
export interface ToxicityFacet {
  /** Stable group key used by the UI and navigation state. */
  key: ToxicityEndpointGroupKey;
  /** Human-readable group title. */
  title: string;
  /** Ordered endpoint identifiers contained in the facet. */
  orderedEndpoints: string[];
  /** Numeric endpoint values keyed by endpoint identifier. */
  prediction: Record<string, number | null>;
  /** Risk buckets keyed by endpoint identifier. */
  risk: Record<string, ToxicityHeatmapDatum['risk_bucket']>;
  /** Fully normalized endpoint rows for the facet. */
  endpoints: ToxicityFacetEndpoint[];
}

/**
 * Static definition describing which endpoints belong to a toxicity group.
 */
export interface ToxicityEndpointGroupDefinition {
  /** Stable group key. */
  key: ToxicityEndpointGroupKey;
  /** Human-readable group title. */
  title: string;
  /** Ordered endpoint identifiers that belong to the group. */
  endpoints: string[];
}

const GROUP_DEFINITIONS: ToxicityEndpointGroupDefinition[] = [
  {
    key: 'ecotoxicity',
    title: 'Ecotoxicity',
    endpoints: ['avian', 'crustacean', 'fathead_minnow', 'honey_bee', 't._pyriformis', 'biodegradation'],
  },
  {
    key: 'genotoxicity_carcinogenicity',
    title: 'Genotoxicity & Carcinogenicity',
    endpoints: ['genomic_ames_mutagenesis', 'genomic_carcinogenesis', 'genomic_micronucleus'],
  },
  {
    key: 'nuclear_receptors',
    title: 'Nuclear Receptors (NR)',
    endpoints: [
      'nr_ahr',
      'nr_ar',
      'nr_ar_lbd',
      'nr_aromatase',
      'nr_er',
      'nr_er_lbd',
      'nr_gr',
      'nr_ppar_gamma',
      'nr_tr',
    ],
  },
  {
    key: 'stress_response',
    title: 'Stress Response (SR)',
    endpoints: ['sr_are', 'sr_atad5', 'sr_hse', 'sr_mmp', 'sr_p53'],
  },
  {
    key: 'organ_irritation',
    title: 'Organ / Irritation',
    endpoints: [
      'eye_corrosion',
      'eye_irritation',
      'skin_sensitisation',
      'liver_injury_i',
      'liver_injury_ii',
      'respiratory_disease',
      'herg_i_inhibitor',
      'herg_ii_inhibitor',
    ],
  },
];

const SHORT_LABELS: Record<string, string> = {
  avian: 'Avian',
  crustacean: 'Crustacean',
  fathead_minnow: 'Fathead',
  honey_bee: 'Honey Bee',
  't._pyriformis': 'T. Pyrif.',
  biodegradation: 'Biodeg.',
  genomic_ames_mutagenesis: 'Ames',
  genomic_carcinogenesis: 'Carcino.',
  genomic_micronucleus: 'Micronuc.',
  nr_ahr: 'NR AhR',
  nr_ar: 'NR AR',
  nr_ar_lbd: 'NR AR LBD',
  nr_aromatase: 'NR Arom.',
  nr_er: 'NR ER',
  nr_er_lbd: 'NR ER LBD',
  nr_gr: 'NR GR',
  nr_ppar_gamma: 'NR PPARg',
  nr_tr: 'NR TR',
  sr_are: 'SR ARE',
  sr_atad5: 'SR ATAD5',
  sr_hse: 'SR HSE',
  sr_mmp: 'SR MMP',
  sr_p53: 'SR P53',
  eye_corrosion: 'Eye Cor.',
  eye_irritation: 'Eye Irrit.',
  skin_sensitisation: 'Skin Sens.',
  liver_injury_i: 'Liver I',
  liver_injury_ii: 'Liver II',
  respiratory_disease: 'Resp. Dis.',
  herg_i_inhibitor: 'hERG I',
  herg_ii_inhibitor: 'hERG II',
};

const endpointToGroup = new Map<string, ToxicityEndpointGroupKey>();
const endpointOrder = new Map<string, number>();
for (const group of GROUP_DEFINITIONS) {
  for (let i = 0; i < group.endpoints.length; i += 1) {
    const endpoint = group.endpoints[i];
    endpointToGroup.set(endpoint, group.key);
    endpointOrder.set(endpoint, i);
  }
}

/**
 * Resolves the display title for a toxicity endpoint group key.
 *
 * @param key Stable toxicity group key.
 * @returns The configured human-readable title, or `Other` for unknown keys.
 */
export function getToxicityEndpointGroupTitle(key: ToxicityEndpointGroupKey) {
  if (key === 'other') {
    return 'Other';
  }
  return GROUP_DEFINITIONS.find((group) => group.key === key)?.title || 'Other';
}

/**
 * Resolves the configured group key for a toxicity endpoint.
 *
 * @param endpoint Raw toxicity endpoint identifier.
 * @returns The configured group key, or `other` when the endpoint is not part of a named group.
 */
export function getToxicityEndpointGroupKey(endpoint: string): ToxicityEndpointGroupKey {
  return endpointToGroup.get(endpoint) ?? 'other';
}

/**
 * Public snapshot of the configured endpoint groups in display order.
 *
 * @remarks
 * Each group's `endpoints` array is cloned from the internal definitions to avoid leaking mutable references.
 */
export const TOXICITY_ENDPOINT_GROUPS: ToxicityEndpointGroupDefinition[] = [
  ...GROUP_DEFINITIONS.map((group) => ({
    ...group,
    endpoints: [...group.endpoints],
  })),
  {
    key: 'other',
    title: 'Other',
    endpoints: [],
  },
];

function getShortEndpointLabel(endpoint: string) {
  return SHORT_LABELS[endpoint] || shortLabel(formatEndpoint(endpoint), 10);
}

function endpointSort(a: ToxicityFacetEndpoint, b: ToxicityFacetEndpoint) {
  const orderA = endpointOrder.get(a.endpoint);
  const orderB = endpointOrder.get(b.endpoint);

  if (orderA !== undefined && orderB !== undefined) {
    return orderA - orderB;
  }
  if (orderA !== undefined) {
    return -1;
  }
  if (orderB !== undefined) {
    return 1;
  }
  return a.fullLabel.localeCompare(b.fullLabel);
}

/**
 * Groups heatmap rows into ordered toxicity facets for UI consumption.
 *
 * @param rows Endpoint-level toxicity rows returned by a detail or overview payload.
 * @returns Ordered facet sections containing normalized endpoint labels, values, and risk metadata.
 *
 * @remarks
 * Unknown endpoints are assigned to the `other` facet. Known endpoints preserve the order declared in
 * `TOXICITY_ENDPOINT_GROUPS`, while unknown endpoints fall back to alphabetical sorting by formatted label.
 */
export function toToxicityFacets(rows: ToxicityHeatmapDatum[]): ToxicityFacet[] {
  const grouped = new Map<ToxicityEndpointGroupKey, ToxicityFacetEndpoint[]>();

  for (const row of rows) {
    const groupKey = endpointToGroup.get(row.endpoint) ?? 'other';
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey)?.push({
      endpoint: row.endpoint,
      shortLabel: getShortEndpointLabel(row.endpoint),
      fullLabel: formatEndpoint(row.endpoint),
      predictionValue: row.value,
      riskBucket: row.risk_bucket,
      riskLabel: row.label,
    });
  }

  const orderedKeys: ToxicityEndpointGroupKey[] = [
    'ecotoxicity',
    'genotoxicity_carcinogenicity',
    'nuclear_receptors',
    'stress_response',
    'organ_irritation',
    'other',
  ];

  return orderedKeys
    .filter((key) => grouped.has(key))
    .map((key) => {
      const endpoints = (grouped.get(key) || []).sort(endpointSort);
      const orderedEndpoints = endpoints.map((endpoint) => endpoint.endpoint);
      const prediction: Record<string, number | null> = {};
      const risk: Record<string, ToxicityHeatmapDatum['risk_bucket']> = {};

      for (const endpoint of endpoints) {
        prediction[endpoint.endpoint] = endpoint.predictionValue;
        risk[endpoint.endpoint] = endpoint.riskBucket;
      }

      return {
        key,
        title: getToxicityEndpointGroupTitle(key),
        orderedEndpoints,
        prediction,
        risk,
        endpoints,
      };
    });
}
