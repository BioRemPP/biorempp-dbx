[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/guided-analysis/recipes/guidedQueryRecipes](../README.md) / getGuidedQueryRecipe

# Function: getGuidedQueryRecipe()

> **getGuidedQueryRecipe**(`queryId`): `GuidedQueryRecipe` \| `undefined`

Defined in: [src/features/guided-analysis/recipes/guidedQueryRecipes.ts:163](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/recipes/guidedQueryRecipes.ts#L163)

Resolves the recipe definition associated with a guided-query id.

## Parameters

### queryId

`string`

Guided-query identifier.

## Returns

`GuidedQueryRecipe` \| `undefined`

The configured recipe definition, or `undefined` when no recipe exists for the query.
