import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, SectionHeader } from '@/shared/ui';
import type { ScientificDataScienceSection as ScientificDataScienceSectionContent } from '@/types/scientificOverview';

interface ScientificDataScienceSectionProps {
  section: ScientificDataScienceSectionContent;
}

export function ScientificDataScienceSection({ section }: ScientificDataScienceSectionProps) {
  return (
    <Card id={section.id}>
      <CardContent className="space-y-6 px-6 py-6">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          descriptionClassName="max-w-none xl:whitespace-nowrap"
        />

        <Accordion type="single" collapsible className="rounded-2xl border border-slate-200 bg-white px-5">
          {section.categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger>{category.title}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  <p className="text-sm leading-6 text-slate-600">{category.summary}</p>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Methods</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                        {category.methods.map((method) => (
                          <li key={method}>{method}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">BioRemPP DBX applications</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                        {category.applications.map((application) => (
                          <li key={application}>{application}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">References</p>
                    <div className="mt-3 space-y-3">
                      {category.references.map((reference) => (
                        <div key={reference.id} className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
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
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
