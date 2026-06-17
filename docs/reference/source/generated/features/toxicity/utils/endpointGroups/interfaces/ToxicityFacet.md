[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / ToxicityFacet

# Interface: ToxicityFacet

Defined in: [src/features/toxicity/utils/endpointGroups.ts:40](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L40)

Grouped toxicity facet returned to views that render endpoint sections.

## Properties

### endpoints

> **endpoints**: [`ToxicityFacetEndpoint`](ToxicityFacetEndpoint.md)[]

Defined in: [src/features/toxicity/utils/endpointGroups.ts:52](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L52)

Fully normalized endpoint rows for the facet.

***

### key

> **key**: [`ToxicityEndpointGroupKey`](../type-aliases/ToxicityEndpointGroupKey.md)

Defined in: [src/features/toxicity/utils/endpointGroups.ts:42](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L42)

Stable group key used by the UI and navigation state.

***

### orderedEndpoints

> **orderedEndpoints**: `string`[]

Defined in: [src/features/toxicity/utils/endpointGroups.ts:46](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L46)

Ordered endpoint identifiers contained in the facet.

***

### prediction

> **prediction**: `Record`\<`string`, `number` \| `null`\>

Defined in: [src/features/toxicity/utils/endpointGroups.ts:48](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L48)

Numeric endpoint values keyed by endpoint identifier.

***

### risk

> **risk**: `Record`\<`string`, [`ToxicityHeatmapDatum`](../../../types/interfaces/ToxicityHeatmapDatum.md)\[`"risk_bucket"`\]\>

Defined in: [src/features/toxicity/utils/endpointGroups.ts:50](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L50)

Risk buckets keyed by endpoint identifier.

***

### title

> **title**: `string`

Defined in: [src/features/toxicity/utils/endpointGroups.ts:44](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L44)

Human-readable group title.
