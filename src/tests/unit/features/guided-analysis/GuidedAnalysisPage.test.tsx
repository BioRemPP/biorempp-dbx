import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuidedApiError } from '@/features/guided-analysis/api';
import { __resetGuidedExecutionTestState } from '@/features/guided-analysis/hooks/useGuidedExecution';
import { GuidedAnalysisPage } from '@/features/guided-analysis/pages/GuidedAnalysisPage';

const {
  mockExecuteGuidedQuery,
  mockGetGuidedCatalog,
  mockGetGenes,
  mockGetGuidedQueryOptions,
  mockGetGuidedQueryRecipe,
} = vi.hoisted(() => ({
  mockExecuteGuidedQuery: vi.fn(),
  mockGetGuidedCatalog: vi.fn(),
  mockGetGenes: vi.fn(),
  mockGetGuidedQueryOptions: vi.fn(),
  mockGetGuidedQueryRecipe: vi.fn(),
}));

vi.mock('@/features/guided-analysis/api', async () => {
  const actual = await vi.importActual<typeof import('@/features/guided-analysis/api')>('@/features/guided-analysis/api');
  return {
    ...actual,
    executeGuidedQuery: mockExecuteGuidedQuery,
    getGuidedCatalog: mockGetGuidedCatalog,
    getGuidedQueryOptions: mockGetGuidedQueryOptions,
  };
});

vi.mock('@/features/guided-analysis/recipes/guidedQueryRecipes', () => ({
  getGuidedQueryRecipe: mockGetGuidedQueryRecipe,
}));

vi.mock('@/features/genes/api', () => ({
  getGenes: mockGetGenes,
}));

const GUIDED_CATALOG = {
  version: '1.0.0',
  title: 'Guided Analysis',
  categories: [
    {
      id: 'compound-analysis',
      label: 'Compound Analysis',
    },
  ],
  generated_at: '2026-04-25',
  queries: [
    {
      id: 'top_bioremediation_compounds',
      category: 'compound-analysis',
      title: 'Top Bioremediation Compounds',
      question: 'Which compounds have the highest remediation breadth?',
      description: 'Ranks compounds by selected remediation metric.',
      dataset: 'compound_summary',
      executor: 'sqlite',
      defaults: {
        page_size: 10,
        filters: {
          search_compound: 'Ammonia',
          metric: 'gene_count',
          endpoint: 'nr-ar',
        },
      },
      executor_config: {},
      filters: [
        {
          id: 'search_compound',
          type: 'search',
          label: 'Search Compound',
          placeholder: 'e.g. Ammonia or C00014',
        },
        {
          id: 'metric',
          type: 'select',
          label: 'Ranking Metric',
        },
        {
          id: 'endpoint',
          type: 'dependent_select',
          label: 'Endpoint',
          depends_on: 'metric',
        },
        {
          id: 'gene_count',
          type: 'number_range',
          label: 'Gene Count',
          min: 0,
          min_placeholder: 'e.g. 10',
          max_placeholder: 'e.g. 250',
        },
      ],
      use_case_description: {
        scientific_question: 'Which compounds should be inspected first?',
        description: 'Guides exploratory prioritization of compounds.',
        interpretation: ['Use this ranking as exploratory evidence only.'],
      },
      methods_modal: {
        button_label: 'View Methods',
        title: 'Methods',
        introduction: 'Methods overview.',
        steps: [],
      },
      summary_cards: [],
      visualizations: [],
      table: {
        id: 'guided-results',
        title: 'Ranked compounds',
        columns: [
          {
            id: 'cpd',
            label: 'Compound ID',
            type: 'compound_link',
          },
          {
            id: 'compoundname',
            label: 'Compound Name',
            type: 'text',
          },
        ],
        row_click_field: 'cpd',
        empty_message: 'No compounds available.',
      },
      insights: [],
    },
    {
      id: 'most_toxic_compounds',
      category: 'compound-analysis',
      title: 'Most Toxic Compounds',
      question: 'Which compounds have the strongest toxicity signal?',
      description: 'Ranks compounds by toxicity-focused metric.',
      dataset: 'toxicity_summary',
      executor: 'sqlite',
      defaults: {
        page_size: 10,
        filters: {
          search_compound: 'Formaldehyde',
          metric: 'toxicity_mean',
          endpoint: 'sr-mmp',
        },
      },
      executor_config: {},
      filters: [
        {
          id: 'search_compound',
          type: 'search',
          label: 'Search Compound',
          placeholder: 'e.g. Ammonia or C00014',
        },
        {
          id: 'metric',
          type: 'select',
          label: 'Ranking Metric',
        },
        {
          id: 'endpoint',
          type: 'dependent_select',
          label: 'Endpoint',
          depends_on: 'metric',
        },
      ],
      use_case_description: {
        scientific_question: 'Which compounds concentrate the highest risk?',
        description: 'Supports exploratory toxicity review.',
        interpretation: ['Do not treat this as confirmatory evidence.'],
      },
      methods_modal: {
        button_label: 'View Methods',
        title: 'Methods',
        introduction: 'Methods overview.',
        steps: [],
      },
      summary_cards: [],
      visualizations: [],
      table: {
        id: 'guided-results',
        title: 'Ranked compounds',
        columns: [
          {
            id: 'cpd',
            label: 'Compound ID',
            type: 'compound_link',
          },
          {
            id: 'compoundname',
            label: 'Compound Name',
            type: 'text',
          },
        ],
        row_click_field: 'cpd',
        empty_message: 'No compounds available.',
      },
      insights: [],
    },
  ],
};

