/**
 * @packageDocumentation
 *
 * Accordion renderer for the detailed Scope and Limitations topics shown inside the home modal.
 */
import { AlertTriangle, CheckCircle2, Info, Scale } from 'lucide-react';
import type { LimitationsModalTopic, LimitationsTone } from '@/types/limitations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from '@/shared/ui';

interface LimitationsTopicAccordionProps {
  /** Ordered topic list loaded from the editorial catalog. */
  topics: LimitationsModalTopic[];
}

function toneCardClassName(tone: LimitationsTone) {
  switch (tone) {
    case 'warning':
      return 'border-amber-200 bg-amber-50/70';
    case 'success':
      return 'border-emerald-200 bg-emerald-50/70';
    case 'info':
      return 'border-blue-200 bg-blue-50/70';
    default:
      return 'border-slate-200 bg-white';
  }
}

function toneBadgeVariant(tone: LimitationsTone) {
  switch (tone) {
    case 'warning':
      return 'warning' as const;
    case 'success':
      return 'success' as const;
    case 'info':
      return 'subtle' as const;
    default:
      return 'outline' as const;
  }
}

function exampleIcon(label: 'incorrect' | 'correct' | 'rationale') {
  switch (label) {
    case 'incorrect':
      return AlertTriangle;
    case 'correct':
      return CheckCircle2;
    default:
      return Info;
  }
}

/**
 * Renders the fixed five-topic accordion used by the limitations modal.
 */
export function LimitationsTopicAccordion({ topics }: LimitationsTopicAccordionProps) {
  return (
    <Accordion type="single" collapsible defaultValue={topics[0]?.id} className="rounded-2xl border border-slate-200 px-5">
      {topics.map((topic) => (
        <AccordionItem key={topic.id} value={topic.id}>
          <AccordionTrigger>{topic.title}</AccordionTrigger>
          <AccordionContent className="space-y-5">
            <p className="text-sm leading-6 text-slate-600">{topic.summary}</p>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {topic.cards.map((card) => (
                <div
                  key={`${topic.id}-${card.title}`}
                  className={`rounded-2xl border px-4 py-4 shadow-soft ${toneCardClassName(card.tone)}`}
                >
                  <div className="space-y-3">
                    <Badge variant={toneBadgeVariant(card.tone)}>{card.title}</Badge>
                    <p className="text-sm leading-6 text-slate-700">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {topic.comparison ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <h4 className="text-sm font-semibold text-emerald-950">{topic.comparison.left_label}</h4>
                  </div>
                  <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-slate-700">
                    {topic.comparison.left_items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-amber-800" />
                    <h4 className="text-sm font-semibold text-amber-950">{topic.comparison.right_label}</h4>
                  </div>
                  <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-slate-700">
                    {topic.comparison.right_items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {topic.examples ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {topic.examples.map((example, index) => (
                  <div key={`${topic.id}-example-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 shadow-soft">
                    <div className="space-y-4">
                      {([
                        ['incorrect', 'Incorrect', example.incorrect],
                        ['correct', 'Correct', example.correct],
                        ['rationale', 'Rationale', example.rationale],
                      ] as const).map(([key, label, value]) => {
                        const Icon = exampleIcon(key);
                        return (
                          <div key={`${label}-${value}`} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-slate-500" />
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {label}
                              </p>
                            </div>
                            <p className="text-sm leading-6 text-slate-700">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
