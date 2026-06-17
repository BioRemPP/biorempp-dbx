# API Reference

Comprehensive technical reference for the BioRemPP Database Explorer frontend runtime contracts, API wrappers, and supporting query semantics.

## Overview

The API reference is organized around the modules that define how the React application talks to the internal backend API, how it resolves client-side navigation, and how it interprets feature-level payloads and query helpers.

This reference is intentionally split into five documentation blocks:

1. `Overview and generation notes`
2. `Core Runtime`
3. `Feature API Wrappers`
4. `Feature Type Contracts`
5. `Supporting API Semantics`

## Reference Structure

### Core Runtime

- `shared/api/client`
- `shared/types`
- `utils/basePath`
- `app/routes`
- `app/navigation`

These modules define the shared HTTP client behavior, pagination contracts, base-path handling, route parsing, and top-level navigation metadata.

### Feature API Wrappers

- `features/compounds/api`
- `features/genes/api`
- `features/pathways/api`
- `features/toxicity/api`
- `features/compound-classes/api`
- `features/guided-analysis/api`
- `features/meta/api`

These wrappers define the request surface that feature pages use to load explorer, detail, and guided-analysis data.

### Feature Type Contracts

- `features/compounds/types`
- `features/genes/types`
- `features/pathways/types`
- `features/toxicity/types`
- `features/compound-classes/types`
- `features/guided-analysis/types`
- `features/meta/types`

These modules explain payload shapes, filters, metadata structures, and response semantics used by the API wrappers.

### Supporting API Semantics

- `features/guided-analysis/utils`
- `features/guided-analysis/recipes/guidedQueryRecipes`
- `features/toxicity/utils/endpointGroups`
- `features/compounds/utils/compoundFilters`
- `features/compounds/utils/overviewAdapters`
- `features/pathways/utils/overviewAdapters`

These modules capture normalization rules, recipe loading, endpoint grouping, and adapter logic that shape how API data is interpreted by the client.

## Navigation Model

Use the left sidebar under `API Reference` to move between module overviews grouped by runtime role.

Each generated module page links to the detailed symbols it exposes, including:

- functions
- exported constants
- interfaces
- exported type aliases where applicable

## Current Scope Notes

This initial reference covers the client-side runtime and frontend-facing API surface only.

It does not yet cover:

- internal backend route implementation in `server/routes/*` (domain routers: compounds, genes, pathways, toxicity, meta, guided) and `server/shared/*` (query helpers, KEGG cache)
- backend OpenAPI contracts
- broader UI component documentation outside the API-reference scope
