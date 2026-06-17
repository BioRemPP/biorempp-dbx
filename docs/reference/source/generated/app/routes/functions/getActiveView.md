[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / getActiveView

# Function: getActiveView()

> **getActiveView**(`route`): [`View`](../type-aliases/View.md)

Defined in: [src/app/routes.ts:297](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/app/routes.ts#L297)

Resolves which top-level view should be highlighted for a parsed route.

## Parameters

### route

[`Route`](../type-aliases/Route.md)

Parsed route descriptor.

## Returns

[`View`](../type-aliases/View.md)

The owning top-level view for the route.

## Remarks

Detail routes are mapped back to their explorer parent so the application shell can keep the
correct primary navigation item highlighted.
