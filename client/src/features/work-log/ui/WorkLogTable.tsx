'use client';

import { useCallback, useMemo, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { useWorkLogs } from '../model/useWorkLogs';
import { useSentinelObserver } from '../model/useSentinelObserver';
import { useWorkLogDelete } from '../model/useWorkLogMutations';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { TableSkeleton } from './TableSkeleton';
import { COLUMNS } from '../consts';
import type { WorkLogResponse } from '@/shared/types/work-log';

interface WorkLogTableProps {
  sortOrder: 'asc' | 'desc';
  workTypeId?: string;
  date?: string;
  onEdit: (workLog: WorkLogResponse) => void;
  deleteTarget: WorkLogResponse | null;
  onDeleteRequest: (workLog: WorkLogResponse | null) => void;
}

export function WorkLogTable({
  sortOrder,
  workTypeId,
  date,
  onEdit,
  deleteTarget,
  onDeleteRequest,
}: WorkLogTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useWorkLogs(
    sortOrder,
    workTypeId,
    date,
  );

  const allRows = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useSentinelObserver(
    handleIntersect,
    hasNextPage && !isFetchingNextPage,
    containerRef,
  );

  const deleteMutation = useWorkLogDelete(() => onDeleteRequest(null));

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {isLoading ? (
        <TableSkeleton />
      ) : allRows.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center gap-4 text-muted-foreground">
          <p className="text-lg">Нет записей</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-md border [&_[data-slot=table-container]]:!overflow-x-visible"
        >
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
                <TableHead className="w-[140px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{new Date(row.date).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{row.workType?.name ?? '—'}</TableCell>
                  <TableCell>
                    {row.volume} {row.unit}
                  </TableCell>
                  <TableCell>{row.performerName}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                        Ред.
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDeleteRequest(row)}>
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div ref={sentinelRef} className="h-4" />

          {isFetchingNextPage && (
            <div className="py-4 text-center text-muted-foreground text-sm">Загрузка...</div>
          )}
        </div>
      )}

      <DeleteConfirmDialog
        target={deleteTarget}
        pending={deleteMutation.isPending}
        onCancel={() => onDeleteRequest(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
