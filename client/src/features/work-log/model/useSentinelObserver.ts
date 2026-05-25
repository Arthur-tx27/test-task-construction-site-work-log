'use client';

import { useEffect, useRef } from 'react';

/**
 * Хук для обнаружения появления sentinel-элемента в области видимости с помощью IntersectionObserver.
 * Используется для триггера бесконечной прокрутки.
 *
 * @param onIntersect - Функция, вызываемая при попадании sentinel'а в область видимости
 * @param enabled - Если false, наблюдатель не запускается
 * @param rootRef - Ref скролл-контейнера (root для IntersectionObserver)
 * @returns ref для sentinel-элемента
 */
export function useSentinelObserver(
  onIntersect: () => void,
  enabled: boolean,
  rootRef?: React.RefObject<HTMLElement | null>,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 0.1,
        root: rootRef?.current ?? null,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled, rootRef]);

  return sentinelRef;
}
