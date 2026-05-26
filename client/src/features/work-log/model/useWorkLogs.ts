'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getWorkLogs } from '@/shared/api/work-log';
import { ITEMS_PER_PAGE } from '@/shared/consts';

/**
 * Хук для получения списка записей журнала с бесконечной прокруткой.
 * Использует useInfiniteQuery для пагинации: getNextPageParam на основе hasMore.
 *
 * @param sortOrder - Порядок сортировки по дате: 'asc' (старые сверху) | 'desc' (новые сверху)
 * @param workTypeId - Опциональный фильтр по ID вида работ
 * @param date - Опциональный фильтр по дате в формате yyyy-MM-dd
 * @returns Объект InfiniteQuery — data, fetchNextPage, hasNextPage, isLoading и др.
 */
export function useWorkLogs(
  sortOrder: 'asc' | 'desc' = 'desc',
  workTypeId?: string,
  date?: string,
) {
  return useInfiniteQuery({
    queryKey: ['workLogs', sortOrder, workTypeId ?? '', date ?? ''],
    queryFn: ({ pageParam }) =>
      getWorkLogs(pageParam as number, ITEMS_PER_PAGE, sortOrder, workTypeId, date),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? (lastPageParam as number) + 1 : undefined,
  });
}
