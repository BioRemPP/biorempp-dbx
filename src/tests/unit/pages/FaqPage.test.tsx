import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FAQ_CATALOG } from '@/content/faq/catalog';
import { FaqPage } from '@pages/FaqPage';

describe('FaqPage', () => {
  it('renders YAML-driven header actions and section descriptions', async () => {
    const user = userEvent.setup();
    const onNavigateToView = vi.fn();
    const firstSection = FAQ_CATALOG.sections[0];
    const firstHeaderAction = FAQ_CATALOG.header_actions[0];

    render(<FaqPage onNavigateToView={onNavigateToView} />);

    expect(screen.getByText(firstSection.description!)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: firstHeaderAction.label }));
    expect(onNavigateToView).toHaveBeenCalledWith('user-guide');
  });

  it('filters questions by search and shows a no-results state', async () => {
    const user = userEvent.setup();
    const targetItem = FAQ_CATALOG.sections[0].items[0];

    render(<FaqPage onNavigateToView={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Search FAQ...'), targetItem.question);
    expect(screen.getByText(targetItem.answer)).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search FAQ...'));
    await user.type(screen.getByPlaceholderText('Search FAQ...'), 'zzzz-no-faq-match');
    expect(screen.getByText('No matching results')).toBeInTheDocument();
  });

  it('routes internal faq links through onNavigateToView', async () => {
    const user = userEvent.setup();
    const onNavigateToView = vi.fn();
    const targetItem = FAQ_CATALOG.sections[0].items.find((item) => item.id === 'which-page-should-i-start-with');

    render(<FaqPage onNavigateToView={onNavigateToView} />);

    await user.click(screen.getByRole('button', { name: targetItem!.question }));
    await user.click(screen.getByRole('button', { name: 'Open Guided Analysis' }));

    expect(onNavigateToView).toHaveBeenCalledWith('guided-analysis');
  });

  it('renders external faq links as anchors', async () => {
    const user = userEvent.setup();
    const targetItem = FAQ_CATALOG.sections[0].items.find((item) => item.id === 'dbx-vs-biorempp-web-service');

    render(<FaqPage onNavigateToView={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: targetItem!.question }));
    expect(screen.getByRole('link', { name: 'Open BioRemPP Web Service' })).toHaveAttribute(
      'href',
      'https://bioinfo.imd.ufrn.br/biorempp/'
    );
  });
});
