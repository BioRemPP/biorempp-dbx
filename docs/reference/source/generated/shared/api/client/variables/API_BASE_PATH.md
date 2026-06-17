[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [shared/api/client](../README.md) / API\_BASE\_PATH

# Variable: API\_BASE\_PATH

> `const` **API\_BASE\_PATH**: `string`

Defined in: [src/shared/api/client.ts:25](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/shared/api/client.ts#L25)

Absolute application-relative prefix for internal API routes.

## Remarks

Feature-level wrappers should prefer this constant indirectly through [apiUrl](../functions/apiUrl.md) unless they
need to assemble a custom `fetch` request manually.
