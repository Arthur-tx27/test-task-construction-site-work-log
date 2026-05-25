'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getWorkLogs } from '@/shared/api/work-log';
import { ITEMS_PER_PAGE } from '@/shared/consts';

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
