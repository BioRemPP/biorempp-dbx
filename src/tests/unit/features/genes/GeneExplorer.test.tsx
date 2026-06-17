import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GeneExplorer } from '@features/genes/pages/GeneExplorer';

const { mockGetGenes } = vi.hoisted(() => ({
  mockGetGenes: vi.fn(),
}));

vi.mock('@/features/genes/api', () => ({
  getGenes: mockGetGenes,
}));

describe('GeneExplorer', () => {
  beforeEach(() => {
    mockGetGenes.mockReset();
    mockGetGenes.mockResolvedValue({
      data: [
        {
          ko: 'K00001',
          genesymbol: 'nahA',
          genename: 'Naphthalene dioxygenase alpha subunit',
          compound_count: 12,
          pathway_count: 4,
          enzyme_activities: ['dioxygenase', 'oxidoreductase', 'hydrolase'],
          updated_at: '2026-04-05',
        },
      ],
      page: 1,
      pageSize: 50,
      total: 1,
      totalPages: 1,
    });
  });

  it('filters by search and opens the selected gene detail', async () => {
    const user = userEvent.setup();
    const onGeneSelect = vi.fn();

    render(<GeneExplorer onGeneSelect={onGeneSelect} />);

    expect(await screen.findByText('nahA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. nahA or K00001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 5')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 50')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('e.g. nahA or K00001'), 'nahA');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(mockGetGenes).toHaveBeenLastCalledWith({ search: 'nahA' }, { page: 1, pageSize: 50 });
    });

    await user.click(screen.getByRole('button', { name: 'K00001' }));
    expect(onGeneSelect).toHaveBeenCalledWith('K00001');
  });

  it('prefills the explorer search when guided drilldown falls back by gene symbol', async () => {
    const user = userEvent.setup();

    render(
      <GeneExplorer
        entryNotice='KO detail was unavailable for "nahA". Showing Gene / KO Explorer results filtered by this symbol instead.'
        entrySearch="nahA"
        entryToken="guided-fallback-1"
        onGeneSelect={vi.fn()}
      />
    );

    expect(await screen.findByDisplayValue('nahA')).toBeInTheDocument();
    expect(
      screen.getByText(
        'KO detail was unavailable for "nahA". Showing Gene / KO Explorer results filtered by this symbol instead.'
      )
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetGenes).toHaveBeenNthCalledWith(1, { search: 'nahA' }, { page: 1, pageSize: 50 });
    });

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. nahA or K00001')).toHaveValue('');
      expect(
        screen.queryByText(
          'KO detail was unavailable for "nahA". Showing Gene / KO Explorer results filtered by this symbol instead.'
        )
      ).not.toBeInTheDocument();
      expect(mockGetGenes).toHaveBeenLastCalledWith({}, { page: 1, pageSize: 50 });
    });
  });
});
