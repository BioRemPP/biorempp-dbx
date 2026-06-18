[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/guided-analysis/recipes/guidedQueryRecipes](../README.md) / getGuidedQueryRecipe

# Function: getGuidedQueryRecipe()

> **getGuidedQueryRecipe**(`queryId`): `GuidedQueryRecipe` \| `undefined`

Defined in: [src/features/guided-analysis/recipes/guidedQueryRecipes.ts:163](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/recipes/guidedQueryRecipes.ts#L163)

Resolves the recipe definition associated with a guided-query id.

## Parameters

### queryId

`string`

Guided-query identifier.

## Returns

`GuidedQueryRecipe` \| `undefined`

The configured recipe definition, or `undefined` when no recipe exists for the query.
