[**BioRemPPDBX Source Reference**](../../../README.md)

***

[BioRemPPDBX Source Reference](../../../README.md) / [app/routes](../README.md) / Route

# Type Alias: Route

> **Route** = \{ `kind`: `"view"`; `view`: [`View`](View.md); \} \| \{ `kind`: `"not_found"`; \} \| \{ `kind`: `"databaseSchema"`; `schemaId`: `DatabaseSchemaId`; \} \| \{ `cpd`: `string`; `kind`: `"compound"`; \} \| \{ `kind`: `"gene"`; `ko`: `string`; \} \| \{ `compoundclass`: `string`; `kind`: `"compoundClass"`; \} \| \{ `kind`: `"pathway"`; `pathway`: `string`; `source?`: `string`; \}

Defined in: [src/app/routes.ts:34](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/app/routes.ts#L34)

Parsed route variants used by the app shell to decide which page or detail view to render.
