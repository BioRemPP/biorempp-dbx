import type { BadgeProps } from '@/shared/ui';
import type { DatabaseSchemaAccentTone, DatabaseSchemaRecordValue } from '@/types/databases';

const BADGE_VARIANT_MAP: Record<DatabaseSchemaAccentTone, NonNullable<BadgeProps['variant']>> = {
  success: 'success',
  info: 'subtle',
  warning: 'warning',
  danger: 'danger',
};

const OUTLINE_BUTTON_CLASS_MAP: Record<DatabaseSchemaAccentTone, string> = {
  success: 'border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50',
  info: 'border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50',
  warning: 'border-amber-200 text-amber-800 hover:border-amber-300 hover:bg-amber-50',
  danger: 'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50',
};

const SOFT_PANEL_CLASS_MAP: Record<DatabaseSchemaAccentTone, string> = {
  success: 'border-emerald-200 bg-emerald-50/60',
  info: 'border-blue-200 bg-blue-50/70',
  warning: 'border-amber-200 bg-amber-50/70',
  danger: 'border-rose-200 bg-rose-50/70',
};

const TEXT_CLASS_MAP: Record<DatabaseSchemaAccentTone, string> = {
  success: 'text-emerald-700',
  info: 'text-blue-700',
  warning: 'text-amber-800',
  danger: 'text-rose-700',
};

export function getDatabaseAccentBadgeVariant(tone: DatabaseSchemaAccentTone): NonNullable<BadgeProps['variant']> {
  return BADGE_VARIANT_MAP[tone];
}

export function getDatabaseAccentButtonClassName(tone: DatabaseSchemaAccentTone) {
  return OUTLINE_BUTTON_CLASS_MAP[tone];
}

export function getDatabaseAccentPanelClassName(tone: DatabaseSchemaAccentTone) {
  return SOFT_PANEL_CLASS_MAP[tone];
}

export function getDatabaseAccentTextClassName(tone: DatabaseSchemaAccentTone) {
  return TEXT_CLASS_MAP[tone];
}

export function formatDatabaseRecordValue(value: DatabaseSchemaRecordValue) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toLocaleString('en-US') : String(value);
  }
  return value;
}
