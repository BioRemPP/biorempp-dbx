/**
 * @packageDocumentation
 *
 * Full-page fallback rendered by the top-level ErrorBoundary when an unhandled
 * JavaScript exception is caught in the component tree.
 */
import { Button } from '@shared/ui/button';

interface AppErrorPageProps {
  errorMessage?: string;
  onNavigateHome: () => void;
}

/**
 * Renders a full-page error fallback for uncaught runtime exceptions.
 *
 * @param props Optional error message and a callback to navigate to the home view.
 * @returns A centered error page with reload and home navigation actions.
 */
export function AppErrorPage({ errorMessage, onNavigateHome }: AppErrorPageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <div className="space-y-2">
        <p className="text-lg font-semibold text-rose-700">Unexpected error</p>
        <p className="text-sm text-slate-600">
          Something went wrong while rendering this page.
        </p>
        {errorMessage ? (
          <p className="text-xs text-slate-400">{errorMessage}</p>
        ) : null}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button variant="outline" onClick={onNavigateHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
