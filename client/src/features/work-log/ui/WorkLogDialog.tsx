'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import type { WorkLogResponse } from '@/shared/types/work-log';
import { WorkLogFormContent } from './WorkLogFormContent';

interface WorkLogDialogProps {
  open: boolean;
  onClose: () => void;
  workLog?: WorkLogResponse | null;
}

export function WorkLogDialog({ open, onClose, workLog }: WorkLogDialogProps) {
  const isEditing = !!workLog;

  const formKey = open ? (workLog?.id ?? 'add') : 'closed';

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать запись' : 'Добавить запись'}</DialogTitle>
        </DialogHeader>
        <WorkLogFormContent key={formKey} workLog={workLog} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
