/**
 * @packageDocumentation
 *
 * Compound detail page that coordinates summary, overview, metadata, toxicity, and gene
 * association panels for a selected compound identifier.
 */
import { useEffect, useState } from 'react';
import {
  getAllCompoundToxicityProfile,
  getCompoundById,
  getCompoundGenes,
  getCompoundMetadata,
  getCompoundOverview,
} from '@/features/compounds/api';
import type {
  CompoundGeneCardRow,
  CompoundMetadata,
  CompoundOverviewResponse,
  CompoundSummary,
} from '@/features/compounds/types';
import type { ToxicityEndpoint } from '@/features/toxicity/types';
import { CompoundMetadataPanel } from '@/features/compounds/components/CompoundMetadataPanel';
import { CompoundOverviewTab } from '@/features/compounds/components/CompoundOverviewTab';
import { CompoundKeggStructureThumbnail } from '@/features/compounds/components/CompoundKeggStructureThumbnail';
import { CompoundQuantitativeOverview } from '@/features/compounds/components/CompoundQuantitativeOverview';
import { useLazyTabData } from '@/shared/hooks/useLazyTabData';
import {
  Card,
  DetailHeader,
  DetailStatusPanel,
  EntityTableSection,
  EntityTabs,
  EntityTabsContent,
  LazyTabPanel,
  MetadataPanelShell,
} from '@/shared/ui';

/**
 * Props accepted by the compound detail page.
 */
interface CompoundDetailProps {
  /** Compound identifier resolved from the current route or selection state. */
  cpd: string;
  /** Callback used by detail status panels and headers to return to the explorer. */
  onBack: () => void;
  /** Callback used by associated gene links to open gene detail views. */
  onGeneSelect: (ko: string) => void;
}

type CompoundTab = 'overview' | 'genes' | 'metadata';

/**
 * Renders the compound detail workspace for one selected compound.
 *
 * @param props Compound identifier and back-navigation callback.
 * @returns A detail card with lazy overview content, paginated genes, and metadata panels.
 *
 * @remarks
 * Summary and toxicity context load immediately when the compound changes. The overview tab loads
 * lazily on demand, and the gene tab maintains its own pagination state per selected compound.
 */
