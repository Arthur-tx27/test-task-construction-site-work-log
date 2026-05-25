'use client';

import { useEffect, useRef } from 'react';

/**
 * Хук для обнаружения появления sentinel-элемента в DOM с помощью MutationObserver.
 * Используется для триггера бесконечной прокрутки.
 * Вместо scroll-событий (частые) — MutationObserver, срабатывающий один раз при вставке sentinel'а.
 *
 * @param onIntersect - Функция, вызываемая при появлении sentinel'а в DOM
 * @param enabled - Если false, наблюдатель не запускается
 * @returns ref для sentinel-элемента
 */
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
