'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/shared/ui/button';
import { getWorkTypes } from '@/shared/api/work-type';
import { WorkLogFilters } from '@/features/work-log/ui/WorkLogFilters';
import { WorkLogTable } from '@/features/work-log/ui/WorkLogTable';
import { WorkLogDialog } from '@/features/work-log/ui/WorkLogDialog';
import { useWorkLogDialogs } from '@/features/work-log/model/useWorkLogDialogs';

export default function Home() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [workTypeId, setWorkTypeId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: workTypes = [] } = useQuery({
    queryKey: ['workTypes'],
    queryFn: getWorkTypes,
    staleTime: 5 * 60 * 1000,
  });

  const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;

  const {
    dialogOpen,
    editTarget,
    deleteTarget,
    handleAdd,
    handleEdit,
    handleCloseDialog,
    handleDeleteRequest,
  } = useWorkLogDialogs();

  return (
    <main className="flex flex-1 min-h-0 flex-col p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Журнал работ</h1>
        <Button onClick={handleAdd}>Добавить запись</Button>
      </div>

      <WorkLogFilters
        workTypes={workTypes}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        workTypeId={workTypeId}
        onWorkTypeIdChange={setWorkTypeId}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />
      <WorkLogTable
        sortOrder={sortOrder}
        workTypeId={workTypeId || undefined}
        date={dateParam}
        onEdit={handleEdit}
        deleteTarget={deleteTarget}
        onDeleteRequest={handleDeleteRequest}
      />
      <WorkLogDialog open={dialogOpen} onClose={handleCloseDialog} workLog={editTarget} />
    </main>
  );
}
