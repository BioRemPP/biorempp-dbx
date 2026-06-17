[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/guided-analysis/recipes/guidedQueryRecipes](../README.md) / parseGuidedQueryRecipe

# Function: parseGuidedQueryRecipe()

> **parseGuidedQueryRecipe**(`rawYaml`, `queryId`): `GuidedQueryRecipe`

Defined in: [src/features/guided-analysis/recipes/guidedQueryRecipes.ts:109](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/guided-analysis/recipes/guidedQueryRecipes.ts#L109)

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
