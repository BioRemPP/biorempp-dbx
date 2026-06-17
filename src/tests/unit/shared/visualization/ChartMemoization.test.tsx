import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BoxplotChart } from '@/shared/visualization/charts/BoxplotChart';
import { CategoricalHeatmap } from '@/shared/visualization/charts/CategoricalHeatmap';

describe('chart memoization surfaces', () => {
  it('renders BoxplotChart empty and non-empty states without changing visible behavior on rerender', () => {
    const groups = [
      {
        id: 'aromatic',
        label: 'Aromatic',
        count: 2,
        min: 0.1,
        q1: 0.2,
        median: 0.3,
        q3: 0.4,
        max: 0.5,
        points: [
          {
            cpd: 'C00014',
            compoundname: 'Ammonia',
            endpoint: 'nr_ar',
            toxicity_value: 0.31,
          },
        ],
      },
    ];

    const emptyRender = render(
      <BoxplotChart groups={[]} emptyMessage="No boxplot data available." />
    );

    expect(screen.getByText('No boxplot data available.')).toBeInTheDocument();
    emptyRender.unmount();

    const { rerender } = render(
      <BoxplotChart groups={groups} emptyMessage="No boxplot data available." yLabel="toxicity score" />
    );

    expect(screen.getByRole('img', { name: 'Boxplot chart' })).toBeInTheDocument();
    expect(screen.getByText('toxicity score')).toBeInTheDocument();
    expect(screen.getByText(/Classic boxplot with overlay points/)).toBeInTheDocument();

    rerender(
      <BoxplotChart groups={groups} emptyMessage="No boxplot data available." yLabel="toxicity score" />
    );

    expect(screen.getByRole('img', { name: 'Boxplot chart' })).toBeInTheDocument();
    expect(screen.getByText('toxicity score')).toBeInTheDocument();
  });

  it('renders CategoricalHeatmap empty state, values, and sparse fallback cells', () => {
    const emptyRender = render(
      <CategoricalHeatmap
        xLabels={[]}
        yLabels={[]}
        cells={[]}
        emptyMessage="No heatmap data available."
      />
    );

    expect(screen.getByText('No heatmap data available.')).toBeInTheDocument();
    emptyRender.unmount();

    render(
      <CategoricalHeatmap
        xLabels={['endpoint-a', 'endpoint-b']}
        yLabels={['Compound 1']}
        cells={[
          {
            x: 'endpoint-a',
            y: 'Compound 1',
            value: 0.42,
            displayValue: '0.42',
            tooltip: 'Compound 1 x endpoint-a: 0.42',
          },
        ]}
        emptyMessage="No heatmap data available."
        showValues
      />
    );

    expect(screen.getByText('endpoint-a')).toBeInTheDocument();
    expect(screen.getByText('endpoint-b')).toBeInTheDocument();
    expect(screen.getByText('Compound 1')).toBeInTheDocument();
    expect(screen.getByText('0.42')).toBeInTheDocument();
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByTitle('Compound 1 x endpoint-a: 0.42')).toBeInTheDocument();
    expect(screen.getByTitle('Compound 1 x endpoint-b: 0.00')).toBeInTheDocument();
  });
});
