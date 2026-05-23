import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAdminStats, fetchAdminSalesCount } from './dashboardService';
import { handleApiError } from '../../../api/errorHandler';

export const fetchDashboardStats = createAsyncThunk(
  'adminDashboard/fetchStats',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await fetchAdminStats({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchDashboardSalesCount = createAsyncThunk(
  'adminDashboard/fetchSalesCount',
  async (range = 'month', { rejectWithValue, signal }) => {
    try {
      return await fetchAdminSalesCount({ range, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
