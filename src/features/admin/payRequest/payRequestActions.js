import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './payRequestAPI';

// 1. Get All Requests
export const getAdminPayRequests = createAsyncThunk(
  'payRequests/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.fetchAdminPayRequests(params);
      return response.data ?? response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

// 2. Update Status
export const patchPayRequestStatus = createAsyncThunk(
  'payRequests/updateStatus',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await api.updatePayRequestStatus({ requestId, status });
      return { requestId, status, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);
