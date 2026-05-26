import type { WorkLog, WorkType } from '@prisma/client';
import type { WorkLogResponse } from '../types/work-log.types';
import type { AllowedUnit } from '../consts';

/**
 * Преобразует сущность Prisma в DTO ответа.
 */
export function mapWorkLogToResponse(
  workLog: WorkLog & { workType?: WorkType | null },
): WorkLogResponse {
  return {
    id: workLog.id,
    date: workLog.date.toISOString().split('T')[0],
    workTypeId: workLog.workTypeId,
    volume: workLog.volume,
    unit: workLog.unit as AllowedUnit,
    performerName: workLog.performerName,
    createdAt: workLog.createdAt.toISOString(),
    updatedAt: workLog.updatedAt.toISOString(),
    workType: workLog.workType
      ? {
          id: workLog.workType.id,
          name: workLog.workType.name,
        }
      : undefined,
  };
}
