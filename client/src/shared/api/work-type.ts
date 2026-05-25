import { apiClient } from './axios-instance';
import type { WorkType } from '../types/work-type';

export const getWorkTypes = async (): Promise<WorkType[]> => {
  const { data } = await apiClient.get<WorkType[]>('/work-type');

  return data;
};
