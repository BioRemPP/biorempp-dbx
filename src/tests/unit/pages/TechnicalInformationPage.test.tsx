import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TECHNICAL_INFORMATION_CATALOG } from '@/content/technical-information/catalog';
import { TechnicalInformationPage } from '@pages/TechnicalInformationPage';

describe('TechnicalInformationPage', () => {
  it('renders the hero, release snapshot, section headings, and FAQ accordion', () => {
    render(<TechnicalInformationPage onNavigateToView={vi.fn()} />);

    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.header.title })).toBeInTheDocument();
    expect(screen.getByText('Generated 2026-04-05')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.sidebar.snapshot_title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.runtime_delivery.title })).toBeInTheDocument();
    expect(screen.getByText(TECHNICAL_INFORMATION_CATALOG.runtime_delivery.recommendation_title)).toBeInTheDocument();
    expect(screen.getByText(/prefer the release CSV files distributed by the project/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.build_overview.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.schema_quality.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: TECHNICAL_INFORMATION_CATALOG.faq.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: TECHNICAL_INFORMATION_CATALOG.faq.items[0].question })).toBeInTheDocument();
    expect(screen.getAllByText('123,762').length).toBeGreaterThan(0);
  });
});
