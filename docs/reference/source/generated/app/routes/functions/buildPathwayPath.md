[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / buildPathwayPath

# Function: buildPathwayPath()

> **buildPathwayPath**(`pathway`, `source?`): `string`

Defined in: [src/app/routes.ts:278](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/app/routes.ts#L278)

Builds the canonical detail path for a pathway, optionally scoped to a specific source.

## Parameters

### pathway

`string`

Pathway name to encode into the route.

### source?

`string`

Optional pathway source. The `ALL` source is omitted from the final path.

## Returns

`string`

The encoded pathway detail path.

## Remarks

Source values are normalized to uppercase before encoding so route generation stays consistent
with the route parser and source-aware pathway views.
