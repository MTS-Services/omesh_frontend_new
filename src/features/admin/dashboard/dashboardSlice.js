import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardStats, fetchDashboardSalesCount } from './dashboardAPI';

const initialState = {
  stats: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  salesCount: null,
  salesStatus: 'idle', // idle | loading | succeeded | failed
  salesError: null,
};

const dashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchDashboardSalesCount.pending, (state) => {
        state.salesStatus = 'loading';
        state.salesError = null;
      })
      .addCase(fetchDashboardSalesCount.fulfilled, (state, action) => {
        state.salesStatus = 'succeeded';
        state.salesCount = action.payload;
      })
      .addCase(fetchDashboardSalesCount.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.salesStatus = 'idle';
          return;
        }
        state.salesStatus = 'failed';
        state.salesError = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
