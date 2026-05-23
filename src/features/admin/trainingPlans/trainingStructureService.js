import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

export const fetchTrainingStructures = async ({ page = 1, limit = 10, signal } = {}) => {
  return request({
    method: 'GET',
    url: ENDPOINT.ADMIN.TRAINING_STRUCTURE,
    params: { page, limit },
    signal,
  });
};

export const createTrainingStructure = async (data) => {
  return request({
    method: 'POST',
    url: ENDPOINT.ADMIN.TRAINING_STRUCTURE,
    data,
  });
};

export const updateTrainingStructure = async (id, data) => {
  return request({
    method: 'PUT',
    url: `${ENDPOINT.ADMIN.TRAINING_STRUCTURE}/${id}`,
    data,
  });
};

export const deleteTrainingStructure = async (id) => {
  return request({
    method: 'DELETE',
    url: `/api/v1/training-plans/${id}`,
  });
};

export const fetchCompletedEnrollments = async ({ page = 1, limit = 10, signal } = {}) => {
  return request({
    method: 'GET',
    url: '/api/v1/training-enrollment/all',
    params: {
      page,
      limit,
    },
    signal,
  });
};

export const exportEnrollments = async (format = 'csv') => {
  return request({
    method: 'GET',
    url: 'api/v1/training-enrollment/export',
    params: { format },
    responseType: 'blob',
  });
};
