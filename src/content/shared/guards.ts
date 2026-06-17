export function assertNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid config at ${path}: expected non-empty string`);
  }
  return value.trim();
}

export function assertObject(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid config at ${path}: expected object`);
  }
  return value as Record<string, unknown>;
}

export function assertNonEmptyStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid config at ${path}: expected non-empty array`);
  }
  return value.map((entry, index) =>
    assertNonEmptyString(entry, `${path}[${index}]`)
  );
}

export function assertOptionalString(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return assertNonEmptyString(value, path);
}
