/**
 * @packageDocumentation
 *
 * Full-page 404 view rendered when the browser navigates to an unrecognized path.
 */
import { Button } from '@shared/ui/button';

interface NotFoundPageProps {
  onBack: () => void;
}

/**
 * Renders a full-page "not found" message for unrecognized application paths.
 *
 * @param props Callback to navigate back to the home view.
 * @returns A centered 404 page with a home navigation action.
 */
export function NotFoundPage({ onBack }: NotFoundPageProps) {
  return (
    <div
      role="main"
      className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <div className="space-y-2">
        <p className="text-5xl font-bold text-slate-200">404</p>
        <p className="text-lg font-semibold text-slate-900">Page not found</p>
        <p className="text-sm text-slate-500">
          The address you requested does not exist in this application.
        </p>
      </div>
      <Button variant="outline" onClick={onBack}>
        Back to Home
      </Button>
    </div>
  );
}
