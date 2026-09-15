'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public routes
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    try {
      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Never crash or block UI
    }
  }, [pathname]);

  return null;
}
