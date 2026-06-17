/**
 * @packageDocumentation
 *
 * Modal dialog for browsing and copying reproducible static query recipes associated with a guided
 * analysis use case.
 */
import { useEffect, useId, useState } from 'react';
import { Clipboard, X } from 'lucide-react';
import type { GuidedQueryRecipe } from '@/types/frontConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

/**
 * Props accepted by the guided query recipes modal.
 */
interface UseCaseQueryRecipesModalProps {
  /** Query recipe bundle associated with the selected guided use case. */
  content: GuidedQueryRecipe;
  /** Optional override used by UI-specific variants without mutating the recipe contract. */
  buttonLabelOverride?: string;
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * Renders a dialog that exposes static reproducible query recipes for a guided use case.
 *
 * @param props Recipe bundle associated with the selected guided query.
 * @returns A button that opens the recipes dialog plus the tabbed dialog content when open.
 */
export function UseCaseQueryRecipesModal({ content, buttonLabelOverride }: UseCaseQueryRecipesModalProps) {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState(content.recipes[0]?.id ?? '');
  const titleId = useId();
  const activeRecipe =
    content.recipes.find((recipe) => recipe.id === activeRecipeId) ?? content.recipes[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [open]);

  useEffect(() => {
    if (!copiedKey) {
      return;
    }
    const timer = window.setTimeout(() => setCopiedKey(null), 1400);
    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  useEffect(() => {
    if (!open || !content.recipes[0]) {
      return;
    }
    setActiveRecipeId(content.recipes[0].id);
  }, [content.recipes, open]);

  async function handleCopy() {
    if (!activeRecipe) {
      return;
    }
    try {
      await copyTextToClipboard(activeRecipe.code);
      setCopiedKey(activeRecipe.id);
    } catch (error) {
      console.error('Failed to copy recipe block:', error);
      setCopiedKey(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {buttonLabelOverride ?? content.button_label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-xl border border-gray-200 shadow-xl max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
              <div>
                <h3 id={titleId} className="text-2xl font-semibold text-gray-900">
                  {content.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Reproducible static query recipes for this use case (not filter-synchronized).
                </p>
              </div>
              <button
                type="button"
                aria-label="Close query recipes modal"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-5">
              <p className="text-sm text-gray-700">{content.introduction}</p>

              <Tabs value={activeRecipe?.id} onValueChange={setActiveRecipeId}>
                <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1 text-slate-600">
                  {content.recipes.map((recipe) => (
                    <TabsTrigger
                      key={recipe.id}
                      value={recipe.id}
                      className="border border-transparent bg-transparent data-[state=active]:border-blue-200 data-[state=active]:bg-white data-[state=active]:text-slate-950"
                    >
                      {recipe.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.recipes.map((recipe) => (
                  <TabsContent key={recipe.id} value={recipe.id} className="mt-4">
                    <section className="rounded-lg border border-gray-200 overflow-hidden">
                      <header className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">{recipe.label}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{recipe.description}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {recipe.language.toUpperCase()}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              {recipe.runtime.toUpperCase()}
                            </span>
                          </div>
                          {recipe.requirements && recipe.requirements.length > 0 ? (
                            <p className="text-xs text-gray-600">
                              Requirements: {recipe.requirements.join(', ')}
                            </p>
                          ) : null}
                          {recipe.input_files && recipe.input_files.length > 0 ? (
                            <p className="text-xs text-gray-600">
                              Input files: {recipe.input_files.join(', ')}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Clipboard className="w-4 h-4" />
                          {copiedKey === recipe.id ? 'Copied' : 'Copy'}
                        </button>
                      </header>
                      <pre className="p-4 overflow-x-auto text-xs leading-relaxed bg-gray-950 text-gray-100">
                        <code>{recipe.code}</code>
                      </pre>
                    </section>
                  </TabsContent>
                ))}
              </Tabs>

              {content.notes && content.notes.length > 0 ? (
                <section>
                  <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
                  <ul className="mt-2 space-y-1 list-disc pl-5 text-sm text-gray-700">
                    {content.notes.map((note, idx) => (
                      <li key={`recipe-note-${idx}`}>{note}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md bg-rose-300 text-white font-medium hover:bg-rose-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
