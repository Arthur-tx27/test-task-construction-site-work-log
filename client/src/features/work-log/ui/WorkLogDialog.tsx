'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import type { WorkLogResponse } from '@/shared/types/work-log';
import type { WorkType } from '@/shared/types/work-type';
import { WorkLogFormContent } from './WorkLogFormContent';

interface WorkLogDialogProps {
  open: boolean;
  onClose: () => void;
  workLog?: WorkLogResponse | null;
  workTypes: WorkType[];
}

export function WorkLogDialog({ open, onClose, workLog, workTypes }: WorkLogDialogProps) {
  const isEditing = !!workLog;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать запись' : 'Добавить запись'}</DialogTitle>
        </DialogHeader>
        <WorkLogFormContent workLog={workLog} workTypes={workTypes} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
