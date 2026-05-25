'use client';

import { useState, useCallback } from 'react';
import type { WorkLogResponse } from '@/shared/types/work-log';

/**
 * Хук для управления состоянием диалогов журнала работ: добавление, редактирование, удаление.
 * Хранит флаг открытия диалога, текущую редактируемую запись и запись для удаления.
 *
 * @returns Объект с состояниями (dialogOpen, editTarget, deleteTarget)
 *          и обработчиками (handleAdd, handleEdit, handleCloseDialog, handleDeleteRequest)
 */
export function useWorkLogDialogs() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkLogResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkLogResponse | null>(null);

  const handleAdd = useCallback(() => {
    setEditTarget(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((log: WorkLogResponse) => {
    setEditTarget(log);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditTarget(null);
  }, []);

  const handleDeleteRequest = useCallback((log: WorkLogResponse | null) => {
    setDeleteTarget(log);
  }, []);

  return {
    dialogOpen,
    editTarget,
    deleteTarget,
    handleAdd,
    handleEdit,
    handleCloseDialog,
    handleDeleteRequest,
  };
}
