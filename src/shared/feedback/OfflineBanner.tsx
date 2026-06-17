/**
 * @packageDocumentation
 *
 * App-wide banner shown when the browser reports that the network connection is lost.
 * Disappears automatically when the connection is restored.
 */
import { useEffect, useState } from 'react';

/**
 * Renders a fixed top banner when the browser goes offline.
 *
 * @remarks
 * Listens to `window` `online` and `offline` events and syncs with `navigator.onLine`
 * on mount. Renders nothing when the connection is active.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm font-medium text-amber-700"
    >
      You are currently offline. Some features may not be available.
    </div>
  );
}
