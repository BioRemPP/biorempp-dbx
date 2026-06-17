import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, SectionHeader } from '@/shared/ui';
import type { ScientificFoundationsSection as ScientificFoundationsSectionContent } from '@/types/scientificOverview';

interface ScientificFoundationsSectionProps {
  section: ScientificFoundationsSectionContent;
}

export function ScientificFoundationsSection({ section }: ScientificFoundationsSectionProps) {
  return (
    <Card id={section.id}>
      <CardContent className="space-y-6 px-6 py-6">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          descriptionClassName="max-w-none xl:whitespace-nowrap"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {section.terms.map((term) => (
            <div
              key={term.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5 shadow-soft"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-950">{term.label}</h3>
                  <p className="text-sm leading-6 text-slate-600">{term.summary}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Definition</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{term.definition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">BioRemPP DBX relevance</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{term.application}</p>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value={`${term.id}-details`} className="border-b-0">
                    <AccordionTrigger className="py-0 text-sm text-slate-900">
                      Use cases and references
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Use cases</p>
                          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                            {term.use_cases.map((useCase) => (
                              <li key={useCase}>{useCase}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">References</p>
                          <div className="mt-3 space-y-3">
                            {term.references.map((reference) => (
                              <div key={reference.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                <p className="text-sm font-semibold text-slate-950">{reference.title}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  {reference.authors}. {reference.journal} ({reference.year})
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-600">{reference.note}</p>
                                <a
                                  href={reference.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex text-xs font-medium text-accent underline-offset-4 hover:underline"
                                >
                                  Open reference
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
