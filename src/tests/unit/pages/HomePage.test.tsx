import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HOME_EDITORIAL_CATALOG } from '@/content/home/catalog';
import { DOWNLOAD_CATALOG } from '@/content/downloads/catalog';
import { LIMITATIONS_EDITORIAL_CATALOG } from '@/content/limitations/catalog';
import { SCIENTIFIC_OVERVIEW_CATALOG } from '@/content/scientific-overview/catalog';
import { TERMS_CATALOG } from '@/content/terms/catalog';
import { HomePage } from '@pages/HomePage';

describe('HomePage', () => {
  it('renders the hero content, navigates to guided analysis, opens hero modals, and shows the highlighted notice area', async () => {
    const user = userEvent.setup();
    const onNavigateToView = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<HomePage onNavigateToView={onNavigateToView} />);

    expect(screen.queryByRole('img', { name: 'BioRemPP logo' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Launch Analysis' })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Terms of Use' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How to Cite' })).toBeInTheDocument();
    expect(screen.getAllByText(HOME_EDITORIAL_CATALOG.hero.access_statement)).toHaveLength(1);
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.hero.notice_lines[0])).toBeInTheDocument();
    expect(screen.queryByText('Free and open')).not.toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Launch Analysis' })[0]);
    expect(onNavigateToView).toHaveBeenCalledWith('guided-analysis');

    await user.click(screen.getByRole('button', { name: 'Terms of Use' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent(
      TERMS_CATALOG.header.title
    );
    await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);

    await user.click(screen.getByRole('button', { name: 'How to Cite' }));
    const howToCiteDialog = await screen.findByRole('dialog');
    expect(howToCiteDialog).toHaveTextContent(HOME_EDITORIAL_CATALOG.hero.modals.how_to_cite.title);
    expect(howToCiteDialog).toHaveTextContent('Database (APA)');
    expect(howToCiteDialog).toHaveTextContent('Database (BibTeX)');
    expect(howToCiteDialog).toHaveTextContent('10.5281/zenodo.18905195');

    const copyButtons = within(howToCiteDialog).getAllByRole('button', { name: 'Copy' });
    expect(copyButtons).toHaveLength(2);
    await user.click(copyButtons[0]);
    expect(writeText).toHaveBeenCalled();
    expect(within(howToCiteDialog).getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('opens the download disclaimer dialog with the selected release', async () => {
    const user = userEvent.setup();
    const targetDownload = DOWNLOAD_CATALOG.items[0];

    render(<HomePage onNavigateToView={vi.fn()} />);

    const disclaimerButtons = screen.getAllByRole('button', {
      name: HOME_EDITORIAL_CATALOG.downloads.disclaimer_title,
    });
    expect(disclaimerButtons).toHaveLength(1);

    await user.click(disclaimerButtons[0]);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(targetDownload.label);
    expect(dialog).not.toHaveTextContent(`Source: ${targetDownload.source}`);
    expect(dialog).not.toHaveTextContent(`Size: ${targetDownload.size}`);
    expect(dialog).not.toHaveTextContent(`Updated: ${targetDownload.updated_at}`);
    expect(dialog).toHaveTextContent('ZIP package');
    expect(dialog).toHaveTextContent('schema reference materials');
    expect(
      screen.getByRole('link', { name: HOME_EDITORIAL_CATALOG.downloads.open_release_label })
    ).toHaveAttribute('href', targetDownload.url);
  });

  it('renders the YAML-driven editorial sections and reveals secondary downloads through the accordion', async () => {
    const user = userEvent.setup();

    render(<HomePage onNavigateToView={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: HOME_EDITORIAL_CATALOG.hero.title })
    ).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.hero.access_statement)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: HOME_EDITORIAL_CATALOG.scientific_overview.title })
    ).toBeInTheDocument();
    expect(screen.getByText(SCIENTIFIC_OVERVIEW_CATALOG.home_cta.title)).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.data_sources.title)).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.data_sources.items[0])).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.target_users.title)).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.target_users.items[0])).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: LIMITATIONS_EDITORIAL_CATALOG.home_component.title })
    ).toBeInTheDocument();

    const browseHeading = screen.getByRole('heading', {
      name: HOME_EDITORIAL_CATALOG.browse_section.title,
    });
    const snapshotHeading = screen.getByRole('heading', {
      name: new RegExp(HOME_EDITORIAL_CATALOG.snapshot.title, 'i'),
    });
    expect(
      browseHeading.compareDocumentPosition(snapshotHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    expect(screen.getByText(HOME_EDITORIAL_CATALOG.browse_section.items[0].label)).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: HOME_EDITORIAL_CATALOG.guided_analysis.title })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(DOWNLOAD_CATALOG.items[1].label)).not.toBeInTheDocument();
    expect(screen.queryByText('Analytical framing')).not.toBeInTheDocument();
    expect(screen.getByText(DOWNLOAD_CATALOG.items[0].label)).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.downloads.primary_description)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: new RegExp(HOME_EDITORIAL_CATALOG.downloads.accordion_title, 'i') })
    );

    expect(screen.getByText(DOWNLOAD_CATALOG.items[1].label)).toBeInTheDocument();
    expect(screen.getByText(DOWNLOAD_CATALOG.items[2].label)).toBeInTheDocument();
    expect(screen.queryByText(DOWNLOAD_CATALOG.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(HOME_EDITORIAL_CATALOG.downloads.primary_description)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: HOME_EDITORIAL_CATALOG.downloads.disclaimer_title })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: new RegExp(HOME_EDITORIAL_CATALOG.downloads.accordion_title, 'i') })
    );

    expect(screen.queryByText(DOWNLOAD_CATALOG.items[1].label)).not.toBeInTheDocument();
    expect(screen.getByText(DOWNLOAD_CATALOG.items[0].label)).toBeInTheDocument();
    expect(screen.getByText(HOME_EDITORIAL_CATALOG.downloads.primary_description)).toBeInTheDocument();
  });

  it('routes the scientific context CTA to the dedicated scientific overview page', async () => {
    const user = userEvent.setup();
    const onNavigateToView = vi.fn();

    render(<HomePage onNavigateToView={onNavigateToView} />);

    await user.click(
      screen.getByRole('button', {
        name: SCIENTIFIC_OVERVIEW_CATALOG.home_cta.button_label,
      })
    );

    expect(onNavigateToView).toHaveBeenCalledWith('scientific-overview');
  });

  it('opens interpretation guidelines modal and routes footer action to Terms of Use modal', async () => {
    const user = userEvent.setup();

    render(<HomePage onNavigateToView={vi.fn()} />);

    await user.click(
      screen.getByRole('button', { name: LIMITATIONS_EDITORIAL_CATALOG.home_component.cta_label })
    );

    const interpretationDialog = await screen.findByRole('dialog');
    expect(interpretationDialog).toHaveTextContent(LIMITATIONS_EDITORIAL_CATALOG.modal.header.title);
    expect(interpretationDialog).toHaveTextContent(LIMITATIONS_EDITORIAL_CATALOG.modal.quick_facts[0].title);
    expect(
      within(interpretationDialog).getByRole('button', {
        name: LIMITATIONS_EDITORIAL_CATALOG.modal.topics[0].title,
      })
    ).toBeInTheDocument();
    expect(
      within(interpretationDialog).getByRole('button', {
        name: LIMITATIONS_EDITORIAL_CATALOG.modal.topics[2].title,
      })
    ).toBeInTheDocument();

    await user.click(
      within(interpretationDialog).getByRole('button', {
        name: LIMITATIONS_EDITORIAL_CATALOG.modal.topics[2].title,
      })
    );

    const firstExample = LIMITATIONS_EDITORIAL_CATALOG.modal.topics[2].examples?.[0];
    expect(firstExample).toBeDefined();
    expect(await screen.findByText(firstExample!.incorrect)).toBeInTheDocument();
    expect(await screen.findByText(firstExample!.correct)).toBeInTheDocument();
    expect(await screen.findByText(firstExample!.rationale)).toBeInTheDocument();

    await user.click(
      within(interpretationDialog).getByRole('button', {
        name: LIMITATIONS_EDITORIAL_CATALOG.modal.footer.terms_cta_label,
      })
    );

    const termsDialog = await screen.findByRole('dialog');
    expect(termsDialog).toHaveTextContent(TERMS_CATALOG.header.title);
  });

  it('renders the three limitations summary cards on the home teaser', () => {
    render(<HomePage onNavigateToView={vi.fn()} />);

    expect(screen.getByText(LIMITATIONS_EDITORIAL_CATALOG.home_component.intro)).toBeInTheDocument();
    LIMITATIONS_EDITORIAL_CATALOG.home_component.summary_cards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.body)).toBeInTheDocument();
    });
  });
});
