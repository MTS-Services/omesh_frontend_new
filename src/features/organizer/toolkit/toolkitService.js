import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

const TOOLKIT_ENDPOINT = '/api/v1/toolkit';

const extractUploadedUrls = (response) => {
  if (Array.isArray(response?.data)) return response.data.filter(Boolean);
  if (Array.isArray(response)) return response.filter(Boolean);
  return [];
};

export const uploadToolkitImages = async (files, { signal } = {}) => {
  const validFiles = Array.isArray(files) ? files.filter(Boolean) : [];
  if (validFiles.length === 0) return [];

  const formData = new FormData();
  validFiles.forEach((file) => {
    formData.append('images', file);
  });

  const response = await request({
    method: 'POST',
    url: ENDPOINT.ORGANIZER.UPLOAD.MULTIPLE,
    data: formData,
    signal,
    timeout: 30000,
  });

  const urls = extractUploadedUrls(response);
  if (urls.length === 0) {
    throw new Error('Upload response did not contain image URLs.');
  }

  return urls;
};

export const submitToolkitRequest = async (payload, { signal } = {}) => {
  const designImageUrls = Array.isArray(payload.designImageUrls)
    ? payload.designImageUrls.filter(Boolean)
    : [];

  const parsedQuantity = parseInt(
    String(payload.quantity ?? '')
      .replace(/,/g, '')
      .trim(),
    10
  );
  if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    const err = new Error('quantity must be greater than or equal to 1');
    err.status = 422;
    throw err;
  }
  const quantity = parsedQuantity;

  const response = await request({
    method: 'POST',
    url: TOOLKIT_ENDPOINT,
    data: {
      eventName: String(payload.eventName ?? '').trim(),
      eventDate: String(payload.eventDate ?? '').trim(),
      quantity,
      designImageUrls,
      needsDesignHelp: Boolean(payload.needsDesignHelp),
      fullName: String(payload.fullName ?? '').trim(),
      email: String(payload.email ?? '').trim(),
      phone: String(payload.phone ?? '').trim(),
    },
    signal,
  });

  return response;
};
