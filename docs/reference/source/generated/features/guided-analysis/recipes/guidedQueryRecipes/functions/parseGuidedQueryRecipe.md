[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/guided-analysis/recipes/guidedQueryRecipes](../README.md) / parseGuidedQueryRecipe

# Function: parseGuidedQueryRecipe()

> **parseGuidedQueryRecipe**(`rawYaml`, `queryId`): `GuidedQueryRecipe`

Defined in: [src/features/guided-analysis/recipes/guidedQueryRecipes.ts:109](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/recipes/guidedQueryRecipes.ts#L109)

Parses and validates one guided-query recipe file.

## Parameters

### rawYaml

`string`

Raw YAML text loaded from a recipe file.

### queryId

`string`

Query identifier associated with the recipe file.

## Returns

`GuidedQueryRecipe`

A normalized guided-query recipe payload.

## Throws

Error when the YAML payload is missing required fields or contains invalid enum values.
