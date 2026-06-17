import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { USER_GUIDE_CATALOG } from '@/content/user-guide/catalog';
import { UserGuidePage } from '@pages/UserGuidePage';

describe('UserGuidePage', () => {
  it('renders the hero, workflow, quick nav, and all category sections', () => {
    render(<UserGuidePage onNavigateToView={vi.fn()} />);

    expect(screen.getByRole('heading', { name: USER_GUIDE_CATALOG.workflow.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: USER_GUIDE_CATALOG.quick_nav.title })).toBeInTheDocument();
    expect(screen.getByText(USER_GUIDE_CATALOG.closing_note)).toBeInTheDocument();

    USER_GUIDE_CATALOG.categories.forEach((category) => {
      expect(screen.getByRole('heading', { name: category.label })).toBeInTheDocument();
      expect(screen.getAllByText(category.summary).length).toBeGreaterThan(0);
    });

    const quickNav = screen.getByRole('navigation', { name: 'User guide quick navigation' });
    const firstLink = within(quickNav).getAllByRole('link')[0];
    expect(firstLink).toHaveAttribute('href', `#${USER_GUIDE_CATALOG.categories[0].id}`);
  });

  it('routes each category CTA to the expected application view', async () => {
    const user = userEvent.setup();
    const onNavigateToView = vi.fn();

    render(<UserGuidePage onNavigateToView={onNavigateToView} />);

    for (const category of USER_GUIDE_CATALOG.categories) {
      await user.click(screen.getByRole('button', { name: category.cta_label }));
      expect(onNavigateToView).toHaveBeenLastCalledWith(category.target_view);
    }
  });
});
