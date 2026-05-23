import { axiosInstance } from './client';
export const request = async ({ method, url, data, params, signal, headers, timeout }) => {
  const normalizedMethod = String(method || 'GET').toUpperCase();
  const isReadRequest = normalizedMethod === 'GET';
  const mergedHeaders = { ...(headers || {}) };

  if (isReadRequest) {
    mergedHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    mergedHeaders.Pragma = 'no-cache';
    mergedHeaders.Expires = '0';
  }

  const mergedParams = { ...(params || {}) };
  if (isReadRequest) {
    // Prevent browser/proxy cache from serving stale data after mutations.
    mergedParams._ts = Date.now();
  }

  const config = {
    method: normalizedMethod,
    url,
    data,
    params: mergedParams,
    signal,
    headers: mergedHeaders,
    ...(typeof timeout === 'number' ? { timeout } : {}),
  };

  if (data instanceof FormData) {
    delete mergedHeaders['Content-Type'];
    delete mergedHeaders['content-type'];
    config.headers['Content-Type'] = 'multipart/form-data';
    config.transformRequest = [(requestData) => requestData];
  }

  const response = await axiosInstance(config);
  return response.data;
};
