import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DOCUMENTATION_CATALOG } from '@/content/documentation/catalog';
import { DocumentationPage } from '@pages/DocumentationPage';

describe('DocumentationPage', () => {
  it('renders the documentation hero, framework section, and external resource card', () => {
    render(<DocumentationPage />);

    expect(screen.getByRole('heading', { name: DOCUMENTATION_CATALOG.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: DOCUMENTATION_CATALOG.framework.title })).toBeInTheDocument();
    expect(screen.getByText(DOCUMENTATION_CATALOG.framework.bullets[0].description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open BioRemPP Web Service/i })).toHaveAttribute(
      'href',
      'https://bioinfo.imd.ufrn.br/biorempp/'
    );
    expect(screen.getByRole('link', { name: /Open BioRemPP DBX Service/i })).toHaveAttribute(
      'href',
      'https://bioinfo.imd.ufrn.br/bioremppdbx/'
    );
    expect(screen.getByRole('heading', { name: DOCUMENTATION_CATALOG.resources_title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: DOCUMENTATION_CATALOG.resource_card.title })).toBeInTheDocument();
    expect(screen.getByText(/Database Explorer platform/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: DOCUMENTATION_CATALOG.resource_card.button_label })).toHaveAttribute(
      'href',
      DOCUMENTATION_CATALOG.resource_card.url
    );
  });
});
