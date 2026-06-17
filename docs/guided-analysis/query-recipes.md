# Query Recipes

Guided query recipes are reproducibility aids for users who want to inspect or re-run the analytical logic outside the browser. In the current implementation they are exposed through the `View Queries` modal rendered beside the use-case description accordion.

## Purpose

Recipe bundles provide static, human-readable examples of how a guided use case can be reproduced against the BioRemPP database snapshot. They are suitable for:

- auditing the canonical aggregation logic used by a guided use case
- re-running a query locally against the SQLite database
- adapting a use case into scripts for offline review or benchmarking
- documenting reproducible exploratory workflows in methods supplements

## Where the Recipes Come From

The current recipe system is fully frontend-bundled.

- Loader: `src/features/guided-analysis/recipes/guidedQueryRecipes.ts`
- Recipe files: `src/features/guided-analysis/recipes/yaml/*.yaml`
- Modal UI: `src/features/guided-analysis/dialogs/UseCaseQueryRecipesModal.tsx`

Each YAML file is keyed to one guided `query_id`. The loader validates the recipe bundle and exposes it to the page when that query is selected.

## Current Bundled Formats

The loader can validate a broader recipe vocabulary than the current catalog uses.

| Aspect | Supported by loader | Currently bundled in UC1-UC8 |
| --- | --- | --- |
| Languages | `sql`, `python`, `r` | `sql`, `python` |
| Runtimes | `sqlite`, `csv` | `sqlite` |
| Delivery pattern | Multiple tabs per query | Two tabs per query: `SQLite Query` and `Python + SQLite` |

Current bundled recipes therefore document the canonical SQLite-oriented workflow, not CSV-first reconstruction.

## How to Use the Recipe Modal

1. Open `/guided-analysis` and select a use case.
2. Expand `View Use Case Description` if you also want the narrative context.
3. Click `View Queries`.
4. Choose the recipe tab that matches your preferred environment.
5. Review the runtime, language, requirements, and optional input-file notes.
6. Copy the code block and adapt it to the database release you are using.

## Interpretation Boundaries

The current modal states an important limitation explicitly: recipes are `not filter-synchronized`.

In practice this means:

- recipe tabs are static full-scope reproducibility examples
- the active UI filters are not injected into the recipe text
- a copied recipe may reproduce the canonical use case logic without reproducing the exact current browser scope
- recipe outputs can diverge from the visible table if you changed filters, thresholds, or pagination in the UI

## What the Recipes Are Good For

- verifying the joins and aggregations behind a guided use case
- demonstrating the canonical data model used by the query
- building offline checks against the same SQLite schema
- supporting reviewer-facing reproducibility notes

## What the Recipes Are Not

- they are not a live export of the exact current browser state
- they are not a substitute for the guided API contract
- they do not reproduce client-side behaviors such as pagination controls, stale-result refresh banners, or query-selector state
- they should not be treated as regulatory or experimental protocols

## Limitations

- Recipe bundles can lag behind future query-definition changes if the YAMLs are not updated in the same release.
- The current bundled recipes target the BioRemPP SQLite-oriented runtime and assume the integrated schema used by the application.
- Query recipes summarize analytical logic, but they do not carry the visual interpretation guidance that appears in the UI accordion.
- For UC8 specifically, the page-scoped visual alignment used by the browser is a client behavior, not a property of the recipe files.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Output Interpretation](output-interpretation.md)
- [API Reference Overview](../api/index.md)
