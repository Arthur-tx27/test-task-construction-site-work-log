'use client';

import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { getWorkTypes } from '@/shared/api/work-type';
import { workLogSchema } from '@/shared/validators/work-log-schema';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';
import { ALLOWED_UNITS } from '@/shared/consts';
import type { WorkLogResponse } from '@/shared/types/work-log';
import { useWorkLogCreate, useWorkLogUpdate } from '../model/useWorkLogMutations';

interface WorkLogDialogProps {
  open: boolean;
  onClose: () => void;
  workLog?: WorkLogResponse | null;
}

export function WorkLogDialog({ open, onClose, workLog }: WorkLogDialogProps) {
  const isEditing = !!workLog;

  const { data: workTypes = [] } = useQuery({
    queryKey: ['workTypes'],
    queryFn: getWorkTypes,
  });

  const form = useForm<WorkLogFormValues>({
    resolver: zodResolver(workLogSchema),
    defaultValues: {
      date: workLog?.date ?? new Date().toISOString().split('T')[0],
      workTypeId: workLog?.workTypeId ?? '',
      volume: workLog?.volume ?? 0,
      unit: (workLog?.unit as WorkLogFormValues['unit']) ?? 'м³',
      performerName: workLog?.performerName ?? '',
    },
  });

  const { register, handleSubmit: handleFormSubmit, setValue, watch } = form;

  const createMutation = useWorkLogCreate(onClose);
  const updateMutation = useWorkLogUpdate(onClose);

  const handleSubmit = handleFormSubmit((values) => {
    if (isEditing && workLog) {
      updateMutation.mutate({ id: workLog.id, dto: values });
    } else {
      createMutation.mutate(values);
    }
  });

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать запись' : 'Добавить запись'}
          </DialogTitle>
        </DialogHeader>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <FormField name="date">
            <FormItem>
              <FormLabel>Дата</FormLabel>
              <FormControl>
                <Input type="date" {...register('date')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="workTypeId">
            <FormItem>
              <FormLabel>Вид работ</FormLabel>
              <Select
                onValueChange={(v) => setValue('workTypeId', v ?? '', { shouldValidate: true })}
                value={watch('workTypeId')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вид работ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workTypes.map((wt) => (
                    <SelectItem key={wt.id} value={wt.id}>{wt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <div className="flex gap-4">
            <FormField name="volume">
              <FormItem className="flex-1">
                <FormLabel>Объём</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...register('volume', { valueAsNumber: true })} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="unit">
              <FormItem className="w-[120px]">
                <FormLabel>Ед. изм.</FormLabel>
                <Select
                  onValueChange={(v) => setValue('unit', v as WorkLogFormValues['unit'], { shouldValidate: true })}
                  value={watch('unit')}
                >
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALLOWED_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="performerName">
            <FormItem>
              <FormLabel>ФИО исполнителя</FormLabel>
              <FormControl>
                <Input {...register('performerName')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" disabled={pending} className="w-full">
            {isEditing ? 'Сохранить' : 'Добавить'}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
