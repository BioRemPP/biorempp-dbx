[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / getToxicityEndpointGroupKey

# Function: getToxicityEndpointGroupKey()

> **getToxicityEndpointGroupKey**(`endpoint`): [`ToxicityEndpointGroupKey`](../type-aliases/ToxicityEndpointGroupKey.md)

Defined in: [src/features/toxicity/utils/endpointGroups.ts:177](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L177)

Resolves the configured group key for a toxicity endpoint.

## Parameters

### endpoint

`string`

Raw toxicity endpoint identifier.

## Returns

[`ToxicityEndpointGroupKey`](../type-aliases/ToxicityEndpointGroupKey.md)

The configured group key, or `other` when the endpoint is not part of a named group.
