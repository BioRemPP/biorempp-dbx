/**
 * @packageDocumentation
 *
 * Detailed Scope and Limitations dialog for the BioRemPP DBX Service.
 */
import { AlertTriangle, CheckCircle2, Database, FlaskConical } from 'lucide-react';
import type { LimitationsEditorialCatalog, LimitationsTone } from '@/types/limitations';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { LimitationsTopicAccordion } from './LimitationsTopicAccordion';

interface LimitationsDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback used to change dialog open state. */
  onOpenChange: (open: boolean) => void;
  /** Catalog content rendered inside the dialog. */
  content: LimitationsEditorialCatalog;
  /** Callback used to route the footer CTA into the shared Terms dialog. */
  onOpenTerms: () => void;
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

function quickFactIcon(id: string) {
  switch (id) {
    case 'database-derived-evidence':
      return Database;
    case 'not-proof-of-activity':
      return FlaskConical;
    case 'predictive-toxicity-only':
      return AlertTriangle;
    default:
      return CheckCircle2;
  }
}

/**
 * Renders the rich, structured interpretation guidance modal.
 */
export function LimitationsDialog({
  open,
  onOpenChange,
  content,
  onOpenTerms,
}: LimitationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,68rem)]">
        <DialogHeader>
          <DialogTitle>{content.modal.header.title}</DialogTitle>
          <DialogDescription>{content.modal.header.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-4">
          <p className="text-sm leading-6 text-slate-700">{content.modal.header.notice}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.modal.quick_facts.map((fact) => {
            const Icon = quickFactIcon(fact.id);
            return (
              <div
                key={fact.id}
                className={`rounded-2xl border px-4 py-4 shadow-soft ${toneCardClassName(fact.tone)}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-600" />
                    <Badge variant={toneBadgeVariant(fact.tone)}>{fact.title}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{fact.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-950">Interpretation topics</h3>
            <p className="text-sm leading-6 text-slate-600">
              Expand each topic to review the boundaries that matter when DBX outputs are interpreted, reused, or reported.
            </p>
          </div>

          <LimitationsTopicAccordion topics={content.modal.topics} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm leading-6 text-slate-600">{content.modal.footer.text}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onOpenTerms();
            }}
          >
            {content.modal.footer.terms_cta_label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
