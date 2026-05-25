import type { AllowedUnit } from '../consts';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface WorkLogResponse {
  id: string;
  date: string;
  workTypeId: string;
  volume: number;
  unit: AllowedUnit;
  performerName: string;
  createdAt: string;
  updatedAt: string;
  workType?: {
    id: string;
    name: string;
  };
}

export type PaginatedWorkLogResponse = PaginatedResponse<WorkLogResponse>;