function buildOptions(queryId: string, filters: Record<string, string>) {
  const metricOptions = [
    { value: 'gene_count', label: 'Gene Count' },
    { value: 'toxicity_mean', label: 'Toxicity Mean' },
  ];

  if (queryId === 'most_toxic_compounds') {
    return {
      query_id: queryId,
      options: {
        metric: metricOptions,
        endpoint: [{ value: 'sr-mmp', label: 'SR MMP' }],
      },
    };
  }

  const endpointOptions =
    filters.metric === 'toxicity_mean'
      ? [{ value: 'sr-mmp', label: 'SR MMP' }]
      : [{ value: 'nr-ar', label: 'NR AR' }];

  return {
    query_id: queryId,
    options: {
      metric: metricOptions,
      endpoint: endpointOptions,
    },
  };
}

function buildExecutionResponse(
  queryId: string,
  page: number,
  compoundId: string,
  compoundName: string
) {
  const summaryCards =
    queryId === 'most_toxic_compounds'
      ? []
      : [
          {
            id: 'compounds_in_scope',
            label: 'Compounds in Scope',
            value: 384,
            hint: 'Compounds matching the current filters',
          },
          {
            id: 'ranked_metric',
            label: 'Ranked Metric',
            value: 'ko_count',
            hint: 'Distinct KEGG ortholog annotations used for ranking',
          },
        ];

  return {
    meta: {
      query_id: queryId,
      dataset:
        queryId === 'most_toxic_compounds' ? 'toxicity_summary' : 'compound_summary',
      version: '1.0.0',
      execution_ms: 7,
      page,
      pageSize: 10,
      total: 2,
      totalPages: 2,
    },
    summary_cards: summaryCards,
    visualizations: [],
    insights: [],
    filters_applied: {},
    table: {
      id: 'guided-results',
      title: 'Ranked compounds',
      columns: [
        {
          id: 'cpd',
          label: 'Compound ID',
          type: 'compound_link',
        },
        {
          id: 'compoundname',
          label: 'Compound Name',
          type: 'text',
        },
      ],
      row_click_field: 'cpd',
      empty_message: 'No compounds available.',
      rows: [
        {
          cpd: compoundId,
          compoundname: compoundName,
        },
      ],
      page,
      pageSize: 10,
      total: 2,
      totalPages: 2,
    },
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return { promise, resolve, reject };
}

describe('GuidedAnalysisPage', () => {
  beforeEach(() => {
    vi.useRealTimers();
    __resetGuidedExecutionTestState();
    mockExecuteGuidedQuery.mockReset();
    mockGetGuidedCatalog.mockReset();
    mockGetGenes.mockReset();
    mockGetGuidedQueryOptions.mockReset();
    mockGetGuidedQueryRecipe.mockReset();
    mockGetGuidedCatalog.mockResolvedValue(GUIDED_CATALOG);
    mockGetGenes.mockResolvedValue({
      data: [{ ko: 'K14579' }],
      page: 1,
      pageSize: 1,
      total: 1,
      totalPages: 1,
    });
    mockGetGuidedQueryRecipe.mockReturnValue(undefined);
    mockGetGuidedQueryOptions.mockImplementation((queryId: string, filters: Record<string, string>) =>
      Promise.resolve(buildOptions(queryId, filters))
    );
    mockExecuteGuidedQuery.mockImplementation(
      (
        queryId: string,
        payload: { page?: number; filters?: Record<string, unknown> } = {}
      ) => {
        const page = payload.page || 1;

        if (queryId === 'most_toxic_compounds') {
          return Promise.resolve(
            buildExecutionResponse(queryId, page, 'C00067', 'Formaldehyde')
          );
        }

        if (page === 2) {
          return Promise.resolve(
            buildExecutionResponse(queryId, page, 'C07210', 'Zidovudine')
          );
        }

        if (payload.filters?.metric === 'toxicity_mean') {
          return Promise.resolve(
            buildExecutionResponse(queryId, page, 'C10984', 'Cypermethrin')
          );
        }

        return Promise.resolve(
          buildExecutionResponse(queryId, page, 'C00014', 'Ammonia')
        );
      }
    );
  });

  it('shows the catalog loading state before the first query is ready', async () => {
    const catalogRequest = createDeferred<typeof GUIDED_CATALOG>();
    mockGetGuidedCatalog.mockReturnValue(catalogRequest.promise);

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(screen.getByText('Loading guided analysis catalog...')).toBeInTheDocument();
    expect(
      screen.getByText('Preparing guided queries and filter defaults.')
    ).toBeInTheDocument();

    catalogRequest.resolve(GUIDED_CATALOG);

    expect(
      await screen.findByRole('heading', { name: 'Top Bioremediation Compounds' })
    ).toBeInTheDocument();
  });

  it('shows the catalog error state and retries successfully', async () => {
    const user = userEvent.setup();

    mockGetGuidedCatalog
      .mockRejectedValueOnce(new Error('Catalog offline'))
      .mockResolvedValueOnce(GUIDED_CATALOG);

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(
      await screen.findByText('Unable to load guided analysis catalog')
    ).toBeInTheDocument();
    expect(screen.getByText('Catalog offline')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(
      await screen.findByRole('heading', { name: 'Top Bioremediation Compounds' })
    ).toBeInTheDocument();
    expect(mockGetGuidedCatalog).toHaveBeenCalledTimes(2);
  });

  it('loads the first query by default and resets filters when switching queries', async () => {
    const user = userEvent.setup();

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    const searchInput = await screen.findByLabelText('Search Compound');
    expect(
      screen.getByText('Which compounds have the highest remediation breadth?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ranks compounds by selected remediation metric.')
    ).toBeInTheDocument();
    expect(screen.getByText('Analysis Overview')).toBeInTheDocument();
    expect(screen.queryByText(/Dataset:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/execution 7 ms/i)).not.toBeInTheDocument();
    expect(searchInput).toHaveValue('Ammonia');
    expect(searchInput).toHaveAttribute('placeholder', 'e.g. Ammonia or C00014');
    expect(screen.getByPlaceholderText('e.g. 10')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 250')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockExecuteGuidedQuery).toHaveBeenCalledWith(
        'top_bioremediation_compounds',
        {
          page: 1,
          pageSize: 10,
          filters: {
            search_compound: 'Ammonia',
            metric: 'gene_count',
            endpoint: 'nr-ar',
          },
        }
      );
    });

    expect(await screen.findByText('KO Count')).toBeInTheDocument();
    expect(screen.getByText('Distinct KEGG ortholog annotations used for ranking')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Most Toxic Compounds' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Search Compound')).toHaveValue('Formaldehyde');
      expect(screen.getByLabelText('Ranking Metric')).toHaveValue('toxicity_mean');
      expect(screen.getByLabelText('Endpoint')).toHaveValue('sr-mmp');
    });

    expect(
      screen.getByText('Which compounds have the strongest toxicity signal?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ranks compounds by toxicity-focused metric.')
    ).toBeInTheDocument();
    expect(screen.getByText('Analysis Overview')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How it works' })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockExecuteGuidedQuery).toHaveBeenLastCalledWith(
        'most_toxic_compounds',
        {
          page: 1,
          pageSize: 10,
          filters: {
            search_compound: 'Formaldehyde',
            metric: 'toxicity_mean',
            endpoint: 'sr-mmp',
          },
        }
      );
    });
  });

  it('sanitizes dependent options and restores defaults on reset', async () => {
    const user = userEvent.setup();

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    const searchInput = await screen.findByLabelText('Search Compound');
    const metricSelect = screen.getByLabelText('Ranking Metric');
    const endpointSelect = screen.getByLabelText('Endpoint');

    await user.clear(searchInput);
    await user.type(searchInput, 'Acetaldehyde');
    await user.selectOptions(metricSelect, 'toxicity_mean');

    await waitFor(() => {
      expect(endpointSelect).toHaveValue('sr-mmp');
    });

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(searchInput).toHaveValue('Ammonia');
      expect(metricSelect).toHaveValue('gene_count');
      expect(endpointSelect).toHaveValue('nr-ar');
      expect(mockExecuteGuidedQuery).toHaveBeenLastCalledWith(
        'top_bioremediation_compounds',
        {
          page: 1,
          pageSize: 10,
          filters: {
            search_compound: 'Ammonia',
            metric: 'gene_count',
            endpoint: 'nr-ar',
          },
        }
      );
    });
  });

  it('re-executes the query when pagination changes', async () => {
    const user = userEvent.setup();

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(mockExecuteGuidedQuery).toHaveBeenLastCalledWith(
        'top_bioremediation_compounds',
        {
          page: 2,
          pageSize: 10,
          filters: {
            search_compound: 'Ammonia',
            metric: 'gene_count',
            endpoint: 'nr-ar',
          },
        }
      );
    });

    expect(await screen.findByText('Zidovudine')).toBeInTheDocument();
  });

  it('keeps the previous results visible during an incremental refresh', async () => {
    const user = userEvent.setup();
    const refreshExecution = createDeferred<ReturnType<typeof buildExecutionResponse>>();

    mockExecuteGuidedQuery.mockImplementation(
      (
        queryId: string,
        payload: { page?: number; filters?: Record<string, unknown> } = {}
      ) => {
        if (payload.filters?.metric === 'toxicity_mean') {
          return refreshExecution.promise;
        }

        return Promise.resolve(
          buildExecutionResponse(
            queryId,
            payload.page || 1,
            'C00014',
            'Ammonia'
          )
        );
      }
    );

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Ranking Metric'), 'toxicity_mean');

    expect(await screen.findByText('Refreshing results...')).toBeInTheDocument();
    expect(screen.getByText('Ammonia')).toBeInTheDocument();

    refreshExecution.resolve(
      buildExecutionResponse(
        'top_bioremediation_compounds',
        1,
        'C10984',
        'Cypermethrin'
      )
    );

    expect(await screen.findByText('Cypermethrin')).toBeInTheDocument();
  });

  it('shows the initial execution loading state before the first results arrive', async () => {
    const executionRequest = createDeferred<
      ReturnType<typeof buildExecutionResponse>
    >();
    mockExecuteGuidedQuery.mockReturnValue(executionRequest.promise);

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(await screen.findByText('Executing query...')).toBeInTheDocument();
    expect(
      screen.getByText('Preparing guided results and visualizations.')
    ).toBeInTheDocument();

    executionRequest.resolve(
      buildExecutionResponse(
        'top_bioremediation_compounds',
        1,
        'C00014',
        'Ammonia'
      )
    );

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();
  });

  it('surfaces partial options errors without blocking execution', async () => {
    mockGetGuidedQueryOptions.mockRejectedValue(
      new Error('Options service unavailable')
    );

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(
      await screen.findByText(
        'Unable to refresh dependent filter options. Current filters remain available.'
      )
    ).toBeInTheDocument();
    expect(await screen.findByText('Ammonia')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockExecuteGuidedQuery).toHaveBeenCalledWith(
        'top_bioremediation_compounds',
        {
          page: 1,
          pageSize: 10,
          filters: {
            search_compound: 'Ammonia',
            metric: 'gene_count',
            endpoint: 'nr-ar',
          },
        }
      );
    });
  });

  it('shows execution errors when the guided query fails', async () => {
    mockExecuteGuidedQuery.mockRejectedValue(new Error('SQLite timeout'));

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(
      await screen.findByText(
        'Unable to execute guided query: SQLite timeout'
      )
    ).toBeInTheDocument();
  });

  it('keeps previous results visible and shows a friendly banner when a 429 happens', async () => {
    const user = userEvent.setup();
    mockExecuteGuidedQuery
      .mockResolvedValueOnce(buildExecutionResponse('top_bioremediation_compounds', 1, 'C00014', 'Ammonia'))
      .mockRejectedValueOnce(new GuidedApiError('Too many guided analysis requests.', 429, 1));

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(await screen.findByText('Ammonia')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search Compound'), ' sulfate');

    expect(
      await screen.findByText('Unable to execute guided query: Guided Analysis rate limit reached. Try again in 1s.')
    ).toBeInTheDocument();
    expect(screen.getByText('Ammonia')).toBeInTheDocument();
  });

  it('opens and closes the guided dialogs and accordion panels', async () => {
    const user = userEvent.setup();
    mockGetGuidedQueryRecipe.mockReturnValue({
      button_label: 'View Queries',
      title: 'Query Recipes',
      introduction: 'Static reproducibility recipes.',
      recipes: [
        {
          id: 'sqlite_query',
          label: 'SQLite Query',
          description: 'SQLite version',
          language: 'sql',
          runtime: 'sqlite',
          code: 'select * from guided_results;',
        },
        {
          id: 'python_sqlite',
          label: 'Python + SQLite',
          description: 'Python version',
          language: 'python',
          runtime: 'sqlite',
          code: 'print("guided")',
        },
      ],
      notes: ['Recipe note'],
    });

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} />);

    expect(
      await screen.findByText('Which compounds should be inspected first?')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'How it works' }));
    expect(
      await screen.findByRole('dialog', { name: 'Methods' })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close methods modal' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Methods' })
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Query Logic' }));
    expect(
      await screen.findByRole('dialog', { name: 'Query Recipes' })
    ).toBeInTheDocument();
    expect(screen.getByText('Static reproducibility recipes.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'SQLite Query' })).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Close query recipes modal' })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Query Recipes' })
      ).not.toBeInTheDocument();
    });
  });

  it('navigates to pathway detail from UC5 table rows', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'pathway-analysis', label: 'Pathway Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc5_pathways_functional_coverage',
          category: 'pathway-analysis',
          title: 'Pathways with Highest Functional Coverage',
          question: 'Which pathways are most functionally covered?',
          description: 'Pathway ranking.',
          dataset: 'compound_summary',
          executor: 'uc_pathway_functional_coverage',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc5_table',
            title: 'Pathway functional coverage ranking',
            columns: [
              { id: 'pathway', label: 'Pathway', type: 'text' },
              { id: 'source', label: 'Source', type: 'text' },
            ],
            row_click_field: 'pathway',
            empty_message: 'No pathways.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc5_pathways_functional_coverage',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc5_pathways_functional_coverage',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc5_table',
        title: 'Pathway functional coverage ranking',
        columns: [
          { id: 'pathway', label: 'Pathway', type: 'text' },
          { id: 'source', label: 'Source', type: 'text' },
        ],
        row_click_field: 'pathway',
        empty_message: 'No pathways.',
        rows: [
          { pathway: 'Aromatic', source: 'KEGG' },
          { pathway: 'Aromatics', source: 'Mixed' },
        ],
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('Aromatic'));
    await user.click(await screen.findByText('Aromatics'));

    expect(onPathwaySelect).toHaveBeenNthCalledWith(1, 'Aromatic', 'KEGG');
    expect(onPathwaySelect).toHaveBeenNthCalledWith(2, 'Aromatics', undefined);
    expect(onCompoundSelect).not.toHaveBeenCalled();
  });

  it('navigates to pathway detail from UC6 table rows', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'pathway-analysis', label: 'Pathway Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc6_pathways_toxic_compounds',
          category: 'pathway-analysis',
          title: 'Pathways Associated with Toxic Compounds',
          question: 'Which pathways are linked to compounds with high predicted toxicity?',
          description: 'Pathway toxicity ranking.',
          dataset: 'compound_summary',
          executor: 'uc_pathways_toxic_compounds',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc6_table',
            title: 'Pathways associated with toxic compounds',
            columns: [
              { id: 'pathway', label: 'Pathway', type: 'text' },
              { id: 'source', label: 'Source', type: 'text' },
            ],
            row_click_field: 'pathway',
            empty_message: 'No pathways.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc6_pathways_toxic_compounds',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc6_pathways_toxic_compounds',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc6_table',
        title: 'Pathways associated with toxic compounds',
        columns: [
          { id: 'pathway', label: 'Pathway', type: 'text' },
          { id: 'source', label: 'Source', type: 'text' },
        ],
        row_click_field: 'pathway',
        empty_message: 'No pathways.',
        rows: [
          { pathway: 'Aromatic', source: 'KEGG' },
          { pathway: 'Aromatics', source: 'Mixed' },
        ],
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('Aromatic'));
    await user.click(await screen.findByText('Aromatics'));

    expect(onPathwaySelect).toHaveBeenNthCalledWith(1, 'Aromatic', 'KEGG');
    expect(onPathwaySelect).toHaveBeenNthCalledWith(2, 'Aromatics', undefined);
    expect(onCompoundSelect).not.toHaveBeenCalled();
  });

  it('navigates to gene detail from UC7 table rows', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onGeneSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'gene-ko-analysis', label: 'Gene / KO Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc7_genes_most_connected',
          category: 'gene-ko-analysis',
          title: 'Most Connected Genes',
          question: 'Which genes are associated with the largest number of compounds?',
          description: 'Gene connectivity ranking.',
          dataset: 'compound_summary',
          executor: 'uc_gene_connectivity_ranking',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc7_table',
            title: 'Ranked genes by compound connectivity',
            columns: [
              { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
              { id: 'gene_name', label: 'Gene Name', type: 'text' },
            ],
            row_click_field: 'ko',
            empty_message: 'No genes.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc7_genes_most_connected',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc7_genes_most_connected',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc7_table',
        title: 'Ranked genes by compound connectivity',
        columns: [
          { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
          { id: 'gene_name', label: 'Gene Name', type: 'text' },
        ],
        row_click_field: 'ko',
        empty_message: 'No genes.',
        rows: [{ genesymbol: 'catA', gene_name: 'Catechol 1,2-dioxygenase', ko: 'K03381' }],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onGeneSelect={onGeneSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('catA'));

    expect(onGeneSelect).toHaveBeenCalledWith('K03381');
    expect(onCompoundSelect).not.toHaveBeenCalled();
    expect(onPathwaySelect).not.toHaveBeenCalled();
  });

  it('navigates to gene detail from UC8 table rows', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onGeneSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'gene-ko-analysis', label: 'Gene / KO Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc8_genes_linked_toxic_compounds',
          category: 'gene-ko-analysis',
          title: 'Genes Linked to Toxic Compounds',
          question: 'Which genes are associated with compounds above the selected toxicity threshold?',
          description: 'Gene toxicity linkage ranking.',
          dataset: 'compound_summary',
          executor: 'uc_gene_toxic_compounds_endpoint',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc8_table',
            title: 'Genes associated with toxic compounds',
            columns: [
              { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
              { id: 'gene_name', label: 'Gene Name', type: 'text' },
            ],
            row_click_field: 'ko',
            empty_message: 'No genes.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc8_genes_linked_toxic_compounds',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc8_genes_linked_toxic_compounds',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc8_table',
        title: 'Genes associated with toxic compounds',
        columns: [
          { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
          { id: 'gene_name', label: 'Gene Name', type: 'text' },
        ],
        row_click_field: 'ko',
        empty_message: 'No genes.',
        rows: [{ genesymbol: 'nahAc', gene_name: 'Naphthalene dioxygenase', ko: 'k14579' }],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onGeneSelect={onGeneSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('nahAc'));

    expect(onGeneSelect).toHaveBeenCalledWith('K14579');
    expect(onCompoundSelect).not.toHaveBeenCalled();
    expect(onPathwaySelect).not.toHaveBeenCalled();
  });

  it('falls back to the gene explorer when a UC8 row has no ko field', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onGeneSelect = vi.fn();
    const onGeneExplorerSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'gene-ko-analysis', label: 'Gene / KO Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc8_genes_linked_toxic_compounds',
          category: 'gene-ko-analysis',
          title: 'Genes Linked to Toxic Compounds',
          question: 'Which genes are associated with compounds above the selected toxicity threshold?',
          description: 'Gene toxicity linkage ranking.',
          dataset: 'compound_summary',
          executor: 'uc_gene_toxic_compounds_endpoint',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc8_table',
            title: 'Genes associated with toxic compounds',
            columns: [
              { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
              { id: 'gene_name', label: 'Gene Name', type: 'text' },
            ],
            row_click_field: 'ko',
            empty_message: 'No genes.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc8_genes_linked_toxic_compounds',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc8_genes_linked_toxic_compounds',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc8_table',
        title: 'Genes associated with toxic compounds',
        columns: [
          { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
          { id: 'gene_name', label: 'Gene Name', type: 'text' },
        ],
        row_click_field: 'ko',
        empty_message: 'No genes.',
        rows: [{ genesymbol: 'nahAc', gene_name: 'Naphthalene dioxygenase' }],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onGeneSelect={onGeneSelect}
        onGeneExplorerSelect={onGeneExplorerSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('nahAc'));

    expect(onGeneExplorerSelect).toHaveBeenCalledWith({
      notice: 'KO detail was unavailable for "nahAc". Showing Gene / KO Explorer results filtered by this symbol instead.',
      search: 'nahAc',
    });
    expect(mockGetGenes).not.toHaveBeenCalled();
    expect(onGeneSelect).not.toHaveBeenCalled();
    expect(onCompoundSelect).not.toHaveBeenCalled();
    expect(onPathwaySelect).not.toHaveBeenCalled();
  });

  it('shows an inline error when a guided gene row cannot resolve to a KO or symbol', async () => {
    const user = userEvent.setup();
    const onCompoundSelect = vi.fn();
    const onGeneSelect = vi.fn();
    const onGeneExplorerSelect = vi.fn();
    const onPathwaySelect = vi.fn();

    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'gene-ko-analysis', label: 'Gene / KO Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc8_genes_linked_toxic_compounds',
          category: 'gene-ko-analysis',
          title: 'Genes Linked to Toxic Compounds',
          question: 'Which genes are associated with compounds above the selected toxicity threshold?',
          description: 'Gene toxicity linkage ranking.',
          dataset: 'compound_summary',
          executor: 'uc_gene_toxic_compounds_endpoint',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [],
          table: {
            id: 'uc8_table',
            title: 'Genes associated with toxic compounds',
            columns: [
              { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
              { id: 'gene_name', label: 'Gene Name', type: 'text' },
            ],
            row_click_field: 'ko',
            empty_message: 'No genes.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc8_genes_linked_toxic_compounds',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc8_genes_linked_toxic_compounds',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      summary_cards: [],
      visualizations: [],
      insights: [],
      filters_applied: {},
      table: {
        id: 'uc8_table',
        title: 'Genes associated with toxic compounds',
        columns: [
          { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
          { id: 'gene_name', label: 'Gene Name', type: 'text' },
        ],
        row_click_field: 'ko',
        empty_message: 'No genes.',
        rows: [{ gene_name: 'Naphthalene dioxygenase' }],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    });

    render(
      <GuidedAnalysisPage
        onCompoundSelect={onCompoundSelect}
        onGeneSelect={onGeneSelect}
        onGeneExplorerSelect={onGeneExplorerSelect}
        onPathwaySelect={onPathwaySelect}
      />
    );

    await user.click(await screen.findByText('Naphthalene dioxygenase'));

    expect(
      await screen.findByText(
        'Unable to open gene detail because this guided result does not include a KO or gene symbol.'
      )
    ).toBeInTheDocument();
    expect(onGeneSelect).not.toHaveBeenCalled();
    expect(onGeneExplorerSelect).not.toHaveBeenCalled();
    expect(mockGetGenes).not.toHaveBeenCalled();
  });

  it('scopes UC8 barplot and boxplot to the genes in the current table page', async () => {
    mockGetGuidedCatalog.mockResolvedValueOnce({
      version: '1.0.0',
      title: 'Guided Analysis',
      categories: [{ id: 'gene-ko-analysis', label: 'Gene / KO Analysis' }],
      generated_at: '2026-04-25',
      queries: [
        {
          id: 'uc8_genes_linked_toxic_compounds',
          category: 'gene-ko-analysis',
          title: 'Genes Linked to Toxic Compounds',
          question: 'Which genes are associated with compounds above the selected toxicity threshold?',
          description: 'Gene toxicity linkage ranking.',
          dataset: 'compound_summary',
          executor: 'uc_gene_toxic_compounds_endpoint',
          defaults: { page_size: 10, filters: {} },
          executor_config: {},
          filters: [],
          use_case_description: {
            scientific_question: 'Question',
            description: 'Description',
            interpretation: ['Interpretation statement for testing.'],
          },
          methods_modal: {
            button_label: 'View Methods',
            title: 'Methods',
            introduction: 'Methods overview.',
            steps: [],
          },
          summary_cards: [],
          visualizations: [
            { id: 'uc8_boxplot', type: 'boxplot', title: 'Toxicity Distribution per Gene', subtitle: null, data_key: 'toxicity_boxplot' },
            { id: 'uc8_bar', type: 'horizontal_bar', title: 'Genes Linked to Toxic Compounds', subtitle: null, data_key: 'bar_items' },
          ],
          table: {
            id: 'uc8_table',
            title: 'Genes associated with toxic compounds',
            columns: [
              { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
              { id: 'gene_name', label: 'Gene Name', type: 'text' },
            ],
            row_click_field: 'ko',
            empty_message: 'No genes.',
          },
          insights: [],
        },
      ],
    });

    mockGetGuidedQueryOptions.mockResolvedValueOnce({
      query_id: 'uc8_genes_linked_toxic_compounds',
      options: {},
    });

    mockExecuteGuidedQuery.mockResolvedValueOnce({
      meta: {
        query_id: 'uc8_genes_linked_toxic_compounds',
        dataset: 'compound_summary',
        version: '1.0.0',
        execution_ms: 5,
        page: 2,
        pageSize: 10,
        total: 20,
        totalPages: 2,
      },
      summary_cards: [],
      insights: [],
      filters_applied: {},
      visualizations: [
        {
          id: 'uc8_boxplot',
          type: 'boxplot',
          title: 'Toxicity Distribution per Gene',
          subtitle: null,
          data_key: 'toxicity_boxplot',
          data: {
            groups: [
              { id: 'nahAc', label: 'nahAc', count: 2, min: 0.1, q1: 0.2, median: 0.3, q3: 0.4, max: 0.5, points: [] },
              { id: 'GSTK1', label: 'GSTK1', count: 2, min: 0.1, q1: 0.2, median: 0.3, q3: 0.4, max: 0.5, points: [] },
              { id: 'GSTP', label: 'GSTP', count: 2, min: 0.1, q1: 0.2, median: 0.3, q3: 0.4, max: 0.5, points: [] },
            ],
            empty_message: 'No boxplot data available.',
          },
        },
        {
          id: 'uc8_bar',
          type: 'horizontal_bar',
          title: 'Genes Linked to Toxic Compounds',
          subtitle: null,
          data_key: 'bar_items',
          data: {
            items: [
              { id: 'nahAc', label: 'nahAc', value: 27, color: '#2563eb' },
              { id: 'GSTK1', label: 'GSTK1', value: 12, color: '#2563eb' },
              { id: 'GSTP', label: 'GSTP', value: 12, color: '#2563eb' },
            ],
            empty_message: 'No genes available.',
          },
        },
      ],
      table: {
        id: 'uc8_table',
        title: 'Genes associated with toxic compounds',
        columns: [
          { id: 'genesymbol', label: 'Gene Symbol', type: 'text' },
          { id: 'gene_name', label: 'Gene Name', type: 'text' },
        ],
        row_click_field: 'ko',
        empty_message: 'No genes.',
        rows: [
          { rank: 41, genesymbol: 'GSTK1', gene_name: 'glutathione S-transferase kappa 1', ko: 'K00799' },
          { rank: 42, genesymbol: 'GSTP', gene_name: 'glutathione S-transferase P', ko: 'K00799' },
        ],
        page: 2,
        pageSize: 10,
        total: 20,
        totalPages: 2,
      },
    });

    render(<GuidedAnalysisPage onCompoundSelect={vi.fn()} onGeneSelect={vi.fn()} onPathwaySelect={vi.fn()} />);

    expect((await screen.findAllByText('GSTK1')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('GSTP').length).toBeGreaterThan(0);
    expect(screen.queryByText('nahAc')).not.toBeInTheDocument();
  });
});
