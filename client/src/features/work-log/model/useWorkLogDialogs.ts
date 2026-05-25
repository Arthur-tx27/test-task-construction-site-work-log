'use client';

import { useState, useCallback } from 'react';
import type { WorkLogResponse } from '@/shared/types/work-log';

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
