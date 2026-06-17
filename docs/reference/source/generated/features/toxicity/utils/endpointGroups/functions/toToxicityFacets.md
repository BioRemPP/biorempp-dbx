[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/toxicity/utils/endpointGroups](../README.md) / toToxicityFacets

# Function: toToxicityFacets()

> **toToxicityFacets**(`rows`): [`ToxicityFacet`](../interfaces/ToxicityFacet.md)[]

Defined in: [src/features/toxicity/utils/endpointGroups.ts:229](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/utils/endpointGroups.ts#L229)

Groups heatmap rows into ordered toxicity facets for UI consumption.

## Parameters

### rows

[`ToxicityHeatmapDatum`](../../../types/interfaces/ToxicityHeatmapDatum.md)[]

Endpoint-level toxicity rows returned by a detail or overview payload.

## Returns

[`ToxicityFacet`](../interfaces/ToxicityFacet.md)[]

Ordered facet sections containing normalized endpoint labels, values, and risk metadata.

## Remarks

Unknown endpoints are assigned to the `other` facet. Known endpoints preserve the order declared in
`TOXICITY_ENDPOINT_GROUPS`, while unknown endpoints fall back to alphabetical sorting by formatted label.
