'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';

export function PerformerNameField() {
  const { register } = useFormContext<WorkLogFormValues>();

  return (
    <FormField name="performerName">
      <FormItem>
        <FormLabel>ФИО исполнителя</FormLabel>
        <FormControl>
          <Input {...register('performerName')} />
        </FormControl>
      </FormItem>
    </FormField>
  );
}
