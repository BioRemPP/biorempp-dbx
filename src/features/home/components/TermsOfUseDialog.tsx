/**
 * @packageDocumentation
 *
 * Reusable Terms of Use dialog rendered from the YAML-driven terms catalog.
 */
import { AlertTriangle, CheckCircle2, FileWarning, Info } from 'lucide-react';
import { TERMS_CATALOG } from '@/content/terms/catalog';
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui';

interface TermsOfUseDialogProps {
  /** Whether the dialog is currently open. */
  open: boolean;
  /** Callback invoked when the dialog open state changes. */
  onOpenChange: (open: boolean) => void;
}

function toneClasses(tone?: string) {
  switch (tone) {
    case 'warning':
      return 'border-amber-200 bg-amber-50';
    case 'success':
      return 'border-emerald-200 bg-emerald-50';
    case 'info':
      return 'border-sky-200 bg-sky-50';
    default:
      return 'border-slate-200 bg-white';
  }
}

function toneIcon(tone?: string) {
  switch (tone) {
    case 'warning':
      return AlertTriangle;
    case 'success':
      return CheckCircle2;
    case 'info':
      return Info;
    default:
      return FileWarning;
  }
}

/**
 * Long-form terms dialog reused by the home hero and limitations footer CTA.
 */
export function TermsOfUseDialog({ open, onOpenChange }: TermsOfUseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,56rem)]">
        <DialogHeader>
          <DialogTitle>{TERMS_CATALOG.header.title}</DialogTitle>
          <DialogDescription>{TERMS_CATALOG.header.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="text-sm font-semibold text-amber-900">{TERMS_CATALOG.notice.title}</p>
          <p className="mt-2 text-sm leading-6 text-amber-900">{TERMS_CATALOG.notice.body}</p>
        </div>

        <div className="space-y-4">
          {TERMS_CATALOG.sections.map((section, index) => {
            const Icon = toneIcon(section.tone);
            return (
              <section
                key={section.id}
                className={`rounded-2xl border px-4 py-4 ${toneClasses(section.tone)}`}
              >
                <div className="flex items-start gap-3">
                  <Badge className="mt-0.5 shrink-0">{index + 1}</Badge>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-600" />
                      <h4 className="text-sm font-semibold text-slate-950">{section.title}</h4>
                    </div>

                    {section.paragraphs ? (
                      <div className="space-y-2">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="text-sm leading-6 text-slate-700">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    {section.bullets ? (
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm leading-6 text-emerald-950">{TERMS_CATALOG.footer.text}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {TERMS_CATALOG.footer.close_label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
