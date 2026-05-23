import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

const requestWithFallback = async ({ method, paths, data, signal, headers, timeout }) => {
  const candidates = [...new Set(paths)];

  for (let i = 0; i < candidates.length; i += 1) {
    try {
      return await request({
        method,
        url: candidates[i],
        data,
        signal,
        headers,
        timeout,
      });
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const isLast = i === candidates.length - 1;

      if (status !== 404 || isLast) {
        throw error;
      }
    }
  }

  return null;
};

const extractUploadedImages = (response) => {
  const payload = response?.data ?? response;
  const candidates = [
    payload?.images,
    payload?.files,
    payload?.uploaded,
    payload?.data,
    payload?.data?.images,
    payload?.data?.files,
    payload?.result,
    payload?.result?.images,
    payload?.result?.files,
    payload,
  ];

  let collection = candidates.find((item) => Array.isArray(item));

  if (!collection && payload && typeof payload === 'object') {
    const firstArrayValue = Object.values(payload).find((value) => Array.isArray(value));
    if (Array.isArray(firstArrayValue)) {
      collection = firstArrayValue;
    }
  }

  if (!collection) return [];

  return collection
    .map((item) => {
      if (typeof item === 'string') return item;

      return (
        item?.url ||
        item?.path ||
        item?.filePath ||
        item?.fileUrl ||
        item?.location ||
        item?.secure_url ||
        item?.key ||
        item?.src ||
        null
      );
    })
    .filter(Boolean);
};

export const fetchEventsList = async ({
  page = 1,
  limit = 10,
  status = null,
  signal,
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) => {
  const params = Object.fromEntries(
    Object.entries({ page, limit, status, sortBy, sortOrder }).filter(([, v]) => v != null)
  );

  const response = await request({
    method: 'GET',
    url: ENDPOINT.ORGANIZER.EVENTS.LIST,
    params,
    signal,
  });

  return {
    items: response.data ? response.data : [],
    meta: response.meta,
  };
};
//   const params = {
//     page,
//     limit,
//   };

//   if (status && status !== 'all') {
//     params.status = status;
//   }

//   console.log('fetchEventsList - params:', params);

//   const response = await requestWithFallback({
//     method: 'GET',
//     paths: [ENDPOINT.ORGANIZER.EVENTS.LIST, '/api/v1/events'],
//     params,
//     signal,
//   });

//   const payload = response?.data ?? response;

//   console.log('================== params==========:', payload);
//   if (payload?.data && payload?.meta) {
//     return {
//       items: Array.isArray(payload.data) ? payload.data : [],
//       meta: payload.meta,
//     };
//   }

//   if (Array.isArray(payload)) {
//     return { items: payload, meta: { page, limit, total: payload.length, totalPages: 1 } };
//   }
//   if (Array.isArray(payload?.events)) {
//     return {
//       items: payload.events,
//       meta: { page, limit, total: payload.events.length, totalPages: 1 },
//     };
//   }
//   if (Array.isArray(payload?.rows)) {
//     return {
//       items: payload.rows,
//       meta: { page, limit, total: payload.rows.length, totalPages: 1 },
//     };
//   }

//   return { items: [], meta: { page, limit, total: 0, totalPages: 0 } };
// };

export const fetchEventDetails = async (eventId, { signal } = {}) => {
  const response = await request({
    method: 'GET',
    url: `${ENDPOINT.ORGANIZER.EVENTS.DETAILS}/${eventId}`,
    signal,
  });

  return response?.data || response;
};

export const uploadEventImages = async (files, { signal } = {}) => {
  const uploadPath = ENDPOINT.ORGANIZER.UPLOAD.MULTIPLE;
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await requestWithFallback({
    method: 'POST',
    paths: [uploadPath],
    data: formData,
    signal,
    timeout: 30000,
  });

  const images = extractUploadedImages(response);
  if (images.length === 0) {
    throw new Error('Upload response did not contain image references.');
  }

  return images;
};

export const createEventService = async (payload, { signal } = {}) => {
  const response = await request({
    method: 'POST',
    url: ENDPOINT.ORGANIZER.EVENTS.CREATE,
    data: payload,
    signal,
  });

  return response?.data || response;
};

export const updateEventService = async (eventId, payload, { signal } = {}) => {
  const url = `${ENDPOINT.ORGANIZER.EVENTS.DETAILS}/${eventId}`;
  const response = await request({
    method: 'PATCH',
    url,
    data: payload,
    signal,
  });

  return response?.data || response;
};

export const deleteEventService = async (eventId, { signal } = {}) => {
  const url = `${ENDPOINT.ORGANIZER.EVENTS.DETAILS}/${eventId}`;
  const response = await request({
    method: 'DELETE',
    url,
    signal,
  });

  return response?.data || response;
};
