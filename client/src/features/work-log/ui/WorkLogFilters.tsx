'use client';

import { format } from 'date-fns';
import { DatePicker } from '@/shared/ui/date-picker';
import { WorkTypeSelect } from '@/shared/ui/work-type-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import type { WorkType } from '@/shared/types/work-type';

interface WorkLogFiltersProps {
  workTypes: WorkType[];
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  workTypeId: string;
  onWorkTypeIdChange: (value: string) => void;
  selectedDate: Date | undefined;
  onSelectedDateChange: (date: Date | undefined) => void;
}

export function WorkLogFilters({
  workTypes,
  sortOrder,
  onSortOrderChange,
  workTypeId,
  onWorkTypeIdChange,
  selectedDate,
  onSelectedDateChange,
}: WorkLogFiltersProps) {
  const activeFilters: { label: string; onClear: () => void }[] = [];

  if (selectedDate) {
    activeFilters.push({
      label: `Дата: ${format(selectedDate, 'dd.MM.yyyy')}`,
      onClear: () => onSelectedDateChange(undefined),
    });
  }

  if (workTypeId) {
    const wt = workTypes.find((t) => t.id === workTypeId);
    if (wt) {
      activeFilters.push({
        label: `Вид работ: ${wt.name}`,
        onClear: () => onWorkTypeIdChange(''),
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 sm:flex-wrap mb-2">
        <div className="flex flex-col gap-2 sm:contents">
          <div className="flex items-center justify-between sm:inline-flex sm:items-center sm:gap-2 sm:justify-start">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Сортировка:</span>
            <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as 'asc' | 'desc')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>{sortOrder === 'asc' ? 'Сначала старые' : 'Сначала новые'}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="desc">Сначала новые</SelectItem>
                <SelectItem value="asc">Сначала старые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between sm:inline-flex sm:items-center sm:gap-2 sm:justify-start">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Дата:</span>
            <div className="w-[180px]">
              <DatePicker value={selectedDate} onChange={onSelectedDateChange} />
            </div>
          </div>

          <div className="flex items-center justify-between sm:inline-flex sm:items-center sm:gap-2 sm:justify-start">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Вид работ:</span>
            <WorkTypeSelect
              workTypes={workTypes}
              value={workTypeId}
              onChange={onWorkTypeIdChange}
              includeAll
              placeholder="Все виды работ"
              className="w-[180px] sm:w-[220px]"
            />
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap cursor-pointer">
          {activeFilters.map((filter) => (
            <div
              key={filter.label}
              onClick={filter.onClear}
              className="inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground"
            >
              <span>{filter.label}</span>
              <span>✕</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
