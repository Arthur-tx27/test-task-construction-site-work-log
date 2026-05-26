export interface WorkLogResponse {
  id: string;
  date: string;
  workTypeId: string;
  volume: number;
  unit: string;
  performerName: string;
  createdAt: string;
  updatedAt: string;
  workType?: {
    id: string;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export type PaginatedWorkLogResponse = PaginatedResponse<WorkLogResponse>;

export interface CreateWorkLogDto {
  date: string;
  workTypeId: string;
  volume: number;
  unit: string;
  performerName: string;
}

export interface UpdateWorkLogDto {
  date?: string;
  workTypeId?: string;
  volume?: number;
  unit?: string;
  performerName?: string;
}
