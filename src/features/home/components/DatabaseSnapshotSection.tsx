/**
 * @packageDocumentation
 *
 * Home-page summary card that surfaces the current database metrics snapshot and
 * links users to the full database metrics experience.
 */
import { Database } from 'lucide-react';
import { DATABASE_METRICS_CATALOG } from '@/derived/metrics/databaseMetricsCatalog';
import { Button, Card, CardContent, MetricCard, SectionHeader } from '@/shared/ui';
import type { ReactNode } from 'react';

/**
 * Props accepted by the database snapshot card on the home page.
 */
interface DatabaseSnapshotSectionProps {
  /** Optional eyebrow label shown above the section title. */
  eyebrow?: ReactNode;
  /** Optional title override for the snapshot section. */
  title?: ReactNode;
  /** Optional descriptive text shown below the title. */
  description?: ReactNode;
  /** Label used by the navigation button that opens the full metrics view. */
  actionLabel?: ReactNode;
  /** Callback used to open the database metrics or schema navigation view. */
  onOpenDatabaseMetrics: () => void;
}

/**
 * Renders a compact snapshot of the current BioRemPP database release metrics.
 *
 * @param props Display labels and navigation callback for the snapshot card.
 * @returns A card containing release metadata, core metrics, and highlight metrics.
 */
export function DatabaseSnapshotSection({
  eyebrow = 'Snapshot',
  title = 'Database Snapshot (v1.1.0 metrics)',
  description = 'Quick metric baseline for the current BioRemPP release, aligned with the full metrics documentation.',
  actionLabel = 'View full database metrics',
  onOpenDatabaseMetrics,
}: DatabaseSnapshotSectionProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-6 px-6 py-6">
        <SectionHeader
          eyebrow={eyebrow}
          title={
            <span className="inline-flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              {title}
            </span>
          }
          description={description}
          action={
            <Button variant="outline" onClick={onOpenDatabaseMetrics}>
              {actionLabel}
            </Button>
          }
        />

        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="surface-muted px-4 py-3 text-xs leading-5 text-slate-500">
            <p>{DATABASE_METRICS_CATALOG.metrics_source_label}</p>
            {DATABASE_METRICS_CATALOG.schema_reference_label ? (
              <p>{DATABASE_METRICS_CATALOG.schema_reference_label}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {DATABASE_METRICS_CATALOG.core_metrics.map((metric) => (
              <MetricCard key={metric.id} label={metric.label} value={metric.value} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DATABASE_METRICS_CATALOG.highlight_metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                hint={metric.hint}
                valueClassName="text-lg"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
