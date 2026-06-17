import { ArrowUpRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, Card, CardContent, SectionHeader } from '@/shared/ui';
import type { ScientificMultiomicsSection as ScientificMultiomicsSectionContent } from '@/types/scientificOverview';

interface ScientificMultiomicsSectionProps {
  section: ScientificMultiomicsSectionContent;
}

export function ScientificMultiomicsSection({ section }: ScientificMultiomicsSectionProps) {
  return (
    <Card id={section.id}>
      <CardContent className="space-y-8 px-6 py-6">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          descriptionClassName="max-w-none xl:whitespace-nowrap"
        />

        <div className="surface-muted px-5 py-5">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-950">{section.framework_title}</h3>
            <p className="text-sm leading-6 text-slate-600">{section.framework_description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">Core interoperable identifiers</h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            {section.core_identifiers.map((identifier) => (
              <div key={identifier.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-soft">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-950">{identifier.label}</p>
                  <p className="text-xs leading-5 text-slate-600">{identifier.description}</p>
                  <p className="text-xs font-medium text-accent">Example: {identifier.example}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {identifier.sources.map((source) => (
                      <Badge key={source} variant="secondary">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">Omics layers</h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {section.omics_layers.map((layer) => (
              <div key={layer.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5 shadow-soft">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-slate-950">{layer.label}</h4>
                    <Badge variant={layer.status_tone}>{layer.status_label}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{layer.description}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Key identifiers</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {layer.key_identifiers.map((identifier) => (
                        <Badge key={identifier} variant="outline">
                          {identifier}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">{layer.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">{section.interoperability_title}</h3>
          <p className="text-sm leading-6 text-slate-600">{section.interoperability_description}</p>

          <Accordion type="single" collapsible className="rounded-2xl border border-slate-200 bg-white px-5">
            {section.interoperability_groups.map((group) => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger>{group.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">{group.description}</p>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {group.tools.map((tool) => (
                        <div key={tool.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 shadow-soft">
                          <div className="space-y-3">
                            <p className="text-base font-semibold text-slate-950">{tool.name}</p>
                            <p className="text-sm leading-6 text-slate-600">{tool.summary}</p>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Interoperable IDs</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {tool.interoperable_ids.map((identifier) => (
                                  <Badge key={identifier} variant="outline">
                                    {identifier}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Integration example</p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{tool.integration_example}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <p className="text-sm font-semibold text-slate-950">{tool.reference_title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{tool.reference_citation}</p>
                              <Button asChild variant="outline" size="sm" className="mt-3 w-full justify-between">
                                <a href={tool.reference_url} target="_blank" rel="noopener noreferrer">
                                  Open publication
                                  <ArrowUpRight className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
