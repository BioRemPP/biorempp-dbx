/**
 * @packageDocumentation
 *
 * Database documentation landing page that summarizes integrated schemas and exposes
 * navigation into each detailed schema document.
 */
import { ArrowRight, Database, ExternalLink, Github, Mail } from 'lucide-react';
import { DATABASE_SCHEMAS_INDEX_CATALOG } from '@/content/databases/catalog';
import { cn } from '@/shared/lib/cn';
import {
  Badge,
  Button,
  Card,
  CardContent,
  SectionHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import type { DatabaseSchemaId } from '@/types/databases';
import {
  getDatabaseAccentBadgeVariant,
  getDatabaseAccentButtonClassName,
  getDatabaseAccentPanelClassName,
} from '../presentation';

/**
 * Props accepted by the databases overview page.
 */
interface DatabasesPageProps {
  /** Callback used to open the selected schema detail route. */
  onOpenSchema: (schemaId: DatabaseSchemaId) => void;
}

const OVERVIEW_ITEMS = [
  { label: 'Formal Specs', field: 'formal_specs' },
  { label: 'Validation Rules', field: 'validation_rules' },
  { label: 'Cross References', field: 'cross_references' },
  { label: 'Usage Examples', field: 'usage_examples' },
] as const;

/**
 * Formats a boolean value using the textual convention used in the tables on this page.
 *
 * @param value Boolean value to format.
 * @returns `True` or `False`.
 */
function formatBoolean(value: boolean) {
  return value ? 'True' : 'False';
}

/**
 * Summary card used to open one database schema from the documentation overview page.
 */
function DatabaseSummaryCard({
  schemaId,
  onOpenSchema,
}: {
  /** Schema identifier displayed by the summary card. */
  schemaId: DatabaseSchemaId;
  /** Callback used to open the schema detail route. */
  onOpenSchema: (schemaId: DatabaseSchemaId) => void;
}) {
  const entry = DATABASE_SCHEMAS_INDEX_CATALOG.databases.find((database) => database.id === schemaId);
  if (!entry) {
    return null;
  }

  return (
    <Card className="rounded-2xl shadow-soft">
      <CardContent className="space-y-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge variant={getDatabaseAccentBadgeVariant(entry.color)}>{entry.name}</Badge>
            <p className="text-sm leading-6 text-slate-700">{entry.focus}</p>
          </div>
          <Database className="h-5 w-5 text-slate-400" />
        </div>

        <div className={cn('rounded-2xl border px-4 py-3 text-sm text-slate-700', getDatabaseAccentPanelClassName(entry.color))}>
          <p>
            <span className="font-semibold text-slate-950">{entry.rows.toLocaleString('en-US')}</span> rows x{' '}
            <span className="font-semibold text-slate-950">{entry.columns}</span> columns
          </p>
          <p className="mt-1">
            Join key: <span className="font-semibold text-slate-950">{entry.join_key}</span>
          </p>
        </div>

        <Button
          variant="outline"
          className={cn('w-full justify-between', getDatabaseAccentButtonClassName(entry.color))}
          onClick={() => onOpenSchema(entry.id)}
        >
          View schema
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Renders the database documentation overview page for the integrated BioRemPP source datasets.
 *
 * @param props Schema navigation contract for the current route.
 * @returns Overview cards, comparison tables, and support links for schema documentation.
 */
export function DatabasesPage({ onOpenSchema }: DatabasesPageProps) {
  const catalog = DATABASE_SCHEMAS_INDEX_CATALOG;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <SectionHeader
            eyebrow="Databases"
            title={catalog.title}
            description={catalog.subtitle}
            action={<Badge variant="subtle">{catalog.databases.length} datasets</Badge>}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {catalog.databases.map((database) => (
              <div key={database.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">{database.name}</p>
                  <Badge variant={getDatabaseAccentBadgeVariant(database.color)}>{database.join_key}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{database.focus}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Quick Navigation" description="Open each schema and compare the integrated database footprint." />

          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead>Database</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead>Join Key</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.databases.map((database) => (
                <TableRow key={database.id}>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto px-0 py-0 text-sm font-semibold text-slate-950"
                      onClick={() => onOpenSchema(database.id)}
                    >
                      {database.name}
                    </Button>
                  </TableCell>
                  <TableCell>{database.rows.toLocaleString('en-US')}</TableCell>
                  <TableCell>{database.columns}</TableCell>
                  <TableCell>{database.focus}</TableCell>
                  <TableCell>
                    <Badge variant={getDatabaseAccentBadgeVariant(database.color)}>{database.join_key}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="What Each Schema Contains" description="The schema layer captures structure, validation, cross-references, and practical loading examples." />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {OVERVIEW_ITEMS.map((item) => (
              <div key={item.field} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-soft">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{catalog.overview[item.field]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <SectionHeader eyebrow="Documentation" title="Database Summaries" description="Schema-oriented snapshots for each database integrated into the current BioRemPP release." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {catalog.databases.map((database) => (
            <DatabaseSummaryCard key={database.id} schemaId={database.id} onOpenSchema={onOpenSchema} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 px-6 py-6">
            <SectionHeader eyebrow="Schema" title="Integration Architecture" description={catalog.integration.description} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {catalog.integration.join_points.map((joinPoint) => {
                const dbEntries = joinPoint.databases.map((name) =>
                  catalog.databases.find((d) => d.name === name)
                );
                return (
                  <div
                    key={`${joinPoint.key}-${joinPoint.databases.join('-')}`}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Join key</p>
                      <p className="font-mono text-xl font-bold text-slate-950">{joinPoint.key}</p>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">{joinPoint.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {dbEntries.map((entry) =>
                        entry ? (
                          <Badge key={entry.id} variant={getDatabaseAccentBadgeVariant(entry.color)}>
                            {entry.name}
                          </Badge>
                        ) : null
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 px-6 py-6">
            <SectionHeader eyebrow="Schema" title="Common File Format" description="Shared delivery expectations across the published database files." />

            <div className="divide-y divide-slate-100">
              {[
                { label: 'Format', value: catalog.file_format.format },
                { label: 'Delimiter', value: catalog.file_format.delimiter },
                { label: 'Encoding', value: catalog.file_format.encoding },
                { label: 'Header', value: formatBoolean(catalog.file_format.header) },
                { label: 'Text Qualifier', value: catalog.file_format.text_qualifier },
                { label: 'Completeness', value: catalog.file_format.completeness },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                  <p className="text-right text-sm text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Support and References" description="Documentation links and support channels for schema review or issue reporting." />

          {catalog.related_docs && catalog.related_docs.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {catalog.related_docs.map((doc) => (
                <Button key={doc.title} asChild variant="outline">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.title}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <a
              href={catalog.contact.github_issues}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700 transition-colors hover:border-slate-300"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-slate-950">
                <Github className="h-4 w-4" />
                GitHub Issues
              </span>
              <span className="mt-2 block break-all text-xs leading-5 text-slate-500">{catalog.contact.github_issues}</span>
            </a>
            <a
              href={`mailto:${catalog.contact.email}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700 transition-colors hover:border-slate-300"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-slate-950">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <span className="mt-2 block break-all text-xs leading-5 text-slate-500">{catalog.contact.email}</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
