[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / TOXICITY\_ENDPOINT\_GROUPS

# Variable: TOXICITY\_ENDPOINT\_GROUPS

> `const` **TOXICITY\_ENDPOINT\_GROUPS**: [`ToxicityEndpointGroupDefinition`](../interfaces/ToxicityEndpointGroupDefinition.md)[]

Defined in: [src/features/toxicity/utils/endpointGroups.ts:187](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/utils/endpointGroups.ts#L187)

Public snapshot of the configured endpoint groups in display order.

## Remarks

Each group's `endpoints` array is cloned from the internal definitions to avoid leaking mutable references.
