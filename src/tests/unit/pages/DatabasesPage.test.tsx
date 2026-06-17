import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatabasesPage } from '@/features/databases/pages/DatabasesPage';
import { DatabaseSchemaPage } from '@/features/databases/pages/DatabaseSchemaPage';

describe('DatabasesPage', () => {
  it('renders the schema synthesis sections and opens detail pages from quick navigation', async () => {
    const user = userEvent.setup();
    const onOpenSchema = vi.fn();

    render(<DatabasesPage onOpenSchema={onOpenSchema} />);

    expect(screen.getByRole('heading', { name: 'Database Schemas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What Each Schema Contains' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Database Summaries' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Integration Architecture' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Common File Format' })).toBeInTheDocument();
    expect(
      screen.getAllByText('Integrated compound-gene-enzyme-agency relationships with EC and KEGG reaction annotations').length
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'HADEG' }));
    expect(onOpenSchema).toHaveBeenCalledWith('hadeg');
  });
});

describe('DatabaseSchemaPage', () => {
  it('renders the schema detail view, accordion details, usage tabs, and database switcher', async () => {
    const user = userEvent.setup();
    const onOpenSchema = vi.fn();
    const onOpenIndex = vi.fn();

    render(<DatabaseSchemaPage schemaId="hadeg" onOpenSchema={onOpenSchema} onOpenIndex={onOpenIndex} />);

    expect(screen.getByRole('heading', { name: 'HADEG Database Schema' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Schema Definition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Column Specifications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Schema Constraints' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Data Quality' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Usage Examples' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Gene - Gene symbol for hydrocarbon degradation' }));
    expect(
      screen.getByText('Identifies the gene symbol associated with hydrocarbon degradation function')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Python' }));
    expect(screen.getByText(/pd\.read_csv\("path\/hadeg_db\.csv"/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'BioRemPP' }));
    expect(onOpenSchema).toHaveBeenCalledWith('biorempp');

    await user.click(screen.getByRole('button', { name: 'All schemas' }));
    expect(onOpenIndex).toHaveBeenCalled();
  });

  it('renders the updated BioRemPP schema release metadata and new enrichment columns', async () => {
    const user = userEvent.setup();
    const onOpenSchema = vi.fn();
    const onOpenIndex = vi.fn();

    render(<DatabaseSchemaPage schemaId="biorempp" onOpenSchema={onOpenSchema} onOpenIndex={onOpenIndex} />);

    expect(screen.getByRole('heading', { name: 'BioRemPP Integrated Database' })).toBeInTheDocument();
    expect(screen.getByText('v1.1.0')).toBeInTheDocument();
    expect(screen.getByText('123,762')).toBeInTheDocument();
    expect(
      screen.getByText('Core identifiers are fully populated; unresolved EC and reaction enrichments are preserved as `NA` sentinels.')
    ).toBeInTheDocument();
    expect(screen.getByText('reaction_description')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ec - Enzyme Commission number' }));
    expect(
      screen.getByText('Adds enzyme-level biochemical specificity to KO-linked compound relationships.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Semantically nullable; unresolved values are serialized as/i)
    ).toBeInTheDocument();
  });
});
