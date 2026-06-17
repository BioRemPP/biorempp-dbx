import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TERMS_CATALOG } from '@/content/terms/catalog';
import { TermsOfUseDialog } from '@/features/home/components/TermsOfUseDialog';

describe('TermsOfUseDialog', () => {
  it('renders notice, sections, and close action', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<TermsOfUseDialog open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(TERMS_CATALOG.notice.title)).toBeInTheDocument();
    expect(screen.getByText(TERMS_CATALOG.sections[0].title)).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('button', { name: TERMS_CATALOG.footer.close_label })[0]).toBeInTheDocument();

    await user.click(within(dialog).getAllByRole('button', { name: TERMS_CATALOG.footer.close_label })[0]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
