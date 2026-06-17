import { USER_GUIDE_CATALOG } from '@/content/user-guide/catalog';
import type { View } from '@/app/routes';
import { Button, Card, CardContent, SectionHeader } from '@/shared/ui';

interface UserGuideIntroCardProps {
  onNavigateToView: (view: View) => void;
}

export function UserGuideIntroCard({ onNavigateToView }: UserGuideIntroCardProps) {
  const guide = USER_GUIDE_CATALOG;

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5 px-6 py-6">
        <SectionHeader
          eyebrow="Documentation"
          title={guide.page_title}
          description={guide.page_subtitle}
          action={
            <Button variant="outline" onClick={() => onNavigateToView('user-guide')}>
              View full user guide
            </Button>
          }
        />

        <div className="space-y-2">
          {guide.workflow.steps.map((step, index) => (
            <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-white text-xs font-bold text-accent">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
