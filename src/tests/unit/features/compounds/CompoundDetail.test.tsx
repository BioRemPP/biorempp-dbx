import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompoundDetail } from '@features/compounds/pages/CompoundDetail';

const {
  mockGetAllCompoundToxicityProfile,
  mockGetCompoundById,
  mockGetCompoundGenes,
  mockGetCompoundMetadata,
  mockGetCompoundOverview,
  mockGetCompoundToxicityProfile,
} = vi.hoisted(() => ({
  mockGetAllCompoundToxicityProfile: vi.fn(),
  mockGetCompoundById: vi.fn(),
  mockGetCompoundGenes: vi.fn(),
  mockGetCompoundMetadata: vi.fn(),
  mockGetCompoundOverview: vi.fn(),
  mockGetCompoundToxicityProfile: vi.fn(),
}));

vi.mock('@features/compounds/api', () => ({
  getAllCompoundToxicityProfile: mockGetAllCompoundToxicityProfile,
  getCompoundById: mockGetCompoundById,
  getCompoundGenes: mockGetCompoundGenes,
  getCompoundMetadata: mockGetCompoundMetadata,
  getCompoundOverview: mockGetCompoundOverview,
  getCompoundToxicityProfile: mockGetCompoundToxicityProfile,
}));

vi.mock('@features/compounds/components/CompoundOverviewTab', () => ({
  CompoundOverviewTab: ({ overview }: { overview: { cpd: string } }) => <div>Compound Overview {overview.cpd}</div>,
}));

vi.mock('@features/compounds/components/CompoundMetadataPanel', () => ({
  CompoundMetadataPanel: ({ metadata }: { metadata: { identifiers: { cpd: string } } }) => (
    <div>Compound Metadata {metadata.identifiers.cpd}</div>
  ),
}));

