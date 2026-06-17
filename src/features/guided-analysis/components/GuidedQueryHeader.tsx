import { GuidedSummaryCards } from '@/features/guided-analysis/components/GuidedSummaryCards';
import type {
  GuidedExecutionResponse,
  GuidedQueryDefinition,
} from '@/features/guided-analysis/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

interface GuidedQueryHeaderProps {
  query: GuidedQueryDefinition;
  execution: GuidedExecutionResponse | null;
}

export function GuidedQueryHeader({ query, execution }: GuidedQueryHeaderProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl">{query.title}</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{query.question}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <GuidedSummaryCards cards={execution?.summary_cards || []} queryId={query.id} />
      </CardContent>
    </Card>
  );
}
