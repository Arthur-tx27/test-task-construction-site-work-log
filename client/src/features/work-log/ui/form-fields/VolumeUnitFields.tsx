'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ALLOWED_UNITS } from '@/shared/consts';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';

export function VolumeUnitFields() {
  const { register, setValue, watch } = useFormContext<WorkLogFormValues>();

  return (
    <div className="flex gap-4">
      <FormField name="volume">
        <FormItem className="flex-1">
          <FormLabel>Объём</FormLabel>
          <FormControl>
            <Input type="number" step="any" {...register('volume', { valueAsNumber: true })} />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="unit">
        <FormItem className="w-[120px]">
          <FormLabel>Ед. изм.</FormLabel>
          <Select
            onValueChange={(v) =>
              setValue('unit', v as WorkLogFormValues['unit'], { shouldValidate: true })
            }
            value={watch('unit')}
          >
            <FormControl>
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {ALLOWED_UNITS.map((u) => (
                <SelectItem key={u} value={u} className="cursor-pointer">
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  );
}
