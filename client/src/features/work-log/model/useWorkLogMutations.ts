'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createWorkLog, updateWorkLog, deleteWorkLog } from '@/shared/api/work-log';
import type { WorkLogFormValues } from '@/shared/validators/work-log-schema';

/**
 * Хук для создания записи журнала.
 * @param onSuccess - Колбэк после успешного создания (закрытие диалога)
 */
export function useWorkLogCreate(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      toast.success('Запись добавлена');
      onSuccess();
    },
    onError: () => toast.error('Ошибка при добавлении записи'),
  });
}

/**
 * Хук для обновления записи журнала.
 * @param onSuccess - Колбэк после успешного обновления (закрытие диалога)
 */
export function useWorkLogUpdate(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: WorkLogFormValues }) => updateWorkLog(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      toast.success('Запись обновлена');
      onSuccess();
    },
    onError: () => toast.error('Ошибка при обновлении записи'),
  });
}

/**
 * Хук для удаления записи журнала.
 * @param onSuccess - Колбэк после успешного удаления (закрытие диалога подтверждения)
 */
export function useWorkLogDelete(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      toast.success('Запись удалена');
      onSuccess();
    },
    onError: () => toast.error('Ошибка при удалении записи'),
  });
}
