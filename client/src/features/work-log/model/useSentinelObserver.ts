'use client';

import { useEffect, useRef } from 'react';

export function useSentinelObserver(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new MutationObserver(() => {
      if (sentinel.isConnected) {
        onIntersect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled]);

  return sentinelRef;
}
