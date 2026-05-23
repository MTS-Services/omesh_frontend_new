
import { request } from '../../api/request';
import { ENDPOINT } from '../../api/config/endpoints';

// 🔗 API Integration: Fetch Users Data
export const getUsers = async ({ signal } = {}) => {
  return request({
    method: 'GET',
    url: '/api/users',
    signal,
  });
};

export const getBookedUserEvents = async ({ signal } = {}) => {
  const response = await request({
    method: 'GET',
    url: ENDPOINT.PRIVATE.BOOKED_EVENTS,
    signal,
  });

  return response;
};
