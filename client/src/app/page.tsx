'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { WorkLogTable } from '@/features/work-log/ui/WorkLogTable';
import { WorkLogDialog } from '@/features/work-log/ui/WorkLogDialog';
import type { WorkLogResponse } from '@/shared/types/work-log';

export default function Home() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkLogResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkLogResponse | null>(
    null,
  );

  const handleEdit = (workLog: WorkLogResponse) => {
    setEditTarget(workLog);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditTarget(null);
  };

  return (
    <main className="flex flex-1 flex-col p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Журнал работ</h1>
        <Button onClick={handleAdd}>Добавить запись</Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">Сортировка:</span>
        <Select
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Сначала новые</SelectItem>
            <SelectItem value="asc">Сначала старые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <WorkLogTable
        sortOrder={sortOrder}
        onEdit={handleEdit}
        deleteTarget={deleteTarget}
        onDeleteRequest={setDeleteTarget}
      />

      <WorkLogDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        workLog={editTarget}
      />
    </main>
  );
}
