import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from '../../../api/errorHandler';
import { fetchToolkitRequests } from './toolkitService';

export const fetchAdminToolkitRequests = createAsyncThunk(
  'adminToolkit/fetchAll',
  async (query, { rejectWithValue, signal }) => {
    try {
      return await fetchToolkitRequests({ ...query, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
