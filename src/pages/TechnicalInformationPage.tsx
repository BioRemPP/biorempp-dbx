/**
 * @packageDocumentation
 *
 * Technical Information page that documents the bundled BioRemPP database snapshot, its
 * provenance, and its quality indicators using structured editorial content and derived facts.
 */
import { ArrowRight, DatabaseZap, FileCheck2, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { View } from '@/app/routes';
import { TECHNICAL_INFORMATION_CATALOG } from '@/content/technical-information/catalog';
import { TECHNICAL_INFORMATION_FACTS } from '@/derived/technical-information/technicalInformationFacts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard,
  SectionHeader,
} from '@/shared/ui';

interface TechnicalInformationPageProps {
  /** Route-level navigation callback used by the sidebar action buttons. */
  onNavigateToView: (view: View) => void;
}

interface SectionLink {
  id: string;
  label: string;
}

const NULLABLE_COLUMNS = new Set(['ec', 'reaction', 'reaction_description']);

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value: number) {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}%`;
}

function formatVersionLabel(version: string) {
  return version.toLowerCase().startsWith('v') ? version : `v${version}`;
}

function buildSectionLinks(): SectionLink[] {
  const catalog = TECHNICAL_INFORMATION_CATALOG;
  return [
    { id: 'technical-intro', label: catalog.intro.title },
    { id: 'technical-runtime-delivery', label: catalog.runtime_delivery.title },
    { id: 'technical-build-overview', label: catalog.build_overview.title },
    { id: 'technical-schema-quality', label: catalog.schema_quality.title },
    { id: 'technical-validation', label: catalog.validation.title },
    { id: 'technical-provenance', label: catalog.provenance.title },
    { id: 'technical-limitations', label: catalog.limitations.title },
    { id: 'technical-faq', label: catalog.faq.title },
  ];
}

export function TechnicalInformationPage({ onNavigateToView }: TechnicalInformationPageProps) {
  const catalog = TECHNICAL_INFORMATION_CATALOG;
  const facts = TECHNICAL_INFORMATION_FACTS;
  const sectionLinks = buildSectionLinks();
  const nullableFields = facts.column_completeness.filter((item) => NULLABLE_COLUMNS.has(item.column));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <SectionHeader
            eyebrow={catalog.header.eyebrow}
            title={catalog.header.title}
            description={catalog.header.subtitle}
            action={
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">{formatVersionLabel(facts.database_version)}</Badge>
                <Badge variant="subtle">Generated {facts.generation_date}</Badge>
                <Badge variant="outline">KEGG {facts.kegg_release}</Badge>
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Entries" value={formatInteger(facts.total_entries)} />
            <MetricCard label="Schema Columns" value={formatInteger(facts.total_columns)} />
            <MetricCard label="Unique Compounds" value={formatInteger(facts.unique_compounds)} />
            <MetricCard label="Unique KO Entries" value={formatInteger(facts.unique_ko_entries)} />
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-5 py-4 text-sm leading-6 text-slate-700">
            {catalog.header.intro_note}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="order-2 space-y-6 xl:order-1">
          <section id="technical-intro">
            <Card>
              <CardContent className="space-y-4 px-6 py-6">
                <SectionHeader title={catalog.intro.title} />
                {catalog.intro.paragraphs.map((paragraph, index) => (
                  <p key={`technical-intro-${index}`} className="text-sm leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          </section>

          <section id="technical-runtime-delivery">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader
                  title={catalog.runtime_delivery.title}
                  description={catalog.runtime_delivery.intro}
                  action={<Badge variant="subtle">SQLite runtime</Badge>}
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5">
                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
                    {catalog.runtime_delivery.bullets.map((bullet) => (
                      <li key={bullet.id} className="list-disc pl-1 ml-5">
                        <span className="font-semibold text-slate-950">{bullet.label}: </span>
                        {bullet.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-5">
                  <h3 className="text-base font-semibold text-emerald-950">
                    {catalog.runtime_delivery.recommendation_title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-700">{catalog.runtime_delivery.recommendation}</p>
                </div>

                <p className="text-sm leading-7 text-slate-600">{catalog.runtime_delivery.closing}</p>
              </CardContent>
            </Card>
          </section>

          <section id="technical-build-overview">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader
                  title={catalog.build_overview.title}
                  description={catalog.build_overview.intro}
                  action={<Badge variant="success">Snakemake workflow</Badge>}
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5">
                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
                    {catalog.build_overview.bullets.map((bullet) => (
                      <li key={bullet.id} className="list-disc pl-1 ml-5">
                        <span className="font-semibold text-slate-950">{bullet.label}: </span>
                        {bullet.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm leading-7 text-slate-600">{catalog.build_overview.closing}</p>
              </CardContent>
            </Card>
          </section>

          <section id="technical-schema-quality">
            <Card>
              <CardContent className="space-y-6 px-6 py-6">
                <SectionHeader
                  title={catalog.schema_quality.title}
                  description={catalog.schema_quality.intro}
                  action={<Badge variant="subtle">Snapshot Quality</Badge>}
                />

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-5">
                  <div className="flex items-center gap-2">
                    <DatabaseZap className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-slate-950">Current schema contract</h3>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    The bundled snapshot publishes {formatInteger(facts.total_columns)} ordered columns in a visible
                    contract. Nullable fields remain explicit rather than being backfilled
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facts.column_names.map((column) => (
                      <Badge key={column} variant="outline" className="font-mono">
                        {column}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {nullableFields.map((field) => (
                    <MetricCard
                      key={field.column}
                      label={field.column}
                      value={formatPercent(field.completeness_pct)}
                      hint={`${formatInteger(field.missing_count)} missing values`}
                    />
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 px-5 py-5">
                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
                    {catalog.schema_quality.quality_points.map((point, index) => (
                      <li key={`quality-point-${index}`} className="list-disc pl-1 ml-5">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{catalog.schema_quality.coverage_note}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="technical-validation">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader
                  title={catalog.validation.title}
                  description={catalog.validation.intro}
                  action={<Badge variant="warning">Great Expectations validation</Badge>}
                />

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-slate-950">
                      Validation signals bundled with the app
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
                    {catalog.validation.bullets.map((bullet, index) => (
                      <li key={`validation-bullet-${index}`} className="list-disc pl-1 ml-5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm leading-7 text-slate-600">{catalog.validation.closing}</p>
              </CardContent>
            </Card>
          </section>

          <section id="technical-provenance">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader
                  title={catalog.provenance.title}
                  description={catalog.provenance.intro}
                  action={<Badge variant="success">Traceability</Badge>}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Database Version" value={formatVersionLabel(facts.database_version)} />
                  <MetricCard label="Generated" value={facts.generation_date} valueClassName="text-lg" />
                  <MetricCard label="KEGG Release" value={facts.kegg_release} valueClassName="text-lg" />
                  <MetricCard label="Reference Agencies" value={formatInteger(facts.unique_reference_agencies)} />
                </div>

                <div className="rounded-2xl border border-slate-200 px-5 py-5">
                  <ul className="space-y-3 text-sm leading-6 text-slate-700">
                    {catalog.provenance.bullets.map((bullet, index) => (
                      <li key={`provenance-bullet-${index}`} className="list-disc pl-1 ml-5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm leading-7 text-slate-600">{catalog.provenance.closing}</p>
              </CardContent>
            </Card>
          </section>

          <section id="technical-limitations">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader
                  title={catalog.limitations.title}
                  description={catalog.limitations.intro}
                  action={<Badge variant="danger">Interpretation limits</Badge>}
                />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <Card className="rounded-2xl border-emerald-200 shadow-none">
                    <CardHeader className="border-b border-emerald-100 bg-emerald-50/80">
                      <CardTitle className="flex items-center gap-2 text-emerald-900">
                        <ShieldCheck className="h-5 w-5" />
                        {catalog.limitations.safe_claims_title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 py-5">
                      <ul className="space-y-3 text-sm leading-6 text-slate-700">
                        {catalog.limitations.safe_claims.map((claim, index) => (
                          <li key={`safe-claim-${index}`} className="list-disc pl-1 ml-5">
                            {claim}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-rose-200 shadow-none">
                    <CardHeader className="border-b border-rose-100 bg-rose-50/80">
                      <CardTitle className="flex items-center gap-2 text-rose-900">
                        <ShieldAlert className="h-5 w-5" />
                        {catalog.limitations.avoid_claims_title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 py-5">
                      <ul className="space-y-3 text-sm leading-6 text-slate-700">
                        {catalog.limitations.avoid_claims.map((claim, index) => (
                          <li key={`avoid-claim-${index}`} className="list-disc pl-1 ml-5">
                            {claim}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-sm leading-7 text-slate-600">{catalog.limitations.closing}</p>
              </CardContent>
            </Card>
          </section>

          <section id="technical-faq">
            <Card>
              <CardContent className="space-y-5 px-6 py-6">
                <SectionHeader title={catalog.faq.title} description={catalog.faq.intro} />

                <Accordion type="single" collapsible>
                  {catalog.faq.items.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm leading-6 text-slate-700">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardContent className="space-y-4 px-6 py-6">
              <SectionHeader title={catalog.footer.title} />
              <p className="text-sm leading-7 text-slate-700">{catalog.footer.note}</p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm leading-6 text-slate-600">
                Snapshot stamped from bundled metadata: {facts.database_name} {formatVersionLabel(facts.database_version)},
                generated on {facts.generation_date}, aligned to KEGG {facts.kegg_release}.
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="order-1 space-y-4 xl:sticky xl:top-24 xl:order-2">
          <Card>
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle>{catalog.sidebar.snapshot_title}</CardTitle>
              <p className="text-sm leading-6 text-slate-600">{catalog.sidebar.snapshot_intro}</p>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <dl className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Database</dt>
                  <dd className="text-right font-medium text-slate-950">{facts.database_name}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Version</dt>
                  <dd className="font-medium text-slate-950">{formatVersionLabel(facts.database_version)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Generated</dt>
                  <dd className="font-medium text-slate-950">{facts.generation_date}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">KEGG</dt>
                  <dd className="font-medium text-slate-950">{facts.kegg_release}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Rows</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.total_entries)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Columns</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.total_columns)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Compounds</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.unique_compounds)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">KO entries</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.unique_ko_entries)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Gene symbols</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.unique_gene_symbols)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Enzyme terms</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.unique_enzyme_activities)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Agencies</dt>
                  <dd className="font-medium text-slate-950">{formatInteger(facts.unique_reference_agencies)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle>{catalog.sidebar.quick_nav_title}</CardTitle>
              <p className="text-sm leading-6 text-slate-600">{catalog.sidebar.quick_nav_description}</p>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-4">
              {sectionLinks.map((section) => (
                <Button
                  key={section.id}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-auto w-full items-start justify-start whitespace-normal rounded-xl px-2 py-2 text-left text-sm text-slate-700"
                >
                  <a href={`#${section.id}`}>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="min-w-0 flex-1 break-words leading-5">{section.label}</span>
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle>{catalog.sidebar.actions_title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <Button onClick={() => onNavigateToView('databases')} fullWidth>
                {catalog.sidebar.databases_label}
              </Button>
              <Button variant="outline" onClick={() => onNavigateToView('documentation')} fullWidth>
                {catalog.sidebar.documentation_label}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
