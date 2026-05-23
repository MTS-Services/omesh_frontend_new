import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrainingCategoriesService } from './trainingService';
import { handleApiError } from '../../../api/errorHandler';

export const fetchTrainingCategoriesAPI = createAsyncThunk(
  'publicTraining/fetchCategories',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await fetchTrainingCategoriesService({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export { fetchTrainingCategoriesAPI as fetchTrainingCategories };
