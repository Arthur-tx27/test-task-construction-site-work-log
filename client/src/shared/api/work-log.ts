import { apiClient } from './axios-instance';
import type {
  PaginatedWorkLogResponse,
  WorkLogResponse,
  CreateWorkLogDto,
  UpdateWorkLogDto,
} from '../types/work-log';

/**
 * Получить пагинированный список записей журнала.
 * @param page - Номер страницы (начиная с 1)
 * @param limit - Количество записей на странице
 * @param sortOrder - Порядок сортировки по дате: 'asc' | 'desc'
 * @returns { data: WorkLogResponse[], total: number, hasMore: boolean }
 */
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

/**
 * Получить одну запись журнала по ID.
 * @param id - UUID записи
 */
export const getWorkLog = async (id: string): Promise<WorkLogResponse> => {
  const { data } = await apiClient.get<WorkLogResponse>(`/work-log/${id}`);

  return data;
};

/**
 * Создать новую запись журнала.
 * @param dto - Данные для создания
 */
export const createWorkLog = async (
  dto: CreateWorkLogDto,
): Promise<WorkLogResponse> => {
  const { data } = await apiClient.post<WorkLogResponse>('/work-log', dto);

  return data;
};

/**
 * Обновить существующую запись журнала.
 * @param id - UUID записи
 * @param dto - Данные для обновления (все поля опциональны)
 */
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

/**
 * Удалить запись журнала.
 * @param id - UUID записи
 */
export const deleteWorkLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/work-log/${id}`);
};
