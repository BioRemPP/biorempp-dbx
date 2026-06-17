/**
 * @packageDocumentation
 *
 * Metadata panel for compound detail pages, focused on identifiers, interoperability fields, and
 * provenance badges for the selected record.
 */
import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  CompoundMetadata,
  CompoundMetadataSource,
  CompoundSummary,
} from '@/features/compounds/types';
import type { ToxicityEndpoint } from '@/features/toxicity/types';

/**
 * Props accepted by the compound metadata panel.
 */
interface CompoundMetadataPanelProps {
  /** Normalized metadata payload returned by the compound metadata endpoint. */
  metadata: CompoundMetadata;
  /** Summary record associated with the selected compound. */
  summary: CompoundSummary;
  /** Toxicity rows already loaded for the selected compound. */
  toxicityRows: ToxicityEndpoint[];
}

function sourceBadgeClass(color: CompoundMetadataSource['color']) {
  switch (color) {
    case 'green':
      return 'bg-green-100 text-green-800';
    case 'blue':
      return 'bg-blue-100 text-blue-800';
    case 'purple':
      return 'bg-purple-100 text-purple-800';
    case 'orange':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function MetadataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[170px_minmax(0,1fr)] gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-sm text-gray-900 break-words">{value}</div>
    </div>
  );
}

/**
 * Renders identifier, cross-reference, and source provenance rows for a compound.
 *
 * @param props Metadata payload and related detail context for the selected compound.
 * @returns A compact metadata card with interoperability fields and source badges.
 */
export const CompoundMetadataPanel = memo(function CompoundMetadataPanel({
  metadata,
  summary: _summary,
  toxicityRows: _toxicityRows,
}: CompoundMetadataPanelProps) {
  const sources = useMemo(
    () => [...metadata.data_sources].sort((a, b) => a.name.localeCompare(b.name)),
    [metadata.data_sources]
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Identifiers & Interoperability</h3>
        <MetadataRow label="Compound ID" value={metadata.identifiers.cpd || '-'} />
        <MetadataRow label="Compound Name" value={metadata.identifiers.compound_name || '-'} />
        <MetadataRow label="Compound Class" value={metadata.identifiers.compound_class || '-'} />
        <MetadataRow label="KEGG Compound ID" value={metadata.cross_references.kegg_compound_id || '-'} />
        <MetadataRow
          label="ChEBI"
          value={metadata.cross_references.chebi || metadata.identifiers.chebi_id || '-'}
        />
        <MetadataRow label="SMILES" value={metadata.identifiers.smiles || '-'} />
        <MetadataRow
          label="Data Sources"
          value={
            <div className="flex flex-wrap gap-2">
              {sources.length > 0 ? (
                sources.map((source) => (
                  <span
                    key={source.name}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${sourceBadgeClass(source.color)}`}
                    title={source.role}
                  >
                    {source.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
});
