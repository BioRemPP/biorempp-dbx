import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';
import { DOCUMENTATION_CATALOG } from '@/content/documentation/catalog';
import { FAQ_CATALOG } from '@/content/faq/catalog';

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

vi.mock('@features/compounds/pages/CompoundDetail', () => ({
  CompoundDetail: ({ cpd, onGeneSelect }: { cpd: string; onGeneSelect: (ko: string) => void }) => (
    <div>
      <h2>Compound Detail {cpd}</h2>
      <button type="button" onClick={() => onGeneSelect('K00001')}>
        Open associated gene
      </button>
    </div>
  ),
}));

vi.mock('@features/genes/pages/GeneDetail', () => ({
  GeneDetail: ({ ko }: { ko: string }) => <h2>Gene Detail {ko}</h2>,
}));

vi.mock('@/features/guided-analysis/pages/GuidedAnalysisPage', () => ({
  GuidedAnalysisPage: () => <h2>Guided Analysis</h2>,
}));

vi.mock('@pages/UserGuidePage', () => ({
  UserGuidePage: () => <h2>User Guide</h2>,
}));

vi.mock('@pages/ScientificOverviewPage', () => ({
  ScientificOverviewPage: () => <h2>Scientific Overview</h2>,
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

describe('App shell navigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
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
    ]);
  });

  it('renders the home route and navigates to User Guide, Technical Information, FAQ, Documentation, and Databases', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByRole('heading', { name: 'BioRemPP Database Explorer' }).length).toBeGreaterThan(0);
    expect(screen.getByText('Beta 1.0.0')).toBeInTheDocument();
    expect(screen.getByText('BioRemPP v1.0.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'biorempp@gmail.com' })).toHaveAttribute('href', 'mailto:biorempp@gmail.com');
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      DOCUMENTATION_CATALOG.resource_card.url
    );

    await user.click(screen.getByRole('button', { name: 'User Guide' }));
    expect(screen.getByRole('heading', { name: 'User Guide' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/user-guide');

    await user.click(screen.getByRole('button', { name: 'Technical Information' }));
    expect(screen.getByRole('heading', { name: 'Technical Information' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/technical-information');

    await user.click(screen.getByRole('button', { name: 'FAQ' }));
    expect(screen.getByRole('heading', { name: FAQ_CATALOG.title })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/faq');

    await user.click(screen.getByRole('button', { name: 'Documentation' }));
    expect(screen.getByRole('heading', { name: 'Documentation' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/documentation');

    await user.click(screen.getByRole('button', { name: 'Databases' }));
    expect(screen.getByRole('heading', { name: 'Database Schemas' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/databases');
  });

  it('redirects the legacy database metrics route to the canonical databases route', async () => {
    window.history.replaceState({}, '', '/database-metrics');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Database Schemas' })).toBeInTheDocument();
    await waitFor(() => expect(window.location.pathname).toBe('/databases'));
  });

  it('renders database schema detail routes from the current location', () => {
    window.history.replaceState({}, '', '/databases/hadeg');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'HADEG Database Schema' })).toBeInTheDocument();
  });

  it('renders the compounds route from the current location', async () => {
    window.history.replaceState({}, '', '/compounds');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Compound Explorer' })).toBeInTheDocument();
    expect(await screen.findByText('Ammonia')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'C00014' })).toBeInTheDocument();
  });

  it('renders compound and gene detail routes from the current location', async () => {
    window.history.replaceState({}, '', '/compounds/C00014');
    const firstRender = render(<App />);

    expect(await screen.findByRole('heading', { name: 'Compound Detail C00014' })).toBeInTheDocument();

    firstRender.unmount();
    window.history.replaceState({}, '', '/genes/K00001');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Gene Detail K00001' })).toBeInTheDocument();
  });

  it('navigates from compound detail associated gene links to the gene detail route', async () => {
    const user = userEvent.setup();

    window.history.replaceState({}, '', '/compounds/C00014');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Compound Detail C00014' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open associated gene' }));

    expect(await screen.findByRole('heading', { name: 'Gene Detail K00001' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/genes/K00001');
  });

  it('renders the guided analysis route from the current location', () => {
    window.history.replaceState({}, '', '/guided-analysis');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Guided Analysis' })).toBeInTheDocument();
  });

  it('renders the user guide route from the current location', () => {
    window.history.replaceState({}, '', '/user-guide');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'User Guide' })).toBeInTheDocument();
  });

  it('renders the scientific overview route from the current location', () => {
    window.history.replaceState({}, '', '/scientific-overview');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Scientific Overview' })).toBeInTheDocument();
  });

  it('renders the documentation route from the current location', () => {
    window.history.replaceState({}, '', '/documentation');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Documentation' })).toBeInTheDocument();
  });

  it('renders the technical information route from the current location', () => {
    window.history.replaceState({}, '', '/technical-information');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Technical Information' })).toBeInTheDocument();
  });
});
