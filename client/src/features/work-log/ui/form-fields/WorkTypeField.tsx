'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { WorkTypeSelect } from '@/shared/ui/work-type-select';
import type { WorkType } from '@/shared/types/work-type';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';

interface WorkTypeFieldProps {
  workTypes: WorkType[];
}

export function WorkTypeField({ workTypes }: WorkTypeFieldProps) {
  const { setValue, watch } = useFormContext<WorkLogFormValues>();

  return (
    <FormField name="workTypeId">
      <FormItem>
        <FormLabel>Вид работ</FormLabel>
        <FormControl>
          <WorkTypeSelect
            workTypes={workTypes}
            value={watch('workTypeId')}
            onChange={(v) => setValue('workTypeId', v, { shouldValidate: true })}
            className="w-full"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  );
}
