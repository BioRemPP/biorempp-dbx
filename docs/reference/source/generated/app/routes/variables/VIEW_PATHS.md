[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / VIEW\_PATHS

# Variable: VIEW\_PATHS

> `const` **VIEW\_PATHS**: `Record`\<[`View`](../type-aliases/View.md), `string`\>

Defined in: [src/app/routes.ts:50](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/app/routes.ts#L50)

Canonical relative paths for each top-level application view.

## Remarks

These paths are application-relative. Use [resolveAppPath](../functions/resolveAppPath.md) when a deployment-aware path is
required for browser history or rendered links.
