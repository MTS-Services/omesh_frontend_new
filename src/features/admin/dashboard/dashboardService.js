import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

export const fetchAdminStats = async ({ signal } = {}) => {
  return request({ method: 'GET', url: ENDPOINT.ADMIN.STATS, signal });
};

export const fetchAdminSalesCount = async ({ range = 'month', signal } = {}) => {
  return request({
    method: 'GET',
    url: ENDPOINT.ADMIN.SALES_COUNT,
    params: { range },
    signal,
  });
};
