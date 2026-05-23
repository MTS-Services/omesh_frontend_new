import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

export const updateEventStatus = async ({ eventId, status }) => {
  return request({
    method: 'PATCH',
    url: ENDPOINT.ADMIN.EVENT_STATUS(eventId),
    data: { status },
  });
};

export const deleteEvent = async ({ eventId }) => {
  return request({
    method: 'DELETE',
    url: ENDPOINT.ADMIN.EVENT_BY_ID(eventId),
  });
};

export const fetchRequestedEvents = async ({
  status = 'PENDING',
  createdAfter = undefined,
  search,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'asc',
  signal,
} = {}) => {
  return request({
    method: 'GET',
    url: ENDPOINT.ADMIN.EVENTS,
    params: {
      status,
      createdAfter,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder,
    },
    signal,
  });
};
