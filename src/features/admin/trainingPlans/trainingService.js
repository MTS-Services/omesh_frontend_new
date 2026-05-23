import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

export const fetchTrainingPlans = async ({ signal } = {}) => {
  return request({ method: 'GET', url: ENDPOINT.ADMIN.TRAINING_PLANS, signal });
};

export const createTrainingPlan = async (data) => {
  console.log('Creating training plan with data:', data);
  return request({ method: 'POST', url: ENDPOINT.ADMIN.TRAINING_PLANS, data });
};

export const updateTrainingPlan = async (id, data) => {
  return request({
    method: 'PATCH',
    url: `${ENDPOINT.ADMIN.TRAINING_PLANS}/${id}`,
    data,
  });
};

export const deleteTrainingPlan = async (id) => {
  return request({
    method: 'DELETE',
    url: `${ENDPOINT.ADMIN.TRAINING_PLANS}/${id}`,
  });
};
