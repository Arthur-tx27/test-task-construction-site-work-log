'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { workLogSchema } from '@/shared/validators/work-log-schema';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';
import type { WorkLogResponse } from '@/shared/types/work-log';
import type { WorkType } from '@/shared/types/work-type';
import { useWorkLogCreate, useWorkLogUpdate } from '../model/useWorkLogMutations';
import { DateField } from './form-fields/DateField';
import { WorkTypeField } from './form-fields/WorkTypeField';
import { VolumeUnitFields } from './form-fields/VolumeUnitFields';
import { PerformerNameField } from './form-fields/PerformerNameField';

interface WorkLogFormContentProps {
  workLog?: WorkLogResponse | null;
  workTypes: WorkType[];
  onClose: () => void;
}

function getDefaultValues(workLog?: WorkLogResponse | null): WorkLogFormValues {
  if (workLog) {
    return {
      date: workLog.date,
      workTypeId: workLog.workTypeId,
      volume: workLog.volume,
      unit: workLog.unit as WorkLogFormValues['unit'],
      performerName: workLog.performerName,
    };
  }

  return {
    date: new Date().toISOString().split('T')[0],
    workTypeId: '',
    volume: 0,
    unit: 'м³',
    performerName: '',
  };
}

export function WorkLogFormContent({ workLog, workTypes, onClose }: WorkLogFormContentProps) {
  const isEditing = !!workLog;

  const form = useForm<WorkLogFormValues>({
    resolver: zodResolver(workLogSchema),
    defaultValues: getDefaultValues(workLog),
  });

  useEffect(() => {    
    form.reset(getDefaultValues(workLog));
  }, [workLog, form]);

  const createMutation = useWorkLogCreate(onClose);
  const updateMutation = useWorkLogUpdate(onClose);

  const handleSubmit = form.handleSubmit((values) => {
    if (isEditing && workLog) {
      updateMutation.mutate({ id: workLog.id, dto: values });
    } else {
      createMutation.mutate(values);
    }
  });

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-4">
      <DateField />
      <WorkTypeField workTypes={workTypes} />
      <VolumeUnitFields />
      <PerformerNameField />
      <Button type="submit" disabled={pending} className="w-full cursor-pointer">
        {isEditing ? 'Сохранить' : 'Добавить'}
      </Button>
    </Form>
  );
}
