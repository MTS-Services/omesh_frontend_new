import { request } from '../../../api/request';

// List fetch korar jonno
export const fetchAdminPayRequests = async ({ status = undefined, page = 1, limit = 10 }) => {
  return await request({
    url: '/api/v1/pay-request/admin/all',
    method: 'GET',
    params: { status, page, limit },
  });
};

// Specific status update korar jonno
export const updatePayRequestStatus = async ({ requestId, status }) => {
  return await request({
    url: `/api/v1/pay-request/admin/${requestId}/status`,
    method: 'PATCH',
    data: { status },
  });
};
