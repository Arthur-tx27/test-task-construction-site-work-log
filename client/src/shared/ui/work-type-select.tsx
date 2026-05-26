'use client';

import type { WorkType } from '@/shared/types/work-type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface WorkTypeSelectProps {
  workTypes: WorkType[];
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  placeholder?: string;
  className?: string;
}

const ALL_OPTION_VALUE = '';

export function WorkTypeSelect({
  workTypes,
  value,
  onChange,
  includeAll = false,
  placeholder = 'Выберите вид работ',
  className,
}: WorkTypeSelectProps) {
  const items = [
    ...(includeAll ? [{ value: ALL_OPTION_VALUE, label: 'Все виды работ' }] : []),
    ...workTypes.map((wt) => ({ value: wt.id, label: wt.name })),
  ];

  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(v ?? '')}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {includeAll && <SelectItem value={ALL_OPTION_VALUE}>Все виды работ</SelectItem>}
        {workTypes.map((wt) => (
          <SelectItem key={wt.id} value={wt.id}>
            {wt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
