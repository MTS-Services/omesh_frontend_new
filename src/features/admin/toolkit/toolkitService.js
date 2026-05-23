import { request } from '../../../api/request';

export const fetchToolkitRequests = async ({ page = 1, limit = 10, signal } = {}) => {
  return request({
    method: 'GET',
    url: '/api/v1/toolkit',
    params: { page, limit },
    signal,
  });
};
