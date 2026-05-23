import { request } from '../../../api/request';

export const fetchTrainingCategoriesService = async ({ signal } = {}) => {
  const resp = await request({
    method: 'GET',
    url: '/api/v1/training-plan-category',
    signal,
  });

  // `request` returns response.data from axios; the API wraps payload in `data`
  return Array.isArray(resp?.data) ? resp.data : [];
};

export default {
  fetchTrainingCategoriesService,
};
