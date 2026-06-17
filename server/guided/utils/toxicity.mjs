export function deriveRiskBucketFromValue(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'unknown';
  }
  const numericValue = Number(value);
  if (numericValue >= 0.67) {
    return 'high_risk';
  }
  if (numericValue >= 0.34) {
    return 'medium_risk';
  }
  return 'low_risk';
}
