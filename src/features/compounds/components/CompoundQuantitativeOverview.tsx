/**
 * @packageDocumentation
 *
 * Quantitative metric summary for compound detail views, combining summary counts, metadata
 * coverage signals, and toxicity endpoint totals.
 */
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CompoundMetadata, CompoundSummary } from '@/features/compounds/types';
import type { ToxicityEndpoint } from '@/features/toxicity/types';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the compound quantitative overview panel.
 */
interface CompoundQuantitativeOverviewProps {
  /** Compound summary counts loaded with the detail header context. */
  summary: CompoundSummary;
  /** Optional metadata payload used to derive functional annotation and coverage metrics. */
  metadata: CompoundMetadata | null;
  /** Endpoint-level toxicity rows used to derive toxicity counts and label coverage. */
  toxicityRows: ToxicityEndpoint[];
  /** Optional className forwarded to the outer container. */
  className?: string;
  /** Visual layout variant used by header cards and standalone panels. */
  variant?: 'header' | 'panel';
}

function CompactMetricCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex h-full min-h-[5.5rem] flex-col justify-between rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-[1.35rem] font-semibold leading-none text-slate-950">{value}</p>
    </div>
  );
}

function PanelMetricCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

/**
 * Renders a compact metric grid summarizing compound coverage across annotations and toxicity.
 *
 * @param props Summary, metadata, toxicity rows, and optional layout controls.
 * @returns A metric card grid rendered in either header or panel presentation mode.
 *
 * @remarks
 * Metrics derived from metadata fall back to `-` until metadata is available. Toxicity label
 * counts are deduplicated from the loaded endpoint rows rather than trusting a precomputed total.
 */
export function CompoundQuantitativeOverview({
  summary,
  metadata,
  toxicityRows,
  className,
  variant = 'header',
}: CompoundQuantitativeOverviewProps) {
  const toxicityLabelCount = useMemo(
    () => new Set(toxicityRows.map((row) => row.label).filter(Boolean)).size,
    [toxicityRows]
  );

  const metrics = [
    { label: 'KO Count', value: summary.ko_count },
    { label: 'Gene Count', value: summary.gene_count },
    { label: 'Pathway Annotations', value: summary.pathway_count },
    { label: 'EC Count', value: metadata?.functional_annotation?.ec_numbers?.length ?? '-' },
    { label: 'Enzyme Activity Count', value: metadata?.functional_annotation?.enzyme_activity?.length ?? '-' },
    { label: 'HADEG Pathways', value: metadata?.functional_annotation?.pathways_hadeg?.length ?? '-' },
    { label: 'KEGG Pathways', value: metadata?.functional_annotation?.pathways_kegg?.length ?? '-' },
    {
      label: 'Compound Pathway Class',
      value: metadata?.functional_annotation?.compound_pathway_class?.length ?? '-',
    },
    { label: 'Reaction Count', value: metadata?.functional_annotation?.reaction_count ?? '-' },
    { label: 'Toxicity Endpoints', value: toxicityRows.length },
    { label: 'Toxicity Labels', value: toxicityLabelCount },
    { label: 'Cross-Ref Coverage', value: metadata?.data_quality?.cross_references_coverage ?? '-' },
  ];

  if (variant === 'panel') {
    return (
      <div className={cn('rounded-lg border border-gray-200 bg-white p-4', className)}>
        <h3 className="mb-3 text-base font-semibold text-gray-900">Quantitative Overview</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <PanelMetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-w-0 h-full w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Quantitative Overview</p>
          <p className="mt-1.5 text-sm text-slate-600">Compact metadata coverage for the selected compound.</p>
        </div>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <CompactMetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>
    </div>
  );
}
