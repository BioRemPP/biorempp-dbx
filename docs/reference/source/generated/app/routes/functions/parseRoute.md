[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / parseRoute

# Function: parseRoute()

> **parseRoute**(`pathname`): [`Route`](../type-aliases/Route.md)

Defined in: [src/app/routes.ts:96](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/app/routes.ts#L96)

Parses a browser pathname into a typed application route.

## Parameters

### pathname

`string`

Browser pathname to resolve.

## Returns

[`Route`](../type-aliases/Route.md)

The parsed route descriptor used by the application shell.

## Remarks

Gene and compound identifiers are normalized to uppercase. Legacy `/visualizations` paths are
mapped to the guided analysis view. Database schema routes are validated against the known schema
identifiers before a typed detail route is returned.
