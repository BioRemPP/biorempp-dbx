import { describe, expect, it } from 'vitest';
import {
  GUIDED_QUERY_RECIPES_CATALOG,
  getGuidedQueryRecipe,
  parseGuidedQueryRecipe,
  parseGuidedQueryRecipeFiles,
} from '@/features/guided-analysis/recipes/guidedQueryRecipes';

const CANONICAL_RECIPE_YAML = `
button_label: View Queries
title: UC-1 Query Recipes (Top Bioremediation Compounds)
introduction: Reproduce the ranking used in UC-1 using the same canonical compound_summary table.
recipes:
  - id: sqlite_query
    label: SQLite Query
    description: Top compounds by KO count with deterministic tie-break.
    language: sql
    runtime: sqlite
    code: |-
      SELECT cpd
      FROM compound_summary
      ;
  - id: python_csv
    label: Python + CSV
    description: Rebuild UC-1 from raw CSV inputs.
    language: python
    runtime: csv
    requirements:
      - pandas
    input_files:
      - biorempp_database_v1.1.0.csv
      - hadeg_db.csv
      - kegg_degradation_db.csv
    code: |-
      print("csv")
notes:
  - This recipe is exploratory.
`;

const MISSING_RECIPES_YAML = `
button_label: View Queries
title: UC-1 Query Recipes (Top Bioremediation Compounds)
introduction: Reproduce the ranking used in UC-1 using the same canonical compound_summary table.
notes:
  - This recipe is exploratory.
`;

const DUPLICATED_RECIPE_ID_YAML = `
button_label: View Queries
title: UC-1 Query Recipes (Top Bioremediation Compounds)
introduction: Reproduce the ranking used in UC-1 using the same canonical compound_summary table.
recipes:
  - id: sqlite_query
    label: SQLite Query
    description: Top compounds by KO count with deterministic tie-break.
    language: sql
    runtime: sqlite
    code: |-
      SELECT cpd
      FROM compound_summary
      ;
  - id: sqlite_query
    label: Python + CSV
    description: Rebuild UC-1 from raw CSV inputs.
    language: python
    runtime: csv
    code: |-
      print("csv")
`;

describe('guidedQueryRecipes', () => {
  it('parses a standalone guided query recipe file in the canonical recipes[] format', () => {
    const recipe = parseGuidedQueryRecipe(
      CANONICAL_RECIPE_YAML,
      'uc1_top_bioremediation_compounds'
    );

    expect(recipe.button_label).toBe('View Queries');
    expect(recipe.recipes).toHaveLength(2);
    expect(recipe.recipes[0].id).toBe('sqlite_query');
    expect(recipe.recipes[0].code).toContain('compound_summary');
    expect(recipe.recipes[1].requirements).toEqual(['pandas']);
    expect(recipe.recipes[1].input_files).toEqual([
      'biorempp_database_v1.1.0.csv',
      'hadeg_db.csv',
      'kegg_degradation_db.csv',
    ]);
    expect(recipe.notes).toEqual(['This recipe is exploratory.']);
  });

  it('rejects invalid standalone recipe files when required recipe fields are missing', () => {
    expect(() =>
      parseGuidedQueryRecipe(
        CANONICAL_RECIPE_YAML.replace('button_label: View Queries\n', ''),
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/recipe files\.uc1_top_bioremediation_compounds\.button_label/);

    expect(() =>
      parseGuidedQueryRecipe(
        CANONICAL_RECIPE_YAML.replace('    language: sql\n', ''),
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/recipe files\.uc1_top_bioremediation_compounds\.recipes\[0\]\.language/);

    expect(() =>
      parseGuidedQueryRecipe(
        CANONICAL_RECIPE_YAML.replace('    runtime: sqlite\n', ''),
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/recipe files\.uc1_top_bioremediation_compounds\.recipes\[0\]\.runtime/);

    expect(() =>
      parseGuidedQueryRecipe(
        CANONICAL_RECIPE_YAML.replace('    code: |-\n      SELECT cpd\n      FROM compound_summary\n      ;\n', ''),
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/recipe files\.uc1_top_bioremediation_compounds\.recipes\[0\]\.code/);

    expect(() =>
      parseGuidedQueryRecipe(MISSING_RECIPES_YAML, 'uc1_top_bioremediation_compounds')
    ).toThrow(/recipe files\.uc1_top_bioremediation_compounds\.recipes: expected non-empty array/);
  });

  it('rejects empty or duplicated canonical recipes', () => {
    expect(() =>
      parseGuidedQueryRecipe(
        CANONICAL_RECIPE_YAML.replace(
          /recipes:\n(?:  - .+\n|\s+.+\n)+notes:/m,
          'recipes: []\nnotes:'
        ),
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/recipes: expected non-empty array/);

    expect(() =>
      parseGuidedQueryRecipe(
        DUPLICATED_RECIPE_ID_YAML,
        'uc1_top_bioremediation_compounds'
      )
    ).toThrow(/duplicated id/);
  });

  it('derives query ids from individual file paths', () => {
    const recipes = parseGuidedQueryRecipeFiles({
      './yaml/uc1_top_bioremediation_compounds.yaml': CANONICAL_RECIPE_YAML,
    });

    expect(Object.keys(recipes)).toEqual(['uc1_top_bioremediation_compounds']);
    expect(recipes.uc1_top_bioremediation_compounds.title).toContain('UC-1');
  });

  it('loads modular query recipes directly from the canonical catalog', () => {
    const recipe = getGuidedQueryRecipe('uc2_most_toxic_compounds');

    expect(recipe).toBeDefined();
    expect(recipe?.title).toBe('UC-2 Query Recipes (Most Toxic Compounds)');
    expect(recipe?.recipes).toHaveLength(2);
    expect(recipe?.recipes.map((entry) => entry.id)).toEqual(['sqlite_query', 'python_sqlite']);
    expect(recipe?.recipes[0].code).toContain('toxicity_endpoint');
  });

  it('exports the full modular catalog with all use-case query ids', () => {
    expect(GUIDED_QUERY_RECIPES_CATALOG.version).toBe('v1');
    expect(GUIDED_QUERY_RECIPES_CATALOG.note ?? '').toContain(
      'static full-scope reproducibility examples'
    );
    expect(Object.keys(GUIDED_QUERY_RECIPES_CATALOG.queries).sort()).toEqual([
      'uc1_top_bioremediation_compounds',
      'uc2_most_toxic_compounds',
      'uc3_risk_vs_bioremediation_potential',
      'uc4_regulated_by_agency',
      'uc5_pathways_functional_coverage',
      'uc6_pathways_toxic_compounds',
      'uc7_genes_most_connected',
      'uc8_genes_linked_toxic_compounds',
    ]);
    expect(
      GUIDED_QUERY_RECIPES_CATALOG.queries.uc1_top_bioremediation_compounds.recipes
    ).toHaveLength(2);
    expect(
      GUIDED_QUERY_RECIPES_CATALOG.queries.uc7_genes_most_connected.recipes.map(
        (recipe) => recipe.label
      )
    ).toEqual(['SQLite Query', 'Python + SQLite']);
  });
});
