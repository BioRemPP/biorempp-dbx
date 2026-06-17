# Source Reference

This section contains the generated TypeDoc reference for the current API-reference baseline.

## Included Module Groups

### Core Runtime

- `src/shared/api/client.ts`
- `src/shared/types.ts`
- `src/utils/basePath.ts`
- `src/app/routes.ts`
- `src/app/navigation.ts`

### Feature API Wrappers

- `src/features/*/api.ts`

### Feature Type Contracts

- `src/features/compound-classes/types.ts`
- `src/features/compounds/types.ts`
- `src/features/genes/types.ts`
- `src/features/guided-analysis/types.ts`
- `src/features/meta/types.ts`
- `src/features/pathways/types.ts`
- `src/features/toxicity/types.ts`

### Supporting API Semantics

- `src/features/guided-analysis/utils.ts`
- `src/features/guided-analysis/recipes/guidedQueryRecipes.ts`
- `src/features/toxicity/utils/endpointGroups.ts`
- `src/features/compounds/utils/compoundFilters.ts`
- `src/features/compounds/utils/overviewAdapters.ts`
- `src/features/pathways/utils/overviewAdapters.ts`

## Generation Notes

- Source comments are written in English using `TSDoc`.
- Reference pages are generated with `TypeDoc`.
- Generated Markdown is emitted into `docs/reference/source/generated/`.
- The MkDocs navigation exposes module overview pages only; symbol pages stay reachable from the generated module pages.

## Build Commands

- `npm run docs:reference`
- `npm run docs:build`
- `npm run docs:serve`
