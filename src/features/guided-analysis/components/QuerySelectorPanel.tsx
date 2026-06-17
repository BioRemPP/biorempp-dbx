/**
 * @packageDocumentation
 *
 * Sidebar query selector used to group and switch guided analysis use cases.
 */
import type { GuidedCategory, GuidedQueryDefinition } from '@/features/guided-analysis/types';

/**
 * Props accepted by the guided query selector panel.
 */
interface QuerySelectorPanelProps {
  /** Ordered category groups returned by the guided catalog. */
  categories: GuidedCategory[];
  /** Guided queries available for selection. */
  queries: GuidedQueryDefinition[];
  /** Identifier of the currently selected query. */
  selectedId: string;
  /** Callback invoked when the user selects a different guided query. */
  onSelect: (queryId: string) => void;
}

/**
 * Renders the guided query selector grouped by catalog category.
 *
 * @param props Categories, query list, current selection, and selection callback.
 * @returns A sidebar panel containing category-grouped guided query buttons.
 */
export function QuerySelectorPanel({ categories, queries, selectedId, onSelect }: QuerySelectorPanelProps) {
  return (
    <aside aria-label="Guided queries" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Guided Queries</h3>
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryQueries = queries.filter((query) => query.category === category.id);
          if (categoryQueries.length === 0) {
            return null;
          }

          return (
            <div key={category.id} className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category.label}</h4>
              <div className="space-y-2">
                {categoryQueries.map((query) => {
                  const isActive = query.id === selectedId;
                  return (
                    <button
                      key={query.id}
                      onClick={() => onSelect(query.id)}
                      aria-pressed={isActive}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{query.title}</p>
                        {isActive ? (
                          <p className="max-h-10 overflow-hidden text-xs leading-5 text-slate-600">
                            {query.description}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
