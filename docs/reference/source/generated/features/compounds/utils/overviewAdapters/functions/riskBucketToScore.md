[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / riskBucketToScore

# Function: riskBucketToScore()

> **riskBucketToScore**(`bucket`): `0` \| `0.33` \| `0.66` \| `1`

Defined in: [src/features/compounds/utils/overviewAdapters.ts:79](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/overviewAdapters.ts#L79)

Converts a qualitative toxicity risk bucket into a normalized numeric score.

## Parameters

### bucket

[`ToxicityRiskBucket`](../../../../toxicity/types/type-aliases/ToxicityRiskBucket.md)

Qualitative toxicity risk bucket.

## Returns

`0` \| `0.33` \| `0.66` \| `1`

A score in the range `0..1` used by visualization layers.
