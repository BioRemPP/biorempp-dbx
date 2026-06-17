import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompoundExplorer } from '@features/compounds/pages/CompoundExplorer';

const {
  mockGetCompounds,
  mockGetPathwayOptions,
  mockGetUniqueCompoundClasses,
  mockGetUniqueGenes,
  mockGetUniqueReferenceAGs,
} = vi.hoisted(() => ({
  mockGetCompounds: vi.fn(),
  mockGetPathwayOptions: vi.fn(),
  mockGetUniqueCompoundClasses: vi.fn(),
  mockGetUniqueGenes: vi.fn(),
  mockGetUniqueReferenceAGs: vi.fn(),
}));

vi.mock('@/features/compounds/api', () => ({
  getCompounds: mockGetCompounds,
}));

vi.mock('@/features/meta/api', () => ({
  getPathwayOptions: mockGetPathwayOptions,
  getUniqueCompoundClasses: mockGetUniqueCompoundClasses,
  getUniqueGenes: mockGetUniqueGenes,
  getUniqueReferenceAGs: mockGetUniqueReferenceAGs,
}));

describe('CompoundExplorer', () => {
  beforeEach(() => {
    mockGetCompounds.mockResolvedValue({
      data: [
        {
          cpd: 'C00014',
          compoundname: 'Ammonia',
          compoundclass: 'Nitrogen-containing',
          gene_count: 327,
          genes: [],
          high_risk_endpoint_count: 2,
          ko_count: 334,
          pathway_count: 25,
          pathways: [],
          reference_ag: 'ATSDR; PSL',
          reference_count: 2,
          smiles: '[H]N([H])[H]',
          toxicity_risk_mean: 0.22,
          toxicity_scores: {},
          updated_at: '2026-04-05',
        },
      ],
      page: 1,
      pageSize: 50,
      total: 1,
      totalPages: 1,
    });
    mockGetUniqueCompoundClasses.mockResolvedValue(['Nitrogen-containing']);
    mockGetUniqueReferenceAGs.mockResolvedValue(['ATSDR; PSL']);
    mockGetUniqueGenes.mockResolvedValue(['nahA']);
    mockGetPathwayOptions.mockResolvedValue([
      { pathway: 'Benzoate degradation', source: 'KEGG' },
      { pathway: 'Catechol degradation', source: 'HADEG' },
    ]);
  });

  it('applies search filters, clears them, and opens a compound detail from the result row', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();

    render(<CompoundExplorer onCompoundSelect={onCompoundSelect} />);

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Ammonia or C00014')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 300')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 250')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('e.g. Ammonia or C00014'), 'Ammonia');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(mockGetCompounds).toHaveBeenLastCalledWith({ search: 'Ammonia' }, { page: 1, pageSize: 50 });
    });

    await user.click(await screen.findByRole('button', { name: 'Clear filters' }));

    await waitFor(() => {
      expect(mockGetCompounds).toHaveBeenLastCalledWith({}, { page: 1, pageSize: 50 });
    });

    await user.click(screen.getByRole('button', { name: 'C00014' }));
    expect(onCompoundSelect).toHaveBeenCalledWith('C00014');
  });

  it('changes pages when more than one result page is available', async () => {
    const user = userEvent.setup();

    mockGetCompounds.mockImplementation((_filters, pagination) => {
      if (pagination.page === 2) {
        return Promise.resolve({
          data: [
            {
              cpd: 'C06790',
              compoundname: 'Trichloroethene',
              compoundclass: 'Aliphatic',
              gene_count: 47,
              genes: [],
              high_risk_endpoint_count: 6,
              ko_count: 47,
              pathway_count: 19,
              pathways: [],
              reference_ag: 'ATSDR',
              reference_count: 1,
              smiles: 'C=C(Cl)Cl',
              toxicity_risk_mean: 0.28,
              toxicity_scores: {},
              updated_at: '2026-04-05',
            },
          ],
          page: 2,
          pageSize: 50,
          total: 2,
          totalPages: 2,
        });
      }

      return Promise.resolve({
        data: [
          {
            cpd: 'C00014',
            compoundname: 'Ammonia',
            compoundclass: 'Nitrogen-containing',
            gene_count: 327,
            genes: [],
            high_risk_endpoint_count: 2,
            ko_count: 334,
            pathway_count: 25,
            pathways: [],
            reference_ag: 'ATSDR; PSL',
            reference_count: 2,
            smiles: '[H]N([H])[H]',
            toxicity_risk_mean: 0.22,
            toxicity_scores: {},
            updated_at: '2026-04-05',
          },
        ],
        page: 1,
        pageSize: 50,
        total: 2,
        totalPages: 2,
      });
    });

    render(<CompoundExplorer onCompoundSelect={vi.fn()} />);

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(mockGetCompounds).toHaveBeenLastCalledWith({}, { page: 2, pageSize: 50 });
    });

    expect(await screen.findByText('Trichloroethene')).toBeInTheDocument();
  });
});
