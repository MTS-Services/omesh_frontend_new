import { createAsyncThunk } from '@reduxjs/toolkit';
import * as trainingService from './trainingService';
import { handleApiError } from '../../../api/errorHandler';

export const getTrainingPlans = createAsyncThunk(
  'training/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await trainingService.fetchTrainingPlans({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addTrainingPlan = createAsyncThunk(
  'training/add',
  async (planData, { rejectWithValue }) => {
    try {
      return await trainingService.createTrainingPlan(planData);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editTrainingPlan = createAsyncThunk(
  'training/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trainingService.updateTrainingPlan(id, data);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeTrainingPlan = createAsyncThunk(
  'training/remove',
  async (id, { rejectWithValue }) => {
    try {
      await trainingService.deleteTrainingPlan(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
