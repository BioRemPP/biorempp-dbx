[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/api](../README.md) / getToxicityLabels

# Function: getToxicityLabels()

> **getToxicityLabels**(`endpoint?`): `Promise`\<`string`[]\>

Defined in: [src/features/toxicity/api.ts:99](https://github.com/DougFelipe/biorempp_database_explorer/blob/3d236acc3c26bfd97f236e50fefcf62d027af605/src/features/toxicity/api.ts#L99)

Fetches toxicity labels, optionally scoped to a specific endpoint.

## Parameters

### endpoint?

`string`

Optional endpoint name used to narrow the returned labels.

## Returns

`Promise`\<`string`[]\>

A list of toxicity labels.

## Throws

Error When the backend request fails.

## Remarks

When `endpoint` is omitted, the backend returns the broader label set exposed by the metadata
route instead of the labels for one endpoint only.
