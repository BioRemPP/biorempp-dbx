import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UseCaseQueryRecipesModal } from '@/features/guided-analysis/dialogs/UseCaseQueryRecipesModal';

describe('UseCaseQueryRecipesModal', () => {
  it('renders recipe tabs, switches content, and copies the active code block', async () => {
    const user = userEvent.setup();

    render(
      <UseCaseQueryRecipesModal
        content={{
          button_label: 'View Queries',
          title: 'Query Recipes',
          introduction: 'Static reproducibility recipes.',
          recipes: [
            {
              id: 'sqlite_query',
              label: 'SQLite Query',
              description: 'SQLite ranking recipe.',
              language: 'sql',
              runtime: 'sqlite',
              code: 'select * from compound_summary;',
            },
            {
              id: 'python_csv',
              label: 'Python + CSV',
              description: 'CSV ranking recipe.',
              language: 'python',
              runtime: 'csv',
              code: 'print("csv")',
              requirements: ['pandas'],
              input_files: ['biorempp_database_v1.1.0.csv', 'hadeg_db.csv', 'kegg_degradation_db.csv'],
            },
            {
              id: 'r_csv',
              label: 'R + CSV',
              description: 'R recipe.',
              language: 'r',
              runtime: 'csv',
              code: 'print("r")',
            },
          ],
          notes: ['Recipe note'],
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'View Queries' }));

    expect(await screen.findByRole('dialog', { name: 'Query Recipes' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'SQLite Query' })).toHaveAttribute(
      'data-state',
      'active'
    );
    expect(screen.getByText('SQLite ranking recipe.')).toBeInTheDocument();
    expect(screen.getByText('select * from compound_summary;')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Python + CSV' }));

    expect(screen.getByText('CSV ranking recipe.')).toBeInTheDocument();
    expect(screen.getByText('Requirements: pandas')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Input files: biorempp_database_v1.1.0.csv, hadeg_db.csv, kegg_degradation_db.csv'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('print("csv")')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });

    expect(screen.getByText('Recipe note')).toBeInTheDocument();
  });
});