describe('CompoundDetail', () => {
  beforeEach(() => {
    mockGetAllCompoundToxicityProfile.mockImplementation(async (cpd: string, pageSize = 100) => {
      const firstPage = await mockGetCompoundToxicityProfile(cpd, { page: 1, pageSize });

      if (firstPage.totalPages <= 1) {
        return firstPage.data;
      }

      const remainingPages = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
          mockGetCompoundToxicityProfile(cpd, { page: index + 2, pageSize })
        )
      );

      return [firstPage, ...remainingPages].flatMap((page) => page.data);
    });

    mockGetCompoundById.mockResolvedValue({
      cpd: 'C00014',
      compoundname: 'Ammonia',
      compoundclass: 'Nitrogen-containing',
      reference_ag: 'ATSDR; PSL',
      reference_count: 2,
      ko_count: 334,
      gene_count: 2,
      pathway_count: 25,
      toxicity_risk_mean: 0.22,
      high_risk_endpoint_count: 2,
      toxicity_scores: {},
      smiles: '[H]N([H])[H]',
      genes: [],
      pathways: [],
      updated_at: '2026-04-05',
    });

    mockGetCompoundGenes.mockImplementation((_cpd, pagination) => {
      if (pagination.page === 2) {
        return Promise.resolve({
          data: [
            {
              cpd: 'C00014',
              ko: 'K00002',
              genesymbol: 'catA',
              genename: 'Catechol 1,2-dioxygenase',
              enzyme_activity: 'dioxygenase',
              ec: '1.13.11.1',
              reaction_descriptions: [],
              reaction_descriptions_total: 0,
              supporting_rows: 1,
              updated_at: '2026-04-05',
            },
          ],
          page: 2,
          pageSize: 25,
          total: 2,
          totalPages: 2,
        });
      }

      return Promise.resolve({
        data: [
          {
            cpd: 'C00014',
            ko: 'K00001',
            genesymbol: 'nahA',
            genename: 'Naphthalene dioxygenase alpha subunit',
            enzyme_activity: 'dioxygenase',
            ec: '1.14.12.12',
            reaction_descriptions: [],
            reaction_descriptions_total: 0,
            supporting_rows: 1,
            updated_at: '2026-04-05',
          },
        ],
        page: 1,
        pageSize: 25,
        total: 2,
        totalPages: 2,
      });
    });

    mockGetCompoundOverview.mockResolvedValue({
      cpd: 'C00014',
      summary: {},
      limits: { top_ko: 10, top_pathways: 10 },
      ko_bar: [],
      pathways_top_kegg: [],
      pathways_top_hadeg: [],
      pathway_coverage: { sources: [], pathways: [], cells: [] },
      metric_basis: {
        ko_bar: 'count',
        pathways_top_kegg: 'count',
        pathways_top_hadeg: 'count',
        pathway_coverage_weight: 'weight',
      },
      toxicity_heatmap: [],
    } as any);

    mockGetCompoundMetadata.mockResolvedValue({
      identifiers: { cpd: 'C00014' },
      data_sources: [],
      functional_annotation: {},
      chemical_information: {},
      provenance: {},
      cross_references: {},
      data_quality: {},
    } as any);

    mockGetCompoundToxicityProfile.mockImplementation((_cpd, pagination) => {
      if (pagination.page === 2) {
        return Promise.resolve({
          data: [
            {
              cpd: 'C00014',
              compoundname: 'Ammonia',
              compoundclass: 'Nitrogen-containing',
              endpoint: 'developmental_toxicity',
              label: 'High',
              value: 0.91,
              updated_at: '2026-04-05',
            },
          ],
          page: 2,
          pageSize: pagination.pageSize,
          total: 3,
          totalPages: 2,
        });
      }

      return Promise.resolve({
        data: [
          {
            cpd: 'C00014',
            compoundname: 'Ammonia',
            compoundclass: 'Nitrogen-containing',
            endpoint: 'ames_toxicity',
            label: 'High',
            value: 0.81,
            updated_at: '2026-04-05',
          },
          {
            cpd: 'C00014',
            compoundname: 'Ammonia',
            compoundclass: 'Nitrogen-containing',
            endpoint: 'minnow_toxicity',
            label: 'Medium',
            value: 0.44,
            updated_at: '2026-04-05',
          },
        ],
        page: 1,
        pageSize: pagination.pageSize,
        total: 3,
        totalPages: 2,
      });
    });
  });

  it('loads header metrics on mount and reuses metadata in the metadata tab', async () => {
    const user = userEvent.setup();

    render(<CompoundDetail cpd="C00014" onBack={vi.fn()} onGeneSelect={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Ammonia' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'KEGG structure for C00014' })).toHaveAttribute(
      'src',
      '/api/compounds/C00014/kegg-image'
    );
    expect(await screen.findByText('Quantitative Overview')).toBeInTheDocument();
    expect(screen.getByText('KO Count')).toBeInTheDocument();
    expect(screen.getByText('334')).toBeInTheDocument();
    const toxicityEndpointsCard = screen.getByText('Toxicity Endpoints').closest('div');
    const toxicityLabelsCard = screen.getByText('Toxicity Labels').closest('div');

    expect(toxicityEndpointsCard).not.toBeNull();
    expect(toxicityLabelsCard).not.toBeNull();
    expect(within(toxicityEndpointsCard as HTMLElement).getByText('3')).toBeInTheDocument();
    expect(within(toxicityLabelsCard as HTMLElement).getByText('2')).toBeInTheDocument();
    expect(await screen.findByText('Compound Overview C00014')).toBeInTheDocument();
    expect(mockGetCompoundOverview).toHaveBeenCalledTimes(1);
    expect(mockGetCompoundMetadata).toHaveBeenCalledTimes(1);
    expect(mockGetCompoundToxicityProfile).toHaveBeenNthCalledWith(1, 'C00014', { page: 1, pageSize: 100 });
    expect(mockGetCompoundToxicityProfile).toHaveBeenNthCalledWith(2, 'C00014', { page: 2, pageSize: 100 });

    await user.click(screen.getByRole('tab', { name: 'Metadata' }));

    expect(await screen.findByText('Compound Metadata C00014')).toBeInTheDocument();
    expect(mockGetCompoundMetadata).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    await user.click(screen.getByRole('tab', { name: 'Metadata' }));

    expect(mockGetCompoundOverview).toHaveBeenCalledTimes(1);
    expect(mockGetCompoundMetadata).toHaveBeenCalledTimes(1);
  });

  it('paginates associated genes, opens gene detail links, and handles back navigation', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onGeneSelect = vi.fn();

    render(<CompoundDetail cpd="C00014" onBack={onBack} onGeneSelect={onGeneSelect} />);

    await user.click(await screen.findByRole('tab', { name: 'Associated Genes (2)' }));
    expect(await screen.findByText('nahA')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'K00001' }));
    expect(onGeneSelect).toHaveBeenNthCalledWith(1, 'K00001');

    await user.click(screen.getByRole('button', { name: 'nahA' }));
    expect(onGeneSelect).toHaveBeenNthCalledWith(2, 'K00001');

    await user.click(screen.getByText('Naphthalene dioxygenase alpha subunit'));
    expect(onGeneSelect).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(mockGetCompoundGenes).toHaveBeenLastCalledWith('C00014', { page: 2, pageSize: 25 });
    });

    expect(await screen.findByText('catA')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'K00002' }));
    expect(onGeneSelect).toHaveBeenNthCalledWith(3, 'K00002');

    await user.click(screen.getByRole('button', { name: 'Back to Compounds' }));
    expect(onBack).toHaveBeenCalled();
  });
});
