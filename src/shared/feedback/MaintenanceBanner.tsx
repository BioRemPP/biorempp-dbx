/**
 * @packageDocumentation
 *
 * App-wide banner shown when the API health check fails on application startup,
 * indicating the backend server is unavailable or under maintenance.
 */
import { useEffect, useState } from 'react';
import { apiUrl } from '../api/client';

/**
 * Renders a fixed top banner when the backend health check fails on mount.
 *
 * @remarks
 * The check is performed once on mount. If `/health` does not respond with `ok: true`
 * the banner persists for the session lifetime. It renders nothing when the API is healthy.
 */
export function MaintenanceBanner() {
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/health'))
      .then((res) => {
        if (!res.ok) setIsDown(true);
      })
      .catch(() => setIsDown(true));
  }, []);

  if (!isDown) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full border-b border-rose-200 bg-rose-50 px-4 py-2.5 text-center text-sm font-medium text-rose-700"
    >
      The application server appears to be unavailable. Data may not load correctly.
    </div>
  );
}
