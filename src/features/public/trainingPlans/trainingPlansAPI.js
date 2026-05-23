import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrainingPlansByCategory, fetchTrainingPlanById } from './trainingPlansService';
import { handleApiError } from '../../../api/errorHandler';

export const fetchTrainingPlansByCategoryAPI = createAsyncThunk(
  'publicTrainingPlans/fetchByCategory',
  async ({ category, params } = {}, { rejectWithValue, signal }) => {
    try {
      return await fetchTrainingPlansByCategory({ category, params, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchTrainingPlanByIdAPI = createAsyncThunk(
  'publicTrainingPlans/fetchById',
  async ({ id } = {}, { rejectWithValue, signal }) => {
    try {
      return await fetchTrainingPlanById({ id, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export { fetchTrainingPlansByCategoryAPI as fetchTrainingPlansByCategory };
