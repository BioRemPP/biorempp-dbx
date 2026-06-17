import { ArrowLeft, CalendarDays, Database, Github, Mail } from 'lucide-react';
import { DATABASE_SCHEMAS_INDEX_CATALOG, getDatabaseSchemaCatalog } from '@/content/databases/catalog';
import { InlineStatusBanner } from '@/shared/feedback';
import { cn } from '@/shared/lib/cn';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui';
import type { DatabaseSchemaCatalog, DatabaseSchemaId, DatabaseSchemaRecord } from '@/types/databases';
import {
  formatDatabaseRecordValue,
  getDatabaseAccentBadgeVariant,
  getDatabaseAccentButtonClassName,
  getDatabaseAccentPanelClassName,
  getDatabaseAccentTextClassName,
} from '../presentation';

interface DatabaseSchemaPageProps {
  schemaId: DatabaseSchemaId;
  onOpenSchema: (schemaId: DatabaseSchemaId) => void;
  onOpenIndex: () => void;
}

function formatBoolean(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatKeyList(values?: string[]) {
  return values?.join(', ') || 'Not specified';
}

function GenericRecordTable({
  title,
  records,
}: {
  title: string;
  records: DatabaseSchemaRecord[];
}) {
  const columns = Array.from(new Set(records.flatMap((record) => Object.keys(record))));

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column.replace(/_/g, ' ')}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={`${title}-${index}`}>
              {columns.map((column) => (
                <TableCell key={column}>{record[column] === undefined ? '-' : formatDatabaseRecordValue(record[column])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SupportFooter({ schema }: { schema: DatabaseSchemaCatalog }) {
  return (
    <Card>
      <CardContent className="space-y-4 px-6 py-6">
        <SectionHeader title="Support" description="Questions, corrections, or release issues can be reported through the repository or by email." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <a
            href={schema.contact.github_issues}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700 transition-colors hover:border-slate-300"
          >
            <span className="inline-flex items-center gap-2 font-semibold text-slate-950">
              <Github className="h-4 w-4" />
              GitHub Issues
            </span>
            <span className="mt-2 block break-all text-xs leading-5 text-slate-500">{schema.contact.github_issues}</span>
          </a>
          <a
            href={`mailto:${schema.contact.email}`}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700 transition-colors hover:border-slate-300"
          >
            <span className="inline-flex items-center gap-2 font-semibold text-slate-950">
              <Mail className="h-4 w-4" />
              Email
            </span>
            <span className="mt-2 block break-all text-xs leading-5 text-slate-500">{schema.contact.email}</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function DatabaseSchemaPage({ schemaId, onOpenSchema, onOpenIndex }: DatabaseSchemaPageProps) {
  const schema = getDatabaseSchemaCatalog(schemaId);
  const accentTone = schema.color;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <SectionHeader
            eyebrow="Databases"
            title={
              <span className="inline-flex items-center gap-3">
                <Database className={cn('h-6 w-6', getDatabaseAccentTextClassName(accentTone))} />
                {schema.title}
              </span>
            }
            description={schema.overview.description}
            action={
              <Button variant="outline" onClick={onOpenIndex}>
                <ArrowLeft className="h-4 w-4" />
                All schemas
              </Button>
            }
          />

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={getDatabaseAccentBadgeVariant(accentTone)}>v{schema.version}</Badge>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              Last updated: {schema.last_updated}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-6 py-6">
          <SectionHeader title="Navigate to another schema" description="Switch across the integrated database specifications without leaving the documentation area." />
          <div className="flex flex-wrap gap-2">
            {DATABASE_SCHEMAS_INDEX_CATALOG.databases.map((database) => (
              <Button
                key={database.id}
                variant={database.id === schemaId ? 'subtle' : 'outline'}
                className={database.id === schemaId ? undefined : getDatabaseAccentButtonClassName(database.color)}
                onClick={() => onOpenSchema(database.id)}
              >
                {database.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Overview" description="Design goals and release rationale for the current schema layout." />
          <div className={cn('rounded-2xl border px-4 py-4 text-sm leading-6 text-slate-700', getDatabaseAccentPanelClassName(accentTone))}>
            {schema.overview.description}
          </div>
          <div className="space-y-3">
            {schema.overview.design_rationale.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-soft">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Schema Definition" description="Published file-level structure and transport characteristics." />
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[16rem]">Format</TableHead>
                <TableCell>{schema.schema_definition.format}</TableCell>
              </TableRow>
              {schema.schema_definition.alternative_format ? (
                <TableRow>
                  <TableHead>Alternative Format</TableHead>
                  <TableCell>{schema.schema_definition.alternative_format}</TableCell>
                </TableRow>
              ) : null}
              <TableRow>
                <TableHead>Rows</TableHead>
                <TableCell>{schema.schema_definition.rows.toLocaleString('en-US')}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Columns</TableHead>
                <TableCell>{schema.schema_definition.columns}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Encoding</TableHead>
                <TableCell>{schema.schema_definition.encoding}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Delimiter</TableHead>
                <TableCell>{schema.schema_definition.delimiter}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Text Qualifier</TableHead>
                <TableCell>{schema.schema_definition.text_qualifier}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Header</TableHead>
                <TableCell>{formatBoolean(schema.schema_definition.header)}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Completeness</TableHead>
                <TableCell>{schema.schema_definition.completeness}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Column Specifications" description="Summary table plus per-column details used to inspect semantics, validation, and vocabulary." />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-950">Summary Table</p>
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema.columns.map((column, index) => (
                  <TableRow key={column.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-950">{column.name}</TableCell>
                    <TableCell>{column.type}</TableCell>
                    <TableCell>{formatBoolean(column.nullable)}</TableCell>
                    <TableCell>{column.example || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-950">Column Details</p>
            <Accordion type="multiple">
              {schema.columns.map((column) => (
                <AccordionItem key={column.name} value={column.name}>
                  <AccordionTrigger>
                    {column.name} - {column.description}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Purpose</p>
                          <p className="text-sm leading-6 text-slate-700">{column.purpose}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Validation</p>
                          <div className="mt-2 space-y-1 text-sm text-slate-700">
                            <p>Type: {column.type}</p>
                            <p>Nullable: {formatBoolean(column.nullable)}</p>
                            <p>Controlled vocabulary: {column.controlled_vocabulary === undefined ? 'Not specified' : formatBoolean(column.controlled_vocabulary)}</p>
                            {column.pattern ? <p>Pattern: {column.pattern}</p> : null}
                            {column.regex ? <p>Regex: {column.regex}</p> : null}
                            {column.example ? <p>Example: {column.example}</p> : null}
                            <p>Uniqueness: {column.uniqueness}</p>
                            <p>Cardinality: {column.cardinality.toLocaleString('en-US')}</p>
                          </div>
                        </div>
                      </div>

                      {column.notes && column.notes.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Notes</p>
                          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                            {column.notes.map((note) => (
                              <li key={note}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {column.cross_references && column.cross_references.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Cross References</p>
                          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                            {column.cross_references.map((reference) => (
                              <li key={`${column.name}-${reference.name}`}>
                                {reference.name}
                                {reference.url_pattern ? ` (${reference.url_pattern})` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {column.valid_values ? <GenericRecordTable title="Valid Values" records={column.valid_values} /> : null}
                      {column.top_pathways ? <GenericRecordTable title="Top Pathways" records={column.top_pathways} /> : null}
                      {column.top_families ? <GenericRecordTable title="Top Families" records={column.top_families} /> : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Schema Constraints" description="Key semantics, join assumptions, and relationship patterns used when integrating this schema with the rest of the application." />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Primary Key</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{schema.constraints.primary_key || 'None defined'}</p>
              {schema.constraints.primary_key_note ? (
                <p className="mt-1 text-sm leading-6 text-slate-600">{schema.constraints.primary_key_note}</p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Conceptual Key</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{formatKeyList(schema.constraints.conceptual_key)}</p>
              {schema.constraints.duplicate_rows ? (
                <p className="mt-1 text-sm leading-6 text-slate-600">{schema.constraints.duplicate_rows}</p>
              ) : null}
            </div>
          </div>

          {schema.constraints.foreign_keys && schema.constraints.foreign_keys.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-950">Foreign Keys</p>
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>References</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schema.constraints.foreign_keys.map((foreignKey, index) => (
                    <TableRow key={`${foreignKey.column}-${foreignKey.references}-${index}`}>
                      <TableCell className="font-medium text-slate-950">{foreignKey.column}</TableCell>
                      <TableCell>{foreignKey.references}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {schema.constraints.cardinality_relationships && schema.constraints.cardinality_relationships.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-950">Cardinality Relationships</p>
              <div className="space-y-3">
                {schema.constraints.cardinality_relationships.map((relationship) => (
                  <div key={relationship.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-soft">
                    <p className="text-sm font-semibold text-slate-950">
                      {relationship.name} ({relationship.type})
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{relationship.description}</p>
                    {relationship.example ? <p className="mt-1 text-sm leading-6 text-slate-700">{relationship.example}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Data Quality" description="Completeness, consistency, and provenance signals currently encoded in the schema source." />
          <InlineStatusBanner tone="success">
            <span className="font-semibold">Completeness: {schema.data_quality.completeness.status}</span>
            <span className="block text-sm leading-6">{schema.data_quality.completeness.description}</span>
          </InlineStatusBanner>

          {schema.data_quality.consistency && schema.data_quality.consistency.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-950">Consistency Checks</p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {schema.data_quality.consistency.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {schema.data_quality.accuracy && schema.data_quality.accuracy.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-950">Data Provenance</p>
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schema.data_quality.accuracy.map((entry) => (
                    <TableRow key={`${entry.column}-${entry.source}`}>
                      <TableCell className="font-medium text-slate-950">{entry.column}</TableCell>
                      <TableCell>{entry.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {schema.data_quality.source || schema.data_quality.validation_date ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-6 text-slate-700">
              {schema.data_quality.source ? <p>Source: {schema.data_quality.source}</p> : null}
              {schema.data_quality.validation_date ? <p>Validation date: {schema.data_quality.validation_date}</p> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader title="Usage Examples" description="Loading templates for R and Python plus common inspection queries when they are documented." />

          <Tabs defaultValue="r">
            <TabsList>
              <TabsTrigger value="r">R</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="r">
              <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-xs leading-6 text-slate-100">
                {schema.usage_examples.r}
              </pre>
            </TabsContent>
            <TabsContent value="python">
              <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-xs leading-6 text-slate-100">
                {schema.usage_examples.python}
              </pre>
            </TabsContent>
          </Tabs>

          {schema.usage_examples.common_queries && schema.usage_examples.common_queries.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-950">Common Queries</p>
              <div className="space-y-3">
                {schema.usage_examples.common_queries.map((query) => (
                  <div key={query.description} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-soft">
                    <p className="text-sm font-semibold text-slate-950">{query.description}</p>
                    <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 px-4 py-3 text-xs leading-6 text-slate-100">
                      {query.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <SupportFooter schema={schema} />
    </div>
  );
}
