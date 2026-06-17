import { ArrowUpRight } from 'lucide-react';
import { Badge, Button, Card, CardContent, SectionHeader } from '@/shared/ui';
import type { ScientificBioremediationSection as ScientificBioremediationSectionContent } from '@/types/scientificOverview';

interface ScientificBioremediationSectionProps {
  section: ScientificBioremediationSectionContent;
}

export function ScientificBioremediationSection({ section }: ScientificBioremediationSectionProps) {
  return (
    <Card id={section.id}>
      <CardContent className="space-y-8 px-6 py-6">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          descriptionClassName="max-w-none xl:whitespace-nowrap"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">FAIR data principles</h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            {section.fair_principles.map((principle) => (
              <div
                key={principle.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5 shadow-soft"
              >
                <div className="space-y-3">
                  <p className="text-base font-semibold text-slate-950">{principle.label}</p>
                  <p className="text-sm leading-6 text-slate-600">{principle.description}</p>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    {principle.implementations.map((implementation) => (
                      <li key={implementation}>{implementation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">{section.integrated_databases_title}</h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {section.integrated_databases.map((database) => (
              <div key={database.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-soft">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-slate-950">{database.name}</h4>
                    <Badge variant="outline">{database.type}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{database.description}</p>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    {database.data_points.map((dataPoint) => (
                      <li key={dataPoint}>{dataPoint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-950">{section.resources_title}</h3>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {section.resources.map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5 shadow-soft">
                <div className="space-y-3">
                  <p className="text-base font-semibold text-slate-950">{resource.title}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">{resource.focus}</p>
                  <p className="text-sm leading-6 text-slate-600">{resource.relevance}</p>
                  <p className="text-xs leading-5 text-slate-500">
                    {resource.authors}. {resource.journal} ({resource.year})
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full justify-between">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Open publication
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
