'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getWorkLogs } from '@/shared/api/work-log';
import { ITEMS_PER_PAGE } from '@/shared/consts';

/**
 * Хук для получения списка записей журнала с бесконечной прокруткой.
 * Использует useInfiniteQuery для пагинации: getNextPageParam на основе hasMore.
 *
 * @param sortOrder - Порядок сортировки по дате: 'asc' (старые сверху) | 'desc' (новые сверху)
 * @returns Объект InfiniteQuery — data, fetchNextPage, hasNextPage, isLoading и др.
 */
export function useWorkLogs(sortOrder: 'asc' | 'desc' = 'desc') {
  return useInfiniteQuery({
    queryKey: ['workLogs', sortOrder],
    queryFn: ({ pageParam }) =>
      getWorkLogs(pageParam as number, ITEMS_PER_PAGE, sortOrder),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? (lastPageParam as number) + 1 : undefined,
  });
}
