import { apiClient } from './axios-instance';
import type {
  PaginatedWorkLogResponse,
  WorkLogResponse,
  CreateWorkLogDto,
  UpdateWorkLogDto,
} from '../types/work-log';

export const getWorkLogs = async (
  page: number,
  limit: number,
  sortOrder: string,
): Promise<PaginatedWorkLogResponse> => {
  const { data } = await apiClient.get<PaginatedWorkLogResponse>('/work-log', {
    params: { page, limit, sortOrder },
  });

  return data;
};

export const getWorkLog = async (id: string): Promise<WorkLogResponse> => {
  const { data } = await apiClient.get<WorkLogResponse>(`/work-log/${id}`);

  return data;
};

export const createWorkLog = async (
  dto: CreateWorkLogDto,
): Promise<WorkLogResponse> => {
  const { data } = await apiClient.post<WorkLogResponse>('/work-log', dto);

  return data;
};

export const updateWorkLog = async (
  id: string,
  dto: UpdateWorkLogDto,
): Promise<WorkLogResponse> => {
  const { data } = await apiClient.patch<WorkLogResponse>(
    `/work-log/${id}`,
    dto,
  );

  return data;
};

export const deleteWorkLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/work-log/${id}`);
};
