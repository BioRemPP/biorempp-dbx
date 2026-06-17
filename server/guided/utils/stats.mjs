export function percentile(values, p) {
  if (!Array.isArray(values) || values.length === 0) {
    return undefined;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p)));
  return sorted[index];
}

export function quadrantFor(point, xThreshold, yThreshold) {
  const highPotential = point.gene_count >= xThreshold;
  const highRisk = point.y_value >= yThreshold;
  if (highPotential && highRisk) {
    return 'top_right';
  }
  if (!highPotential && highRisk) {
    return 'top_left';
  }
  if (highPotential && !highRisk) {
    return 'bottom_right';
  }
  return 'bottom_left';
}
