[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / getToxicityEndpointGroupTitle

# Function: getToxicityEndpointGroupTitle()

> **getToxicityEndpointGroupTitle**(`key`): `string`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:164](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L164)

Resolves the display title for a toxicity endpoint group key.

## Parameters

### key

[`ToxicityEndpointGroupKey`](../type-aliases/ToxicityEndpointGroupKey.md)

Stable toxicity group key.

## Returns

`string`

The configured human-readable title, or `Other` for unknown keys.
