import { createAsyncThunk } from '@reduxjs/toolkit';
import * as trainingStructureService from './trainingStructureService';
import { handleApiError } from '../../../api/errorHandler';

export const getTrainingStructures = createAsyncThunk(
  'trainingStructures/fetchAll',
  async (query = {}, { rejectWithValue, signal }) => {
    try {
      return await trainingStructureService.fetchTrainingStructures({ ...query, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addTrainingStructure = createAsyncThunk(
  'trainingStructures/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await trainingStructureService.createTrainingStructure(payload);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editTrainingStructure = createAsyncThunk(
  'trainingStructures/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trainingStructureService.updateTrainingStructure(id, data);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeTrainingStructure = createAsyncThunk(
  'trainingStructures/remove',
  async (id, { rejectWithValue }) => {
    try {
      await trainingStructureService.deleteTrainingStructure(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCompletedEnrollments = createAsyncThunk(
  'trainingStructures/fetchCompleted',
  async (query = {}, { rejectWithValue, signal }) => {
    try {
      // Ensure you have exported fetchCompletedEnrollments from your service file
      return await trainingStructureService.fetchCompletedEnrollments({ ...query, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
