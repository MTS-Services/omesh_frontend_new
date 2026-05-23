import { request } from '../../../api/request';

export const fetchTrainingPlansByCategory = async ({ category, signal, params } = {}) => {
  const query = {
    page: 1,
    limit: 10,
    ...(params || {}),
    category,
  };

  const resp = await request({
    method: 'GET',
    url: '/api/v1/training-plans',
    params: query,
    signal,
  });

  // Support paginated response { data: [...], pagination: {...} } or plain array
  if (Array.isArray(resp)) return { items: resp, pagination: null };
  if (Array.isArray(resp?.data)) {
    return { items: resp.data, pagination: resp.pagination ?? null };
  }
  return { items: [], pagination: null };
};

export const fetchTrainingPlanById = async ({ id, signal } = {}) => {
  const resp = await request({
    method: 'GET',
    url: `/api/v1/training-plans/${id}`,
    signal,
  });

  if (resp?.data) return resp.data;
  return resp;
};

export default {
  fetchTrainingPlansByCategory,
  fetchTrainingPlanById,
};
