import { describe, expect, it } from 'vitest';
import {
  TECHNICAL_INFORMATION_FACTS,
  buildTechnicalInformationFacts,
} from '@/derived/technical-information/technicalInformationFacts';

describe('technicalInformationFacts', () => {
  it('derives the current bundled snapshot facts from local metadata artifacts', () => {
    expect(TECHNICAL_INFORMATION_FACTS.total_entries).toBe(123762);
    expect(TECHNICAL_INFORMATION_FACTS.total_columns).toBe(11);
    expect(TECHNICAL_INFORMATION_FACTS.generation_date).toBe('2026-04-05');
    expect(TECHNICAL_INFORMATION_FACTS.kegg_release).toBe('117.0+');
    expect(TECHNICAL_INFORMATION_FACTS.column_names).toHaveLength(11);
    expect(TECHNICAL_INFORMATION_FACTS.row_shapes).toEqual({
      dense: 120651,
      ec_only: 2150,
      reaction_only: 888,
      both_na: 73,
    });
  });

  it('rebuilds the same snapshot facts deterministically', () => {
    expect(buildTechnicalInformationFacts()).toEqual(TECHNICAL_INFORMATION_FACTS);
  });
});
