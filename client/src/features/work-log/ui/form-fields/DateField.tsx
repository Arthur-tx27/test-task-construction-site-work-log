'use client';

import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { DatePicker } from '@/shared/ui/date-picker';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';

export function DateField() {
  const { setValue, watch } = useFormContext<WorkLogFormValues>();
  const selectedDate = watch('date');

  return (
    <FormField name="date">
      <FormItem>
        <FormLabel>Дата</FormLabel>
        <FormControl>
          <DatePicker
            value={selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined}
            onChange={(date) =>
              setValue('date', date ? format(date, 'yyyy-MM-dd') : '', { shouldValidate: true })
            }
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  );
}
