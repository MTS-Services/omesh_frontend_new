// 🔗 API Integration: Public Events API
import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';
import {
  isValidEventId,
  mapPublicEventDetailsResponse,
  mapPublicEventsListResponse,
} from './eventMapper';

const requestWithFallback = async ({ method, paths, signal }) => {
  const candidates = [...new Set(paths)];

  for (let index = 0; index < candidates.length; index += 1) {
    try {
      return await request({
        method,
        url: candidates[index],
        signal,
      });
    } catch (error) {
      const status = error?.response?.status ?? error?.status;
      const isLast = index === candidates.length - 1;

      if (status !== 404 || isLast) {
        throw error;
      }
    }
  }

  return null;
};

// Fetch public events list
// 🔗 API Integration: Fetch Events List
export const fetchEventsListServices = async ({ signal } = {}) => {
  // Request a larger page size to ensure the website endpoint returns more items
  // (some backends default to 10). Use a high limit so client-side pagination
  // can split into pages of `ITEMS_PER_PAGE` (8).
  const response = await requestWithFallback({
    method: 'GET',
    paths: [
      `${ENDPOINT.PUBLIC.EVENTS.WEBSITE}?limit=1000`,
      '/events/website?limit=1000',
    ],
    signal,
  });

  return mapPublicEventsListResponse(response);
};

// Fetch public event details (finds by id from the list)
// 🔗 API Integration: Fetch Event Details
export const fetchEventDetailsServices = async (eventId, { signal } = {}) => {
  if (!isValidEventId(eventId)) {
    return null;
  }

  try {
    const response = await request({
      method: 'GET',
      url: `${ENDPOINT.PUBLIC.EVENTS.DETAILS_API}/${encodeURIComponent(String(eventId).trim())}`,
      signal,
    });

    return mapPublicEventDetailsResponse(response);
  } catch (error) {
    const status = error?.response?.status ?? error?.status;
    if (status === 404) {
      return null;
    }
    throw error;
  }
};
