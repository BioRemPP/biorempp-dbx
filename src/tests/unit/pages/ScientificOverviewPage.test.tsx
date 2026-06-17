import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SCIENTIFIC_OVERVIEW_CATALOG } from '@/content/scientific-overview/catalog';
import { ScientificOverviewPage } from '@pages/ScientificOverviewPage';

describe('ScientificOverviewPage', () => {
  it('renders the hero, quick nav, and all four macrosections', () => {
    render(<ScientificOverviewPage />);

    expect(screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.header.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.quick_nav.title })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.sections.scientificFoundations.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.sections.dataScience.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.sections.fairPrinciples.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: SCIENTIFIC_OVERVIEW_CATALOG.sections.multiomics.title })
    ).toBeInTheDocument();
    expect(screen.getByText(SCIENTIFIC_OVERVIEW_CATALOG.sections.scientificFoundations.terms[0].label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: SCIENTIFIC_OVERVIEW_CATALOG.sections.dataScience.categories[0].title })).toBeInTheDocument();
    expect(screen.getByText(SCIENTIFIC_OVERVIEW_CATALOG.sections.fairPrinciples.fair_principles[0].label)).toBeInTheDocument();
    expect(
      screen.getAllByText(SCIENTIFIC_OVERVIEW_CATALOG.sections.multiomics.core_identifiers[0].label).length
    ).toBeGreaterThan(0);
  });
});
