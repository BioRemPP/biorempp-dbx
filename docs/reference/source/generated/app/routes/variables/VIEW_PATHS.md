[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / VIEW\_PATHS

# Variable: VIEW\_PATHS

> `const` **VIEW\_PATHS**: `Record`\<[`View`](../type-aliases/View.md), `string`\>

Defined in: [src/app/routes.ts:50](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/app/routes.ts#L50)

Canonical relative paths for each top-level application view.

## Remarks

These paths are application-relative. Use [resolveAppPath](../functions/resolveAppPath.md) when a deployment-aware path is
required for browser history or rendered links.
