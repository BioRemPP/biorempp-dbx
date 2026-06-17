import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CompoundKeggStructureThumbnail } from '@features/compounds/components/CompoundKeggStructureThumbnail';

describe('CompoundKeggStructureThumbnail', () => {
  it('builds the internal KEGG image URL from the compound ID', () => {
    render(<CompoundKeggStructureThumbnail cpd="C00014" />);

    expect(screen.getByRole('img', { name: 'KEGG structure for C00014' })).toHaveAttribute(
      'src',
      '/api/compounds/C00014/kegg-image'
    );
    expect(screen.getByRole('link', { name: 'View From KEGG' })).toHaveAttribute(
      'href',
      'https://www.kegg.jp/entry/C00014'
    );
  });

  it('falls back to the direct KEGG URL when the proxy image fails', () => {
    render(<CompoundKeggStructureThumbnail cpd="C00014" />);

    fireEvent.error(screen.getByRole('img', { name: 'KEGG structure for C00014' }));

    expect(screen.getByRole('img', { name: 'KEGG structure for C00014' })).toHaveAttribute(
      'src',
      'https://rest.kegg.jp/get/C00014/image'
    );
  });

  it('shows a textual fallback after proxy and direct image failures', () => {
    render(<CompoundKeggStructureThumbnail cpd="C00014" />);

    fireEvent.error(screen.getByRole('img', { name: 'KEGG structure for C00014' }));
    fireEvent.error(screen.getByRole('img', { name: 'KEGG structure for C00014' }));

    expect(screen.getByText('KEGG structure unavailable')).toBeInTheDocument();
  });
});
