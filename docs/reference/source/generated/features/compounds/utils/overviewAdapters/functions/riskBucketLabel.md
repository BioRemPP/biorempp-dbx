[**BioRemPPDBX Source Reference**](../../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../../README.md) / [features/compounds/utils/overviewAdapters](../README.md) / riskBucketLabel

# Function: riskBucketLabel()

> **riskBucketLabel**(`bucket`): `"High Risk"` \| `"Medium Risk"` \| `"Low Risk"` \| `"Unknown"`

Defined in: [src/features/compounds/utils/overviewAdapters.ts:92](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/compounds/utils/overviewAdapters.ts#L92)

Converts a qualitative toxicity risk bucket into a human-readable label.

## Parameters

### bucket

[`ToxicityRiskBucket`](../../../../toxicity/types/type-aliases/ToxicityRiskBucket.md)

Qualitative toxicity risk bucket.

## Returns

`"High Risk"` \| `"Medium Risk"` \| `"Low Risk"` \| `"Unknown"`

A display label suitable for legends and tooltips.
