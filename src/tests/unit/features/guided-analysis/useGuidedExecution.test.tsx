import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetGuidedExecutionTestState, useGuidedExecution } from '@/features/guided-analysis/hooks/useGuidedExecution';

const { mockExecuteGuidedQuery } = vi.hoisted(() => ({
  mockExecuteGuidedQuery: vi.fn(),
}));

vi.mock('@/features/guided-analysis/api', async () => {
  const actual = await vi.importActual<typeof import('@/features/guided-analysis/api')>('@/features/guided-analysis/api');
  return {
    ...actual,
    executeGuidedQuery: mockExecuteGuidedQuery,
  };
});

const TEST_QUERY = {
  id: 'top_bioremediation_compounds',
  category: 'compound-analysis',
  title: 'Top Bioremediation Compounds',
  question: 'Question',
  description: 'Description',
  dataset: 'compound_summary',
  executor: 'sqlite',
  defaults: {
    page_size: 10,
    filters: {
      search_compound: 'Ammonia',
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
  ],
  use_case_description: {
    scientific_question: 'Question',
    description: 'Description',
    interpretation_guidelines: ['Interpret carefully.'],
    limitations: ['Limitations apply.'],
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
    title: 'Results',
    columns: [],
    row_click_field: 'cpd',
    empty_message: 'No results.',
  },
} as const;

function buildExecutionResponse(compoundName: string) {
  return {
    meta: {
      query_id: TEST_QUERY.id,
      dataset: TEST_QUERY.dataset,
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
      id: 'guided-results',
      title: 'Results',
      columns: [],
      row_click_field: 'cpd',
      empty_message: 'No results.',
      rows: [{ cpd: 'C00014', compoundname: compoundName }],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    },
  };
}

describe('useGuidedExecution', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    __resetGuidedExecutionTestState();
    mockExecuteGuidedQuery.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces rapid filter changes into a single execution', async () => {
    mockExecuteGuidedQuery.mockResolvedValue(buildExecutionResponse('Acetaldehyde'));

    const { rerender } = renderHook(
      ({ filters }) => useGuidedExecution(TEST_QUERY, filters, true),
      {
        initialProps: {
          filters: { search_compound: 'A' },
        },
      }
    );

    rerender({ filters: { search_compound: 'Ac' } });
    rerender({ filters: { search_compound: 'Ace' } });
    rerender({ filters: { search_compound: 'Acetaldehyde' } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(349);
    });
    expect(mockExecuteGuidedQuery).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(mockExecuteGuidedQuery).toHaveBeenCalledTimes(1);

    expect(mockExecuteGuidedQuery).toHaveBeenCalledWith(TEST_QUERY.id, {
      page: 1,
      pageSize: 10,
      filters: {
        search_compound: 'Acetaldehyde',
      },
    });
  });
});
