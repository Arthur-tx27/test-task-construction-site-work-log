'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import type { WorkLogResponse } from '@/shared/types/work-log';

interface DeleteConfirmDialogProps {
  target: WorkLogResponse | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  target,
  pending,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!target) return null;

  const formattedDate = new Date(target.date).toLocaleDateString('ru-RU');

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить запись?</DialogTitle>
          <DialogDescription>
            Запись от {formattedDate} будет
            удалена безвозвратно.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
