[**BioRemPPDBX Source Reference**](../../../../README.md)

***

[BioRemPPDBX Source Reference](../../../../README.md) / [features/toxicity/api](../README.md) / getToxicityLabels

# Function: getToxicityLabels()

> **getToxicityLabels**(`endpoint?`): `Promise`\<`string`[]\>

Defined in: [src/features/toxicity/api.ts:99](https://github.com/BioRemPP/biorempp-dbx/blob/c3b74e6bc15e0a279c454f33ff1a13cf6bfbc134/src/features/toxicity/api.ts#L99)

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
