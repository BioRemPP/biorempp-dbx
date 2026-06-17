import { ArrowDownRight } from 'lucide-react';
import { Button, Card, CardContent, SectionHeader } from '@/shared/ui';

interface ScientificOverviewQuickNavProps {
  title: string;
  description: string;
  items: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

export function ScientificOverviewQuickNav({
  title,
  description,
  items,
}: ScientificOverviewQuickNavProps) {
  return (
    <Card>
      <CardContent className="space-y-6 px-6 py-6">
        <SectionHeader eyebrow="Navigation" title={title} description={description} />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Button
              key={item.id}
              asChild
              variant="outline"
              size="lg"
              className="h-auto justify-start whitespace-normal rounded-2xl px-4 py-4 text-left"
            >
              <a href={`#${item.id}`}>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <ArrowDownRight className="h-4 w-4 text-accent" />
                    {item.label}
                  </div>
                  <p className="text-xs leading-5 text-slate-600">{item.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
