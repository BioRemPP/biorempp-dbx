/**
 * @packageDocumentation
 *
 * Gene detail page that coordinates overview, associated compounds, and metadata panels for a
 * selected KEGG Ortholog record.
 */
import { useEffect, useState } from 'react';
import {
  getGeneAssociatedCompounds,
  getGeneByKo,
  getGeneDetailOverview,
  getGeneMetadata,
} from '@/features/genes/api';
import type {
  GeneAssociatedCompoundRow,
  GeneDetailSummary,
  GeneMetadata,
} from '@/features/genes/types';
import { GeneMetadataPanel } from '@/features/genes/components/GeneMetadataPanel';
import { GeneOverviewTab } from '@/features/genes/components/GeneOverviewTab';
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
 * Props accepted by the gene detail page.
 */
interface GeneDetailProps {
  /** KO identifier resolved from the current route or explorer selection. */
  ko: string;
  /** Callback used to return from the detail view to the gene explorer. */
  onBack: () => void;
  /** Callback used by the associated compounds table to open compound detail views. */
  onCompoundSelect: (cpd: string) => void;
}

type GeneTab = 'overview' | 'compounds' | 'metadata';

/**
 * Renders the detail workspace for a selected gene / KO record.
 *
 * @param props KO identifier plus navigation callbacks for gene and compound drill-down.
 * @returns A detail card with lazy overview and metadata tabs plus paginated compound links.
 *
 * @remarks
 * The summary loads immediately when the KO changes. Overview and metadata load lazily by tab,
 * while associated compounds maintain independent pagination state for the current gene.
 */
export function GeneDetail({ ko, onBack, onCompoundSelect }: GeneDetailProps) {
  const [summary, setSummary] = useState<GeneDetailSummary | null>(null);
  const [compounds, setCompounds] = useState<GeneAssociatedCompoundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compoundsLoading, setCompoundsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<GeneTab>('overview');
  const [compoundPage, setCompoundPage] = useState(1);
  const [compoundTotalPages, setCompoundTotalPages] = useState(1);
  const compoundPageSize = 25;

  const overviewState = useLazyTabData({
    isActive: activeTab === 'overview',
    fetcher: () => getGeneDetailOverview(ko),
    resetKeys: [ko],
  });

  const metadataState = useLazyTabData<GeneMetadata>({
    isActive: activeTab === 'metadata',
    fetcher: () => getGeneMetadata(ko),
    resetKeys: [ko],
  });

  useEffect(() => {
    setActiveTab('overview');
    setCompoundPage(1);
  }, [ko]);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const response = await getGeneByKo(ko);
        if (cancelled) {
          return;
        }
        setSummary(response);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setSummary(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load gene details.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [ko]);

  useEffect(() => {
    let cancelled = false;

    async function loadCompoundsPage() {
      setCompoundsLoading(true);
      try {
        const response = await getGeneAssociatedCompounds(ko, { page: compoundPage, pageSize: compoundPageSize });
        if (cancelled) {
          return;
        }
        setCompounds(response.data);
        setCompoundTotalPages(response.totalPages);
      } catch {
        if (cancelled) {
          return;
        }
        setCompounds([]);
        setCompoundTotalPages(1);
      } finally {
        if (!cancelled) {
          setCompoundsLoading(false);
        }
      }
    }

    loadCompoundsPage();

    return () => {
      cancelled = true;
    };
  }, [compoundPage, ko]);

  if (loading) {
    return (
      <DetailStatusPanel
        status="loading"
        title="Loading gene details"
        message="Please wait while the gene detail view is prepared."
      />
    );
  }

  if (error) {
    return (
      <DetailStatusPanel
        status="error"
        title="Unable to load gene details."
        message={error}
        onBack={onBack}
        backLabel="Back to Genes"
      />
    );
  }

  if (!summary) {
    return (
      <DetailStatusPanel
        status="not-found"
        title="Gene not found."
        message="The selected gene could not be loaded."
        onBack={onBack}
        backLabel="Back to Genes"
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <DetailHeader title={summary.genesymbol || summary.ko} subtitle={summary.ko} onBack={onBack} backLabel="Back to Genes" />



      <EntityTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'compounds', label: 'Associated Compounds', count: summary.compound_count },
          { value: 'metadata', label: 'Metadata' },
        ]}
      >
        <EntityTabsContent value="overview">
          <LazyTabPanel
            state={overviewState}
            loadingTitle="Loading overview"
            loadingMessage="Please wait while the gene overview is prepared."
            emptyTitle="Overview unavailable"
            emptyMessage="Overview data unavailable for this gene."
            errorTitle="Unable to load overview."
          >
            {(overview) => <GeneOverviewTab overview={overview} />}
          </LazyTabPanel>
        </EntityTabsContent>

        <EntityTabsContent value="compounds">
          <EntityTableSection
            rows={compounds}
            loading={compoundsLoading}
            getRowKey={(compound) => compound.cpd}
            emptyTitle="No compounds associated"
            emptyMessage="No compounds associated with this gene."
            onRowClick={(compound) => onCompoundSelect(compound.cpd)}
            pagination={{
              currentPage: compoundPage,
              totalPages: compoundTotalPages,
              onPageChange: setCompoundPage,
            }}
            columns={[
              {
                key: 'cpd',
                header: 'Compound ID',
                cellClassName: 'font-medium text-blue-700',
                render: (compound) => compound.cpd,
              },
              {
                key: 'compoundname',
                header: 'Name',
                render: (compound) => compound.compoundname || '-',
              },
              {
                key: 'compoundclass',
                header: 'Class',
                render: (compound) => compound.compoundclass || '-',
              },
              {
                key: 'ko_count',
                header: 'KO Count',
                render: (compound) => compound.ko_count,
              },
              {
                key: 'gene_count',
                header: 'Gene Count',
                render: (compound) => compound.gene_count,
              },
              {
                key: 'pathway_count',
                header: 'Pathway Annotations',
                render: (compound) => compound.pathway_count,
              },
              {
                key: 'toxicity_risk_mean',
                header: 'Toxicity Risk Mean',
                render: (compound) =>
                  compound.toxicity_risk_mean == null ? '-' : compound.toxicity_risk_mean.toFixed(2),
              },
              {
                key: 'high_risk_endpoint_count',
                header: 'High Risk Endpoints',
                render: (compound) => compound.high_risk_endpoint_count,
              },
              {
                key: 'reference_count',
                header: 'References',
                render: (compound) => compound.reference_count,
              },
            ]}
          />
        </EntityTabsContent>

        <EntityTabsContent value="metadata">
          <LazyTabPanel
            state={metadataState}
            loadingTitle="Loading metadata"
            loadingMessage="Please wait while the gene metadata is prepared."
            emptyTitle="Metadata unavailable"
            emptyMessage="Metadata unavailable for this gene."
            errorTitle="Unable to load metadata."
          >
            {(metadata) => (
              <MetadataPanelShell
                title="Gene metadata"
                description="Identifiers, interoperability and quantitative overview for the selected gene."
              >
                <GeneMetadataPanel metadata={metadata} />
              </MetadataPanelShell>
            )}
          </LazyTabPanel>
        </EntityTabsContent>
      </EntityTabs>
    </Card>
  );
}
