import { request } from '../../../api/request';

const SPONSOR_ENDPOINT = '/api/v1/sponsor-requests';

export const createSponsorRequest = async (data) => {
  return request({
    method: 'POST',
    url: SPONSOR_ENDPOINT,
    data,
  });
};

export const confirmSponsorPayment = async (data) => {
  return request({
    method: 'POST',
    url: `${SPONSOR_ENDPOINT}/wipay/confirm`,
    data,
  });
};

export const deleteSponsorRequest = async (id) => {
  return request({
    method: 'DELETE',
    url: `${SPONSOR_ENDPOINT}/${id}`,
  });
};

export const fetchSponsorRequests = async ({ page = 1, limit = 10, supportType, signal } = {}) => {
  return request({
    method: 'GET',
    url: SPONSOR_ENDPOINT,
    params: { page, limit, ...(supportType ? { supportType } : {}) },
    signal,
  });
};