export function CompoundDetail({ cpd, onBack, onGeneSelect }: CompoundDetailProps) {
  const [summary, setSummary] = useState<CompoundSummary | null>(null);
  const [metadata, setMetadata] = useState<CompoundMetadata | null>(null);
  const [toxicityRows, setToxicityRows] = useState<ToxicityEndpoint[]>([]);
  const [geneRows, setGeneRows] = useState<CompoundGeneCardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genesLoading, setGenesLoading] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CompoundTab>('overview');
  const [genePage, setGenePage] = useState(1);
  const [geneTotalPages, setGeneTotalPages] = useState(1);
  const genePageSize = 25;

  const overviewState = useLazyTabData<CompoundOverviewResponse>({
    isActive: activeTab === 'overview',
    fetcher: () => getCompoundOverview(cpd, { top_ko: 10, top_pathways: 10 }),
    resetKeys: [cpd],
  });

  function hasNavigableKo(ko: string | null | undefined) {
    return typeof ko === 'string' && ko.trim() !== '';
  }

  function renderGeneNavigationButton(label: string, ko: string, title: string) {
    return (
      <button
        type="button"
        onClick={() => onGeneSelect(ko)}
        title={title}
        className="text-accent underline-offset-4 transition-colors hover:text-blue-700 hover:underline"
      >
        {label}
      </button>
    );
  }

  useEffect(() => {
    setGenePage(1);
    setActiveTab('overview');
  }, [cpd]);

  useEffect(() => {
    let cancelled = false;

    async function loadCompoundContext() {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, toxicityRowsData] = await Promise.all([
          getCompoundById(cpd),
          getAllCompoundToxicityProfile(cpd),
        ]);

        if (cancelled) {
          return;
        }

        setSummary(summaryData);
        setToxicityRows(toxicityRowsData);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setSummary(null);
        setToxicityRows([]);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load compound details.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCompoundContext();

    return () => {
      cancelled = true;
    };
  }, [cpd]);

  useEffect(() => {
    let cancelled = false;

    async function loadMetadata() {
      setMetadataLoading(true);
      setMetadataError(null);
      try {
        const metadataData = await getCompoundMetadata(cpd);
        if (cancelled) {
          return;
        }
        setMetadata(metadataData);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setMetadata(null);
        setMetadataError(loadError instanceof Error ? loadError.message : 'Unable to load compound metadata.');
      } finally {
        if (!cancelled) {
          setMetadataLoading(false);
        }
      }
    }

    loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [cpd]);

  useEffect(() => {
    let cancelled = false;

    async function loadGenesPage() {
      setGenesLoading(true);
      try {
        const genesData = await getCompoundGenes(cpd, { page: genePage, pageSize: genePageSize });
        if (cancelled) {
          return;
        }
        setGeneRows(genesData.data);
        setGeneTotalPages(genesData.totalPages);
      } catch {
        if (cancelled) {
          return;
        }
        setGeneRows([]);
        setGeneTotalPages(1);
      } finally {
        if (!cancelled) {
          setGenesLoading(false);
        }
      }
    }

    loadGenesPage();

    return () => {
      cancelled = true;
    };
  }, [cpd, genePage]);

  if (loading) {
    return (
      <DetailStatusPanel
        status="loading"
        title="Loading compound details"
        message="Please wait while the compound detail view is prepared."
      />
    );
  }

  if (error) {
    return (
      <DetailStatusPanel
        status="error"
        title="Unable to load compound details."
        message={error}
        onBack={onBack}
        backLabel="Back to Compounds"
      />
    );
  }

  if (!summary) {
    return (
      <DetailStatusPanel
        status="not-found"
        title="Compound not found."
        message="The selected compound could not be loaded."
        onBack={onBack}
        backLabel="Back to Compounds"
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <DetailHeader
        title={summary.compoundname || summary.cpd}
        onBack={onBack}
        backLabel="Back to Compounds"
        content={
          <div className="flex min-w-0 w-full flex-col gap-5">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-[2rem]">
                {summary.compoundname || summary.cpd}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{summary.cpd}</p>
            </div>
            <div className="grid min-w-0 w-full items-stretch gap-4 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-5">
              <CompoundKeggStructureThumbnail cpd={summary.cpd} className="w-full" />
              <div className="min-w-0 w-full">
                <CompoundQuantitativeOverview
                  summary={summary}
                  metadata={metadata}
                  toxicityRows={toxicityRows}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        }
      />

      <EntityTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'genes', label: 'Associated Genes', count: summary.gene_count },
          { value: 'metadata', label: 'Metadata' },
        ]}
      >
        <EntityTabsContent value="overview">
          <LazyTabPanel
            state={overviewState}
            loadingTitle="Loading overview"
            loadingMessage="Please wait while the compound overview is prepared."
            emptyTitle="Overview unavailable"
            emptyMessage="No overview data available."
            errorTitle="Unable to load overview."
          >
            {(overview) => <CompoundOverviewTab overview={overview} />}
          </LazyTabPanel>
        </EntityTabsContent>

        <EntityTabsContent value="genes">
          <EntityTableSection
            rows={geneRows}
            loading={genesLoading}
            getRowKey={(detail, index) => `${detail.ko}-${detail.genesymbol}-${index}`}
            emptyTitle="No genes available"
            emptyMessage="No gene data available for this compound."
            pagination={{
              currentPage: genePage,
              totalPages: geneTotalPages,
              onPageChange: setGenePage,
            }}
            columns={[
              {
                key: 'ko',
                header: 'KO',
                cellClassName: 'font-mono',
                render: (detail) =>
                  hasNavigableKo(detail.ko)
                    ? renderGeneNavigationButton(detail.ko, detail.ko, `Open gene detail for ${detail.ko}`)
                    : '-',
              },
              {
                key: 'genesymbol',
                header: 'Gene Symbol',
                cellClassName: 'font-medium text-slate-900',
                render: (detail) =>
                  detail.genesymbol && hasNavigableKo(detail.ko)
                    ? renderGeneNavigationButton(
                        detail.genesymbol,
                        detail.ko,
                        `Open gene detail for ${detail.genesymbol}`
                      )
                    : detail.genesymbol || '-',
              },
              {
                key: 'genename',
                header: 'Gene Name',
                render: (detail) => detail.genename || '-',
              },
              {
                key: 'enzyme_activity',
                header: 'Enzyme Activity',
                render: (detail) => detail.enzyme_activity || '-',
              },
              {
                key: 'ec',
                header: 'EC',
                cellClassName: 'font-mono',
                render: (detail) => detail.ec || '-',
              },
            ]}
          />
        </EntityTabsContent>

        <EntityTabsContent value="metadata">
          {metadataLoading && !metadata ? (
            <DetailStatusPanel
              status="loading"
              title="Loading metadata"
              message="Please wait while the compound metadata is prepared."
            />
          ) : metadataError && !metadata ? (
            <DetailStatusPanel
              status="error"
              title="Unable to load metadata."
              message={metadataError}
            />
          ) : metadata ? (
            <MetadataPanelShell
              title="Compound metadata"
              description="Identifiers, provenance and cross-reference coverage for the selected compound."
            >
              <CompoundMetadataPanel metadata={metadata} summary={summary} toxicityRows={toxicityRows} />
            </MetadataPanelShell>
          ) : (
            <DetailStatusPanel
              status="not-found"
              title="Metadata unavailable"
              message="Metadata unavailable for this compound."
            />
          )}
        </EntityTabsContent>
      </EntityTabs>
    </Card>
  );
}
