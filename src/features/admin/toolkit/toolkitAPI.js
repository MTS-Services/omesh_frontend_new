import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from '../../../api/errorHandler';
import { fetchToolkitRequests, deleteToolkitRequest } from './toolkitService';

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

export const deleteAdminToolkitRequest = createAsyncThunk(
  'adminToolkit/delete',
  async (id, { rejectWithValue, signal }) => {
    try {
      await deleteToolkitRequest({ id, signal });
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
