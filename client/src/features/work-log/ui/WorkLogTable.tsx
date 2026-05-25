'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
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
  onEdit: (workLog: WorkLogResponse) => void;
  deleteTarget: WorkLogResponse | null;
  onDeleteRequest: (workLog: WorkLogResponse | null) => void;
}

export function WorkLogTable({
  sortOrder,
  onEdit,
  deleteTarget,
  onDeleteRequest,
}: WorkLogTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useWorkLogs(sortOrder);

  const allRows = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const sentinelRef = useSentinelObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    hasNextPage && !isFetchingNextPage,
  );

  const deleteMutation = useWorkLogDelete(() => onDeleteRequest(null));

  if (isLoading) return <TableSkeleton />;

  if (allRows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
        <p className="text-lg">Нет записей</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
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
              <TableCell>
                {new Date(row.date).toLocaleDateString('ru-RU')}
              </TableCell>
              <TableCell>{row.workType?.name ?? '—'}</TableCell>
              <TableCell>{row.volume} {row.unit}</TableCell>
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
        <div className="py-4 text-center text-muted-foreground text-sm">
          Загрузка...
        </div>
      )}

      <DeleteConfirmDialog
        target={deleteTarget}
        pending={deleteMutation.isPending}
        onCancel={() => onDeleteRequest(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </>
  );
}
