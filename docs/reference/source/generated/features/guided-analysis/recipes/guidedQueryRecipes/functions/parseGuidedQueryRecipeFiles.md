[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/guided-analysis/recipes/guidedQueryRecipes](../README.md) / parseGuidedQueryRecipeFiles

# Function: parseGuidedQueryRecipeFiles()

> **parseGuidedQueryRecipeFiles**(`rawYamlByPath`): `Record`\<`string`, `GuidedQueryRecipe`\>

Defined in: [src/features/guided-analysis/recipes/guidedQueryRecipes.ts:121](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/guided-analysis/recipes/guidedQueryRecipes.ts#L121)

Parses a set of guided-query recipe files indexed by file path.

## Parameters

### rawYamlByPath

`Record`\<`string`, `string`\>

Raw YAML content keyed by import path.

## Returns

`Record`\<`string`, `GuidedQueryRecipe`\>

Guided recipes keyed by inferred query id.

## Throws

Error when a file path does not expose a `.yaml` or `.yml` basename, or when a recipe is invalid.
